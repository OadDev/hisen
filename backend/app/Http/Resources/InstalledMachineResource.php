<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InstalledMachineResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'productName' => $this->product_name,
            'serialNumber' => $this->serial_number,
            'installedOn' => $this->installed_on,
            'warrantyEndsOn' => $this->warranty_ends_on,
            'amcActive' => (bool) $this->amc_active,
            'status' => $this->status,
        ];
    }
}
