<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerBranch extends Model
{
    protected $fillable = ['customer_id', 'name', 'city', 'state', 'country', 'address', 'is_head_office'];

    protected function casts(): array
    {
        return ['is_head_office' => 'boolean'];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
