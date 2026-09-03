<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AmcContract extends Model
{
    protected $fillable = [
        'code', 'customer_id', 'installed_machine_id', 'machine', 'serial_number',
        'start_date', 'end_date', 'visits_per_year', 'visits_completed', 'value', 'status', 'assigned_engineer_id',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'value' => 'decimal:2',
        ];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function installedMachine(): BelongsTo
    {
        return $this->belongsTo(InstalledMachine::class);
    }

    public function assignedEngineer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_engineer_id');
    }
}
