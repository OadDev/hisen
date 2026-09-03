<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\GoodsReceipt;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class GoodsReceiptController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return GoodsReceipt::class;
    }

    protected function with(): array
    {
        return ['purchaseOrder'];
    }

    protected function searchable(): array
    {
        return ['item', 'warehouse'];
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'purchase_order_id' => [$required, 'exists:purchase_orders,id'],
            'item' => [$required, 'string'],
            'quantity_received' => [$required, 'integer'],
            'quantity_ordered' => [$required, 'integer'],
            'received_date' => [$required, 'date'],
            'qc_status' => ['nullable', 'in:pending,passed,failed'],
            'warehouse' => ['nullable', 'string'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(GoodsReceipt::class, 'GRN', 6600);

        return response()->json(GoodsReceipt::create($data)->load('purchaseOrder'), 201);
    }
}
