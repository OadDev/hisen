<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\Shipment;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class ShipmentController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return Shipment::class;
    }

    protected function with(): array
    {
        return ['salesOrder.customer'];
    }

    protected function auditModule(): string
    {
        return 'Dispatch';
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'sales_order_id' => [$required, 'exists:sales_orders,id'],
            'destination' => ['nullable', 'string'],
            'container_no' => ['nullable', 'string'],
            'mode' => ['nullable', 'in:road,sea,air'],
            'status' => ['nullable', 'in:packing,ready,in-transit,delivered'],
            'dispatch_date' => ['nullable', 'date'],
            'eta' => ['nullable', 'date'],
            'export_docs_ready' => ['nullable', 'boolean'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(Shipment::class, 'SHP', 8800);

        return response()->json(Shipment::create($data)->load($this->with()), 201);
    }
}
