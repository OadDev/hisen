<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'name', 'industry', 'gstin', 'pan_number', 'currency',
        'credit_limit', 'credit_days', 'account_owner_id', 'status', 'tags', 'lifetime_value',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'credit_limit' => 'decimal:2',
            'lifetime_value' => 'decimal:2',
        ];
    }

    public function accountOwner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'account_owner_id');
    }

    public function branches(): HasMany
    {
        return $this->hasMany(CustomerBranch::class);
    }

    public function contacts(): HasMany
    {
        return $this->hasMany(CustomerContact::class);
    }

    public function installedMachines(): HasMany
    {
        return $this->hasMany(InstalledMachine::class);
    }

    public function quotations(): HasMany
    {
        return $this->hasMany(Quotation::class);
    }

    public function salesOrders(): HasMany
    {
        return $this->hasMany(SalesOrder::class);
    }

    public function serviceTickets(): HasMany
    {
        return $this->hasMany(ServiceTicket::class);
    }

    public function amcContracts(): HasMany
    {
        return $this->hasMany(AmcContract::class);
    }
}
