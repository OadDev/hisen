<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Ncr extends Model
{
    protected $table = 'ncrs';

    protected $fillable = ['code', 'work_order_id', 'stage', 'description', 'severity', 'status', 'raised_by', 'raised_on'];

    protected function casts(): array
    {
        return ['raised_on' => 'date'];
    }

    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class);
    }

    public function raisedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'raised_by');
    }
}
