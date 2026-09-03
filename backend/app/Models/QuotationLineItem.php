<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuotationLineItem extends Model
{
    protected $fillable = ['quotation_id', 'product_id', 'product_name', 'quantity', 'unit_price', 'discount_pct'];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'discount_pct' => 'decimal:2',
        ];
    }

    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
