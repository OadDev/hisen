<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Artisan;

class DeployController extends Controller
{
    public function finalize(string $secret): JsonResponse
    {
        $expected = (string) config('app.deploy_secret');
        abort_if($expected === '' || ! hash_equals($expected, $secret), 404);

        Artisan::call('package:discover');
        Artisan::call('migrate', ['--force' => true]);
        $migrateOutput = Artisan::output();
        Artisan::call('config:cache');
        Artisan::call('route:cache');
        Artisan::call('view:cache');

        return response()->json(['status' => 'ok', 'migrate' => $migrateOutput]);
    }
}
