<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\CrudsSimpleResource;
use App\Http\Controllers\Controller;
use App\Models\Rfq;
use App\Traits\GeneratesCode;
use Illuminate\Http\Request;

class RfqController extends Controller
{
    use CrudsSimpleResource, GeneratesCode;

    protected function modelClass(): string
    {
        return Rfq::class;
    }

    protected function searchable(): array
    {
        return ['item'];
    }

    protected function rules(bool $isUpdate): array
    {
        $required = $isUpdate ? 'sometimes' : 'required';

        return [
            'item' => [$required, 'string'],
            'quantity' => [$required, 'integer', 'min:1'],
            'vendors_invited' => ['nullable', 'integer'],
            'quotes_received' => ['nullable', 'integer'],
            'status' => ['nullable', 'in:open,closed,awarded'],
            'due_date' => ['nullable', 'date'],
        ];
    }

    public function store(Request $request)
    {
        $data = $request->validate($this->rules(false));
        $data['code'] = self::nextCode(Rfq::class, 'RFQ', 5100);
        $rfq = Rfq::create($data);

        return response()->json($rfq, 201);
    }
}
