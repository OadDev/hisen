<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return Expense::class;
    }

    protected function with(): array
    {
        return ['submittedBy'];
    }

    protected function searchable(): array
    {
        return ['category', 'description'];
    }

    protected function auditModule(): string
    {
        return 'Finance';
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'category' => [$required, 'string'],
            'description' => ['nullable', 'string'],
            'amount' => [$required, 'numeric'],
            'expense_date' => [$required, 'date'],
            'status' => ['nullable', 'in:pending,approved,reimbursed'],
            'submitted_by' => ['nullable', 'exists:users,id'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(Expense::class, 'EXP', 900);

        return response()->json(Expense::create($data)->load($this->with()), 201);
    }
}
