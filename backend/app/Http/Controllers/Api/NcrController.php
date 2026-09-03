<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\Ncr;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class NcrController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return Ncr::class;
    }

    protected function with(): array
    {
        return ['workOrder', 'raisedBy'];
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
            'description' => [$required, 'string'],
            'severity' => ['nullable', 'in:minor,major,critical'],
            'status' => ['nullable', 'in:open,under-review,closed'],
            'raised_by' => ['nullable', 'exists:users,id'],
            'raised_on' => [$required, 'date'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(Ncr::class, 'NCR', 100);

        return response()->json(Ncr::create($data)->load($this->with()), 201);
    }
}
