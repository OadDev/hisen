<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'sku', 'name', 'category', 'sub_category', 'description', 'hsn', 'unit',
        'price', 'currency', 'status', 'specs', 'certifications',
        'has_video', 'has_pdf_catalog', 'warranty_months', 'lead_time_days',
    ];

    protected function casts(): array
    {
        return [
            'specs' => 'array',
            'certifications' => 'array',
            'price' => 'decimal:2',
            'has_video' => 'boolean',
            'has_pdf_catalog' => 'boolean',
        ];
    }

    public function bomComponents(): HasMany
    {
        return $this->hasMany(BomComponent::class, 'machine_product_id');
    }

    public function stockItems(): HasMany
    {
        return $this->hasMany(StockItem::class);
    }
}
