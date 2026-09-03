<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'vendor_id', 'rfq_id', 'item', 'quantity', 'unit_price',
        'total_value', 'status', 'order_date', 'expected_delivery',
    ];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'total_value' => 'decimal:2',
            'order_date' => 'date',
            'expected_delivery' => 'date',
        ];
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function rfq(): BelongsTo
    {
        return $this->belongsTo(Rfq::class);
    }

    public function goodsReceipts(): HasMany
    {
        return $this->hasMany(GoodsReceipt::class);
    }
}
