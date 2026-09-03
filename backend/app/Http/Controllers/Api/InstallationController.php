<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\Installation;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class InstallationController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return Installation::class;
    }

    protected function with(): array
    {
        return ['salesOrder.customer', 'engineer'];
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'sales_order_id' => [$required, 'exists:sales_orders,id'],
            'engineer_id' => ['nullable', 'exists:users,id'],
            'scheduled_date' => [$required, 'date'],
            'status' => ['nullable', 'in:scheduled,in-progress,completed'],
            'checklist_done' => ['nullable', 'integer'],
            'checklist_total' => ['nullable', 'integer'],
            'customer_signed' => ['nullable', 'boolean'],
            'training_completed' => ['nullable', 'boolean'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(Installation::class, 'INS', 900);

        return response()->json(Installation::create($data)->load($this->with()), 201);
    }
}
