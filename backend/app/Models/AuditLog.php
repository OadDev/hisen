<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    protected $fillable = ['actor_id', 'action', 'entity', 'module', 'ip_address'];

    public function actor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'actor_id');
    }

    public static function record(string $action, string $entity, string $module, ?int $actorId = null): self
    {
        return self::create([
            'actor_id' => $actorId,
            'action' => $action,
            'entity' => $entity,
            'module' => $module,
            'ip_address' => request()->ip(),
        ]);
    }
}
