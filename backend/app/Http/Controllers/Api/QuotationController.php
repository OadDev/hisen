<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Customer;
use App\Models\Quotation;
use App\Models\QuotationLineItem;
use App\Models\QuotationVersion;
use App\Models\SalesOrder;
use App\Traits\GeneratesCode;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class QuotationController extends Controller
{
    use GeneratesCode;

    public function index(Request $request)
    {
        $query = Quotation::query()->with(['customer', 'owner', 'lineItems', 'versions']);

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        if ($priority = $request->string('priority')->toString()) {
            $query->where('priority', $priority);
        }

        $quotations = $query->orderByDesc('id')->paginate($request->integer('per_page', 25));
        $quotations->getCollection()->transform(fn (Quotation $quotation) => $this->withTotal($quotation));

        return $quotations;
    }

    public function show(string $code)
    {
        $quotation = Quotation::where('code', $code)->with(['customer', 'owner', 'lineItems', 'versions.updatedBy'])->firstOrFail();

        return $this->withTotal($quotation);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_id' => ['required', 'exists:customers,id'],
            'owner_id' => ['nullable', 'exists:users,id'],
            'currency' => ['nullable', 'string', 'size:3'],
            'valid_until' => ['nullable', 'date'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'discount_pct' => ['nullable', 'numeric'],
            'tax_pct' => ['nullable', 'numeric'],
            'line_items' => ['required', 'array', 'min:1'],
            'line_items.*.product_name' => ['required', 'string'],
            'line_items.*.quantity' => ['required', 'integer', 'min:1'],
            'line_items.*.unit_price' => ['required', 'numeric'],
            'line_items.*.discount_pct' => ['nullable', 'numeric'],
        ]);

        $quotation = DB::transaction(function () use ($data, $request) {
            $quotation = Quotation::create([
                'code' => self::nextCode(Quotation::class, 'QTN', 2400),
                'customer_id' => $data['customer_id'],
                'owner_id' => $data['owner_id'] ?? $request->user()?->id,
                'status' => 'draft',
                'priority' => $data['priority'] ?? 'medium',
                'currency' => $data['currency'] ?? Customer::find($data['customer_id'])->currency,
                'valid_until' => $data['valid_until'] ?? now()->addDays(30),
                'discount_pct' => $data['discount_pct'] ?? 0,
                'tax_pct' => $data['tax_pct'] ?? 18,
            ]);

            foreach ($data['line_items'] as $item) {
                QuotationLineItem::create([...$item, 'quotation_id' => $quotation->id]);
            }

            QuotationVersion::create([
                'quotation_id' => $quotation->id,
                'version' => 1,
                'updated_by' => $request->user()?->id,
                'note' => 'Initial quotation created',
            ]);

            return $quotation;
        });

        AuditLog::record('Created', "Quotation {$quotation->code}", 'Sales', $request->user()?->id);

        return response()->json($this->withTotal($quotation->load(['customer', 'owner', 'lineItems', 'versions'])), 201);
    }

    public function update(Request $request, string $code)
    {
        $quotation = Quotation::where('code', $code)->firstOrFail();

        $data = $request->validate([
            'status' => ['sometimes', 'in:draft,pending,approved,rejected,won,lost'],
            'priority' => ['sometimes', 'in:low,medium,high'],
            'watermark' => ['sometimes', 'boolean'],
            'discount_pct' => ['nullable', 'numeric'],
            'note' => ['nullable', 'string'],
        ]);

        $quotation->update(collect($data)->except('note')->toArray());

        if ($request->filled('note')) {
            QuotationVersion::create([
                'quotation_id' => $quotation->id,
                'version' => $quotation->versions()->max('version') + 1,
                'updated_by' => $request->user()?->id,
                'note' => $data['note'],
            ]);
        }

        AuditLog::record('Updated', "Quotation {$quotation->code}", 'Sales', $request->user()?->id);

        return $this->withTotal($quotation->fresh(['customer', 'owner', 'lineItems', 'versions']));
    }

    public function convertToSalesOrder(Request $request, string $code)
    {
        $quotation = Quotation::where('code', $code)->with('lineItems')->firstOrFail();
        $total = $this->calculateTotal($quotation);

        $order = SalesOrder::create([
            'code' => self::nextCode(SalesOrder::class, 'SO', 3300),
            'quotation_id' => $quotation->id,
            'customer_id' => $quotation->customer_id,
            'owner_id' => $quotation->owner_id,
            'status' => 'pending',
            'payment_status' => 'pending',
            'order_value' => $total,
            'advance_paid' => 0,
            'currency' => $quotation->currency,
            'order_date' => now(),
            'expected_dispatch' => now()->addDays(45),
            'production_progress' => 0,
        ]);

        $quotation->update(['status' => 'won']);

        AuditLog::record('Converted to Sales Order', "Quotation {$quotation->code} -> {$order->code}", 'Sales', $request->user()?->id);

        return response()->json($order->load(['customer', 'owner']), 201);
    }

    public function pdf(string $code)
    {
        $quotation = Quotation::where('code', $code)->with(['customer.branches', 'owner', 'lineItems'])->firstOrFail();
        $headOffice = $quotation->customer?->branches->firstWhere('is_head_office', true)
            ?? $quotation->customer?->branches->first();
        $totals = $this->totals($quotation);

        $pdf = Pdf::loadView('pdf.quotation', [
            'quotation' => $quotation,
            'headOffice' => $headOffice,
            ...$totals,
        ]);

        return $pdf->stream("{$quotation->code}.pdf");
    }

    private function calculateTotal(Quotation $quotation): float
    {
        return round($this->totals($quotation)['total'], 2);
    }

    private function totals(Quotation $quotation): array
    {
        $subtotal = $quotation->lineItems->sum(fn ($item) => $item->quantity * $item->unit_price * (1 - $item->discount_pct / 100));
        $afterDiscount = $subtotal * (1 - $quotation->discount_pct / 100);
        $tax = $afterDiscount * ($quotation->tax_pct / 100);

        return [
            'subtotal' => $subtotal,
            'afterDiscount' => $afterDiscount,
            'tax' => $tax,
            'total' => $afterDiscount + $tax,
        ];
    }

    private function withTotal(Quotation $quotation)
    {
        return collect($quotation->toArray())->put('total', $this->calculateTotal($quotation));
    }
}
