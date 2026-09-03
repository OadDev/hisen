<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'customer_id', 'subject', 'description', 'machine', 'priority',
        'status', 'engineer_id', 'sla_due_at', 'feedback_rating',
    ];

    protected function casts(): array
    {
        return ['sla_due_at' => 'datetime'];
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function engineer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'engineer_id');
    }
}
