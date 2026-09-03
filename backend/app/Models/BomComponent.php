<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BomComponent extends Model
{
    protected $fillable = ['machine_product_id', 'parent_id', 'part_no', 'name', 'quantity', 'unit', 'unit_cost', 'supplier'];

    protected function casts(): array
    {
        return ['unit_cost' => 'decimal:2'];
    }

    public function machine(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'machine_product_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(BomComponent::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(BomComponent::class, 'parent_id');
    }
}
