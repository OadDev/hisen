<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use CrudsSimpleResource;

    protected function modelClass(): string
    {
        return Product::class;
    }

    protected function searchable(): array
    {
        return ['name', 'sku', 'sub_category'];
    }

    protected function auditModule(): string
    {
        return 'Catalog';
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'sku' => [$required, 'string', 'max:50'],
            'name' => [$required, 'string', 'max:190'],
            'category' => [$required, 'in:Machines,Accessories,Consumables,Spare Parts'],
            'sub_category' => ['nullable', 'string'],
            'description' => ['nullable', 'string'],
            'hsn' => ['nullable', 'string'],
            'unit' => ['nullable', 'string'],
            'price' => ['nullable', 'numeric'],
            'currency' => ['nullable', 'string', 'size:3'],
            'status' => ['nullable', 'in:active,discontinued,draft'],
            'specs' => ['nullable', 'array'],
            'certifications' => ['nullable', 'array'],
            'warranty_months' => ['nullable', 'integer'],
            'lead_time_days' => ['nullable', 'integer'],
        ];
    }

    public function index(Request $request)
    {
        $query = Product::query();

        if ($category = $request->string('category')->toString()) {
            $query->where('category', $category);
        }

        if ($search = $request->string('search')->toString()) {
            $query->where('name', 'like', "%{$search}%");
        }

        return $query->orderBy('name')->paginate($request->integer('per_page', 50));
    }
}
