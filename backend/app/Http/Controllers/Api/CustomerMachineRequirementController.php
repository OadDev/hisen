<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\MachineRequirementResource;
use App\Models\AuditLog;
use App\Models\Customer;
use App\Models\CustomerMachineRequirement;
use App\Models\Product;
use Illuminate\Http\Request;

class CustomerMachineRequirementController extends Controller
{
    public function index(string $code)
    {
        $customer = Customer::where('code', $code)->firstOrFail();

        return MachineRequirementResource::collection(
            $customer->machineRequirements()->orderByDesc('id')->get()
        );
    }

    public function store(Request $request, string $code)
    {
        $customer = Customer::where('code', $code)->firstOrFail();

        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'unit_price' => ['nullable', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $product = Product::findOrFail($data['product_id']);

        $requirement = $customer->machineRequirements()->create([
            'product_id' => $product->id,
            'product_name' => $product->name,
            'specs' => $product->specs,
            'quantity' => $data['quantity'] ?? 1,
            'unit_price' => $data['unit_price'] ?? $product->price,
            'notes' => $data['notes'] ?? null,
        ]);

        AuditLog::record('Added', "Machine requirement \"{$product->name}\" for {$customer->name}", 'CRM', $request->user()?->id);

        return new MachineRequirementResource($requirement);
    }

    public function update(Request $request, CustomerMachineRequirement $machineRequirement)
    {
        $data = $request->validate([
            'quantity' => ['sometimes', 'integer', 'min:1'],
            'unit_price' => ['sometimes', 'numeric', 'min:0'],
            'notes' => ['nullable', 'string'],
        ]);

        $machineRequirement->update($data);

        return new MachineRequirementResource($machineRequirement);
    }

    public function destroy(Request $request, CustomerMachineRequirement $machineRequirement)
    {
        $customerName = $machineRequirement->customer?->name;
        $productName = $machineRequirement->product_name;
        $machineRequirement->delete();

        AuditLog::record('Removed', "Machine requirement \"{$productName}\" for {$customerName}", 'CRM', $request->user()?->id);

        return response()->json(status: 204);
    }
}
