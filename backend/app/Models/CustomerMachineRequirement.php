<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerMachineRequirement extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id', 'product_id', 'product_name', 'specs', 'quantity', 'unit_price', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'specs' => 'array',
            'unit_price' => 'decimal:2',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
