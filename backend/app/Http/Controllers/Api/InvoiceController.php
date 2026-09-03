<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return Invoice::class;
    }

    protected function with(): array
    {
        return ['salesOrder'];
    }

    protected function searchable(): array
    {
        return ['customer_name'];
    }

    protected function auditModule(): string
    {
        return 'Finance';
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'sales_order_id' => ['nullable', 'exists:sales_orders,id'],
            'customer_name' => [$required, 'string'],
            'amount' => [$required, 'numeric'],
            'amount_paid' => ['nullable', 'numeric'],
            'currency' => ['nullable', 'string', 'size:3'],
            'issued_date' => [$required, 'date'],
            'due_date' => [$required, 'date'],
            'status' => ['nullable', 'in:paid,partially-paid,pending,overdue'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(Invoice::class, 'INV', 3300);

        return response()->json(Invoice::create($data), 201);
    }
}
