<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quotation extends Model
{
    use HasFactory;

    protected $fillable = ['code', 'customer_id', 'owner_id', 'status', 'currency', 'valid_until', 'discount_pct', 'tax_pct'];

    protected function casts(): array
    {
        return [
            'valid_until' => 'date',
            'discount_pct' => 'decimal:2',
            'tax_pct' => 'decimal:2',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function lineItems(): HasMany
    {
        return $this->hasMany(QuotationLineItem::class);
    }

    public function versions(): HasMany
    {
        return $this->hasMany(QuotationVersion::class);
    }

    public function salesOrders(): HasMany
    {
        return $this->hasMany(SalesOrder::class);
    }

    public function total(): float
    {
        $subtotal = $this->lineItems->sum(fn ($item) => $item->quantity * $item->unit_price * (1 - $item->discount_pct / 100));
        $afterDiscount = $subtotal * (1 - $this->discount_pct / 100);

        return $afterDiscount * (1 + $this->tax_pct / 100);
    }
}
