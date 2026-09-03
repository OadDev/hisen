<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Installation extends Model
{
    protected $fillable = [
        'code', 'sales_order_id', 'engineer_id', 'scheduled_date', 'status',
        'checklist_done', 'checklist_total', 'customer_signed', 'training_completed',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_date' => 'date',
            'customer_signed' => 'boolean',
            'training_completed' => 'boolean',
        ];
    }

    public function salesOrder(): BelongsTo
    {
        return $this->belongsTo(SalesOrder::class);
    }

    public function engineer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'engineer_id');
    }
}
