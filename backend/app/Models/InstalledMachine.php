<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstalledMachine extends Model
{
    protected $fillable = [
        'customer_id', 'product_name', 'serial_number', 'installed_on',
        'warranty_ends_on', 'amc_active', 'status',
    ];

    protected function casts(): array
    {
        return [
            'installed_on' => 'date',
            'warranty_ends_on' => 'date',
            'amc_active' => 'boolean',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
