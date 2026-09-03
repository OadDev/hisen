<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class WarehouseController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return Warehouse::class;
    }

    protected function searchable(): array
    {
        return ['name', 'city'];
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'name' => [$required, 'string'],
            'city' => ['nullable', 'string'],
            'type' => ['nullable', 'in:main,regional,bonded'],
            'capacity_pct' => ['nullable', 'integer', 'min:0', 'max:100'],
            'bin_locations' => ['nullable', 'integer'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(Warehouse::class, 'WH', 10);

        return response()->json(Warehouse::create($data), 201);
    }
}
