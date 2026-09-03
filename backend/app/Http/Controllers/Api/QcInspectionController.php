<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\QcInspection;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class QcInspectionController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return QcInspection::class;
    }

    protected function with(): array
    {
        return ['workOrder', 'inspector'];
    }

    protected function auditModule(): string
    {
        return 'Quality Control';
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'work_order_id' => [$required, 'exists:work_orders,id'],
            'stage' => [$required, 'in:Incoming,Assembly,Electrical,PLC,Final,Packing'],
            'inspector_id' => ['nullable', 'exists:users,id'],
            'inspected_on' => [$required, 'date'],
            'result' => ['nullable', 'in:passed,failed,pending'],
            'checklist_items' => ['nullable', 'integer'],
            'checklist_passed' => ['nullable', 'integer'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(QcInspection::class, 'QC', 7700);

        return response()->json(QcInspection::create($data)->load($this->with()), 201);
    }
}
