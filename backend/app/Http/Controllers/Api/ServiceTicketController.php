<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\ServiceTicket;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class ServiceTicketController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return ServiceTicket::class;
    }

    protected function with(): array
    {
        return ['customer', 'engineer'];
    }

    protected function searchable(): array
    {
        return ['subject', 'machine'];
    }

    protected function auditModule(): string
    {
        return 'Service';
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'customer_id' => [$required, 'exists:customers,id'],
            'subject' => [$required, 'string'],
            'description' => ['nullable', 'string'],
            'machine' => ['nullable', 'string'],
            'priority' => ['nullable', 'in:low,medium,high,urgent'],
            'status' => ['nullable', 'in:open,in-progress,resolved,closed'],
            'engineer_id' => ['nullable', 'exists:users,id'],
            'sla_due_at' => ['nullable', 'date'],
            'feedback_rating' => ['nullable', 'integer', 'min:1', 'max:5'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(ServiceTicket::class, 'TCK', 1100);

        return response()->json(ServiceTicket::create($data)->load($this->with()), 201);
    }
}
