<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QcInspection extends Model
{
    protected $fillable = ['code', 'work_order_id', 'stage', 'inspector_id', 'inspected_on', 'result', 'checklist_items', 'checklist_passed'];

    protected function casts(): array
    {
        return ['inspected_on' => 'date'];
    }

    public function workOrder(): BelongsTo
    {
        return $this->belongsTo(WorkOrder::class);
    }

    public function inspector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'inspector_id');
    }
}
