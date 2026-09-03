<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait GeneratesCode
{
    protected static function nextCode(string $modelClass, string $prefix, int $base = 1000, int $pad = 4): string
    {
        $max = $modelClass::max('id') ?? 0;

        return $prefix.'-'.Str::padLeft((string) ($max + $base), $pad, '0');
    }
}
