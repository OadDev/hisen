<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\DeployController;
use Illuminate\Support\Facades\Route;

Route::get('/deploy-finalize/{secret}', [DeployController::class, 'finalize']);

Route::prefix('v1')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        require __DIR__.'/api/modules.php';
    });
});
