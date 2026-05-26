<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Rrhh\RrhhUserController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return to_route('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::prefix('rrhh')->name('rrhh.')->group(function () {
        Route::get('/', [RrhhUserController::class, 'index'])->name('index');
        Route::get('/create', [RrhhUserController::class, 'create'])->name('create');
        Route::post('/', [RrhhUserController::class, 'store'])->name('store');
        Route::get('/{user}/edit', [RrhhUserController::class, 'edit'])->name('edit');
        Route::patch('/{user}', [RrhhUserController::class, 'update'])->name('update');
        Route::post('/{user}/ordenes', [RrhhUserController::class, 'storeOtt'])->name('ordenes.store');
        Route::delete('/ordenes/{orden}', [RrhhUserController::class, 'destroyOtt'])->name('ordenes.destroy');
        Route::post('/ordenes/{orden}/archivos', [RrhhUserController::class, 'storeOttFile'])->name('ordenes.archivos.store');
        Route::delete('/ordenes/archivos/{archivo}', [RrhhUserController::class, 'destroyOttFile'])->name('ordenes.archivos.destroy');
        Route::get('/ordenes/archivos/{archivo}/descargar', [RrhhUserController::class, 'downloadOttFile'])->name('ordenes.archivos.download');
        Route::post('/{user}/permisos', [RrhhUserController::class, 'storePermiso'])->name('permisos.store');
        Route::delete('/permisos/{permiso}', [RrhhUserController::class, 'destroyPermiso'])->name('permisos.destroy');
        Route::patch('/permisos/{permiso}/aceptar', [RrhhUserController::class, 'aceptarPermiso'])->name('permisos.aceptar');
        Route::patch('/permisos/{permiso}/rechazar', [RrhhUserController::class, 'rechazarPermiso'])->name('permisos.rechazar');
        Route::post('/{user}/vacaciones', [RrhhUserController::class, 'storeVacacion'])->name('vacaciones.store');
        Route::post('/{user}/vacaciones/historico', [RrhhUserController::class, 'storeVacacionHistorico'])->name('vacaciones.historico');
        Route::delete('/vacaciones/{vacacion}', [RrhhUserController::class, 'destroyVacacion'])->name('vacaciones.destroy');
        Route::patch('/vacaciones/{vacacion}/aceptar', [RrhhUserController::class, 'aceptarVacacion'])->name('vacaciones.aceptar');
        Route::patch('/vacaciones/{vacacion}/rechazar', [RrhhUserController::class, 'rechazarVacacion'])->name('vacaciones.rechazar');
        Route::patch('/vacaciones/{vacacion}/anular', [RrhhUserController::class, 'anularVacacion'])->name('vacaciones.anular');
        Route::patch('/{user}/permisos-sistema', [RrhhUserController::class, 'storePermisosSistema'])->name('permisos-sistema');
    });

    Route::prefix('portal')->name('portal.')->group(function () {
        Route::get('/', [\App\Http\Controllers\PortalController::class, 'index'])->name('index');
        Route::post('/permisos', [\App\Http\Controllers\PortalController::class, 'storePermiso'])->name('permisos.store');
        Route::post('/vacaciones', [\App\Http\Controllers\PortalController::class, 'storeVacacion'])->name('vacaciones.store');
    });

    Route::prefix('solicitudes')->name('solicitudes.')->group(function () {
        Route::get('/', [\App\Http\Controllers\SolicitudesController::class, 'index'])->name('index');
        Route::patch('/permisos/{permiso}/aceptar', [\App\Http\Controllers\SolicitudesController::class, 'aceptarPermiso'])->name('permisos.aceptar');
        Route::patch('/permisos/{permiso}/rechazar', [\App\Http\Controllers\SolicitudesController::class, 'rechazarPermiso'])->name('permisos.rechazar');
        Route::patch('/vacaciones/{vacacion}/aceptar', [\App\Http\Controllers\SolicitudesController::class, 'aceptarVacacion'])->name('vacaciones.aceptar');
        Route::patch('/vacaciones/{vacacion}/rechazar', [\App\Http\Controllers\SolicitudesController::class, 'rechazarVacacion'])->name('vacaciones.rechazar');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
