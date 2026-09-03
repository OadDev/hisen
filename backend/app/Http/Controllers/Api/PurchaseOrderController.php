<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class PurchaseOrderController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return PurchaseOrder::class;
    }

    protected function with(): array
    {
        return ['vendor'];
    }

    protected function searchable(): array
    {
        return ['item'];
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'vendor_id' => [$required, 'exists:vendors,id'],
            'rfq_id' => ['nullable', 'exists:rfqs,id'],
            'item' => [$required, 'string'],
            'quantity' => [$required, 'integer', 'min:1'],
            'unit_price' => [$required, 'numeric'],
            'status' => ['nullable', 'in:draft,pending,approved,dispatched,received,cancelled'],
            'order_date' => [$required, 'date'],
            'expected_delivery' => ['nullable', 'date'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(PurchaseOrder::class, 'PO', 4400);
        $data['total_value'] = $data['quantity'] * $data['unit_price'];
        $po = PurchaseOrder::create($data);

        return response()->json($po->load('vendor'), 201);
    }

    public function update(Request $request, string $id)
    {
        $po = is_numeric($id) ? PurchaseOrder::findOrFail($id) : PurchaseOrder::where('code', $id)->firstOrFail();
        $data = $request->validate($this->rules(true));

        if (isset($data['quantity']) || isset($data['unit_price'])) {
            $data['total_value'] = ($data['quantity'] ?? $po->quantity) * ($data['unit_price'] ?? $po->unit_price);
        }

        $po->update($data);

        return $po->fresh('vendor');
    }
}
