<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\Payable;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class PayableController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return Payable::class;
    }

    protected function with(): array
    {
        return ['vendor'];
    }

    protected function searchable(): array
    {
        return ['vendor_name'];
    }

    protected function auditModule(): string
    {
        return 'Finance';
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'vendor_id' => ['nullable', 'exists:vendors,id'],
            'vendor_name' => [$required, 'string'],
            'amount' => [$required, 'numeric'],
            'due_date' => [$required, 'date'],
            'status' => ['nullable', 'in:pending,paid,overdue'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(Payable::class, 'PAY', 700);

        return response()->json(Payable::create($data), 201);
    }
}
