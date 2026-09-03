<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vendor extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'name', 'category', 'city', 'country', 'rating', 'on_time_delivery_pct',
        'quality_score', 'lead_time_days', 'certifications', 'total_orders', 'total_spend', 'status',
    ];

    protected function casts(): array
    {
        return [
            'certifications' => 'array',
            'rating' => 'decimal:1',
            'total_spend' => 'decimal:2',
        ];
    }

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function payables(): HasMany
    {
        return $this->hasMany(Payable::class);
    }
}
