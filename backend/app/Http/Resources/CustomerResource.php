<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->code,
            'name' => $this->name,
            'industry' => $this->industry,
            'gstin' => $this->gstin,
            'panNumber' => $this->pan_number,
            'currency' => $this->currency,
            'creditLimit' => (float) $this->credit_limit,
            'creditDays' => $this->credit_days,
            'accountOwner' => $this->whenLoaded('accountOwner', fn () => $this->accountOwner?->name),
            'status' => $this->status,
            'tags' => $this->tags ?? [],
            'lifetimeValue' => (float) $this->lifetime_value,
            'branches' => BranchResource::collection($this->whenLoaded('branches')),
            'contacts' => ContactResource::collection($this->whenLoaded('contacts')),
            'installedMachines' => InstalledMachineResource::collection($this->whenLoaded('installedMachines')),
            'createdAt' => $this->created_at,
        ];
    }
}
