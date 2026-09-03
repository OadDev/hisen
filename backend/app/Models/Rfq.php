<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rfq extends Model
{
    protected $table = 'rfqs';

    protected $fillable = ['code', 'item', 'quantity', 'vendors_invited', 'quotes_received', 'status', 'due_date'];

    protected function casts(): array
    {
        return ['due_date' => 'date'];
    }

    public function purchaseOrders(): HasMany
    {
        return $this->hasMany(PurchaseOrder::class);
    }
}
