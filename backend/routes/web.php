<?php

use App\Http\Controllers\Install\InstallController;
use App\Support\Installer;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Installer::isInstalled()
        ? response()->json(['status' => 'ok', 'message' => 'Hisen Machinery ERP API'])
        : redirect('/install');
});

Route::prefix('install')->name('install.')->group(function () {
    Route::get('/', [InstallController::class, 'requirements'])->name('requirements');
    Route::get('/database', [InstallController::class, 'showDatabaseForm'])->name('database');
    Route::post('/database', [InstallController::class, 'testDatabase'])->name('database.test');
    Route::get('/admin', [InstallController::class, 'showAdminForm'])->name('admin');
    Route::post('/admin', [InstallController::class, 'runInstall'])->name('admin.submit');
    Route::get('/complete', [InstallController::class, 'complete'])->name('complete');
});
