<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\StockTransfer;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class StockTransferController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return StockTransfer::class;
    }

    protected function with(): array
    {
        return ['fromWarehouse', 'toWarehouse'];
    }

    protected function searchable(): array
    {
        return ['item'];
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'item' => [$required, 'string'],
            'quantity' => [$required, 'integer', 'min:1'],
            'from_warehouse_id' => [$required, 'exists:warehouses,id'],
            'to_warehouse_id' => [$required, 'exists:warehouses,id', 'different:from_warehouse_id'],
            'status' => ['nullable', 'in:pending,in-transit,completed'],
            'requested_date' => [$required, 'date'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(StockTransfer::class, 'TRF', 100);

        return response()->json(StockTransfer::create($data)->load(['fromWarehouse', 'toWarehouse']), 201);
    }
}
