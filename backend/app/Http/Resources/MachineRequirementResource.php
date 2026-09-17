<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MachineRequirementResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'productId' => $this->product_id,
            'productName' => $this->product_name,
            'specs' => $this->specs ?? [],
            'quantity' => $this->quantity,
            'unitPrice' => (float) $this->unit_price,
            'notes' => $this->notes,
            'createdAt' => $this->created_at,
        ];
    }
}
