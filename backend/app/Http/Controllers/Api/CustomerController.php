<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CustomerResource;
use App\Models\AuditLog;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::query()->with(['accountOwner', 'branches', 'installedMachines']);

        if ($search = $request->string('search')->toString()) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        return CustomerResource::collection($query->orderByDesc('id')->paginate($request->integer('per_page', 25)));
    }

    public function show(string $code)
    {
        $customer = Customer::where('code', $code)->with(['accountOwner', 'branches', 'contacts', 'installedMachines'])->firstOrFail();

        return new CustomerResource($customer);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:190'],
            'industry' => ['nullable', 'string'],
            'gstin' => ['nullable', 'string'],
            'pan_number' => ['nullable', 'string'],
            'currency' => ['nullable', 'string', 'size:3'],
            'credit_limit' => ['nullable', 'numeric'],
            'credit_days' => ['nullable', 'integer'],
            'account_owner_id' => ['nullable', 'exists:users,id'],
            'status' => ['nullable', 'in:active,inactive,prospect'],
            'tags' => ['nullable', 'array'],
        ]);

        $data['code'] = 'CUS-'.Str::padLeft((string) (Customer::max('id') + 1000), 4, '0');

        $customer = Customer::create($data);

        AuditLog::record('Created', "Customer {$customer->name}", 'CRM', $request->user()?->id);

        return new CustomerResource($customer);
    }

    public function update(Request $request, string $code)
    {
        $customer = Customer::where('code', $code)->firstOrFail();

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:190'],
            'industry' => ['nullable', 'string'],
            'currency' => ['nullable', 'string', 'size:3'],
            'credit_limit' => ['nullable', 'numeric'],
            'credit_days' => ['nullable', 'integer'],
            'account_owner_id' => ['nullable', 'exists:users,id'],
            'status' => ['nullable', 'in:active,inactive,prospect'],
            'tags' => ['nullable', 'array'],
        ]);

        $customer->update($data);

        AuditLog::record('Updated', "Customer {$customer->name}", 'CRM', $request->user()?->id);

        return new CustomerResource($customer);
    }

    public function destroy(Request $request, string $code)
    {
        $customer = Customer::where('code', $code)->firstOrFail();
        $customer->delete();

        AuditLog::record('Deleted', "Customer {$customer->name}", 'CRM', $request->user()?->id);

        return response()->json(status: 204);
    }
}
