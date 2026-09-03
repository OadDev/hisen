<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Shipment extends Model
{
    protected $fillable = [
        'code', 'sales_order_id', 'destination', 'container_no', 'mode',
        'status', 'dispatch_date', 'eta', 'export_docs_ready',
    ];

    protected function casts(): array
    {
        return [
            'dispatch_date' => 'date',
            'eta' => 'date',
            'export_docs_ready' => 'boolean',
        ];
    }

    public function salesOrder(): BelongsTo
    {
        return $this->belongsTo(SalesOrder::class);
    }
}
