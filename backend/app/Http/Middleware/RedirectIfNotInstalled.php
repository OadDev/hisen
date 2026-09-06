<?php

namespace App\Http\Middleware;

use App\Support\Installer;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfNotInstalled
{
    public function handle(Request $request, Closure $next): Response
    {
        if (Installer::isInstalled() || $this->isExempt($request)) {
            return $next($request);
        }

        if ($request->expectsJson() || $request->is('v1/*')) {
            return response()->json([
                'message' => 'The application has not been installed yet.',
                'install_url' => url('/install'),
            ], 503);
        }

        return redirect('/install');
    }

    private function isExempt(Request $request): bool
    {
        return $request->is('install')
            || $request->is('install/*')
            || $request->is('up');
    }
}
