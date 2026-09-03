<?php

namespace App\Support;

use Illuminate\Support\Facades\File;

class Installer
{
    public static function isInstalled(): bool
    {
        return File::exists(self::lockPath());
    }

    public static function markInstalled(): void
    {
        File::ensureDirectoryExists(dirname(self::lockPath()));
        File::put(self::lockPath(), json_encode([
            'installed_at' => now()->toIso8601String(),
        ], JSON_PRETTY_PRINT));
    }

    public static function lockPath(): string
    {
        return storage_path('app/installed.lock');
    }
}
