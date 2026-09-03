<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\AmcContract;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class AmcContractController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return AmcContract::class;
    }

    protected function with(): array
    {
        return ['customer', 'assignedEngineer'];
    }

    protected function searchable(): array
    {
        return ['machine', 'serial_number'];
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'customer_id' => [$required, 'exists:customers,id'],
            'installed_machine_id' => ['nullable', 'exists:installed_machines,id'],
            'machine' => [$required, 'string'],
            'serial_number' => [$required, 'string'],
            'start_date' => [$required, 'date'],
            'end_date' => [$required, 'date'],
            'visits_per_year' => ['nullable', 'integer'],
            'visits_completed' => ['nullable', 'integer'],
            'value' => ['nullable', 'numeric'],
            'status' => ['nullable', 'in:active,expiring-soon,expired'],
            'assigned_engineer_id' => ['nullable', 'exists:users,id'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(AmcContract::class, 'AMC', 5000);

        return response()->json(AmcContract::create($data)->load($this->with()), 201);
    }
}
