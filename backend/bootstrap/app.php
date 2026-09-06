<?php

use App\Http\Middleware\EnsureUserHasRole;
use App\Http\Middleware\RedirectIfNotInstalled;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        // Laravel prefixes api.php routes with "api/" by default. This app is
        // deployed with Laravel's own document root mounted at <domain>/api
        // (see .github/workflows/deploy.yml), so that default would produce
        // a doubled "/api/api/v1/..." URL. routes/api.php already declares
        // its own "v1" prefix, so disable Laravel's automatic one here.
        apiPrefix: '',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->append(RedirectIfNotInstalled::class);

        $middleware->alias([
            'role' => EnsureUserHasRole::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->shouldRenderJsonWhen(function ($request, Throwable $e) {
            return $request->is('v1/*') || $request->expectsJson();
        });
    })->create();
