<?php

namespace App\Support;

class EnvironmentWriter
{
    /**
     * Update (or add) one or more key=value pairs in the application's .env file.
     *
     * @param  array<string, string>  $values
     */
    public static function update(array $values): void
    {
        $path = base_path('.env');

        if (! file_exists($path)) {
            touch($path);
        }

        $content = file_get_contents($path);

        foreach ($values as $key => $value) {
            $escaped = self::formatValue($value);
            $pattern = '/^'.preg_quote($key, '/').'=.*/m';

            if (preg_match($pattern, $content)) {
                $content = preg_replace($pattern, "{$key}={$escaped}", $content);
            } else {
                $content = rtrim($content)."\n{$key}={$escaped}\n";
            }
        }

        file_put_contents($path, $content);
    }

    private static function formatValue(string $value): string
    {
        if ($value === '' || preg_match('/\s|#|"/', $value)) {
            return '"'.str_replace('"', '\"', $value).'"';
        }

        return $value;
    }
}
