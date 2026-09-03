<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\WorkOrder;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class WorkOrderController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return WorkOrder::class;
    }

    protected function with(): array
    {
        return ['salesOrder', 'assignedEngineer'];
    }

    protected function searchable(): array
    {
        return ['machine_name'];
    }

    protected function auditModule(): string
    {
        return 'Production';
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'sales_order_id' => [$required, 'exists:sales_orders,id'],
            'machine_name' => [$required, 'string'],
            'stage' => ['nullable', 'in:Assembly,Electrical,PLC Programming,Testing,Final QC,Dispatch Ready'],
            'progress' => ['nullable', 'integer', 'min:0', 'max:100'],
            'assigned_engineer_id' => ['nullable', 'exists:users,id'],
            'start_date' => [$required, 'date'],
            'due_date' => [$required, 'date'],
            'priority' => ['nullable', 'in:low,medium,high'],
            'status' => ['nullable', 'in:on-track,delayed,completed'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(WorkOrder::class, 'WO', 2100);

        return response()->json(WorkOrder::create($data)->load($this->with()), 201);
    }
}
