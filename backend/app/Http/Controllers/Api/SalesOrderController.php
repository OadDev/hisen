<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\SalesOrder;
use Illuminate\Http\Request;

class SalesOrderController extends Controller
{
    public function index(Request $request)
    {
        $query = SalesOrder::query()->with(['customer', 'owner']);

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        return $query->orderByDesc('id')->paginate($request->integer('per_page', 25));
    }

    public function show(string $code)
    {
        return SalesOrder::where('code', $code)
            ->with(['customer', 'owner', 'quotation.lineItems', 'workOrders', 'shipment', 'installation', 'invoices'])
            ->firstOrFail();
    }

    public function update(Request $request, string $code)
    {
        $order = SalesOrder::where('code', $code)->firstOrFail();

        $data = $request->validate([
            'status' => ['sometimes', 'in:pending,in-progress,production,dispatched,installed,completed,cancelled'],
            'payment_status' => ['sometimes', 'in:pending,partially-paid,paid,overdue'],
            'advance_paid' => ['nullable', 'numeric'],
            'production_progress' => ['nullable', 'integer', 'min:0', 'max:100'],
        ]);

        $order->update($data);

        AuditLog::record('Updated', "Sales Order {$order->code}", 'Sales', $request->user()?->id);

        return $order->fresh(['customer', 'owner']);
    }
}
