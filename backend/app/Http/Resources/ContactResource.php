<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'designation' => $this->designation,
            'email' => $this->email,
            'phone' => $this->phone,
            'isPrimary' => (bool) $this->is_primary,
        ];
    }
}
