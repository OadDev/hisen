<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BomComponent;
use Illuminate\Http\Request;

class BomComponentController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['product_id' => ['required', 'exists:products,id']]);

        $tree = BomComponent::where('machine_product_id', $request->integer('product_id'))
            ->whereNull('parent_id')
            ->with('children')
            ->get();

        return response()->json($tree);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'machine_product_id' => ['required', 'exists:products,id'],
            'parent_id' => ['nullable', 'exists:bom_components,id'],
            'part_no' => ['required', 'string'],
            'name' => ['required', 'string'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'unit' => ['nullable', 'string'],
            'unit_cost' => ['nullable', 'numeric'],
            'supplier' => ['nullable', 'string'],
        ]);

        return response()->json(BomComponent::create($data), 201);
    }

    public function update(Request $request, BomComponent $bomComponent)
    {
        $data = $request->validate([
            'part_no' => ['sometimes', 'string'],
            'name' => ['sometimes', 'string'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'unit_cost' => ['nullable', 'numeric'],
            'supplier' => ['nullable', 'string'],
        ]);

        $bomComponent->update($data);

        return $bomComponent;
    }

    public function destroy(BomComponent $bomComponent)
    {
        $bomComponent->delete();

        return response()->json(status: 204);
    }
}
