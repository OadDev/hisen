<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\WarrantyClaim;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class WarrantyClaimController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return WarrantyClaim::class;
    }

    protected function auditModule(): string
    {
        return 'Spare Parts';
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'product_id' => ['nullable', 'exists:products,id'],
            'part_name' => [$required, 'string'],
            'customer_name' => [$required, 'string'],
            'status' => ['nullable', 'in:submitted,under-review,approved,rejected'],
            'submitted_on' => [$required, 'date'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(WarrantyClaim::class, 'WC', 300);

        return response()->json(WarrantyClaim::create($data), 201);
    }
}
