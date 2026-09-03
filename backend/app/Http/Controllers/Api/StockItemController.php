<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\StockItem;
use Illuminate\Http\Request;

class StockItemController extends Controller
{
    use CrudsSimpleResource;

    protected function modelClass(): string
    {
        return StockItem::class;
    }

    protected function with(): array
    {
        return ['warehouse'];
    }

    protected function searchable(): array
    {
        return ['name', 'sku'];
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'sku' => [$required, 'string'],
            'name' => [$required, 'string'],
            'category' => ['nullable', 'string'],
            'warehouse_id' => [$required, 'exists:warehouses,id'],
            'bin_location' => ['nullable', 'string'],
            'quantity' => ['nullable', 'integer'],
            'reorder_level' => ['nullable', 'integer'],
            'unit' => ['nullable', 'string'],
            'batch_number' => ['nullable', 'string'],
            'status' => ['nullable', 'in:in_stock,low_stock,out_of_stock'],
        ];
    }
}
