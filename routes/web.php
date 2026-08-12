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
        Route::patch('/{user}/modulo-perfiles', [RrhhUserController::class, 'updateModuloPerfiles'])->name('modulo-perfiles');
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

Route::middleware(['auth', 'verified'])->prefix('cementerio')->name('cementerio.')->group(function () {
    Route::get('/registro-fallecido', [App\Http\Controllers\Cementerio\FallecidoController::class, 'index'])->name('registro-fallecido');
    Route::post('/registro-fallecido', [App\Http\Controllers\Cementerio\FallecidoController::class, 'store'])->name('registro-fallecido.store');
    Route::get('/registro-fallecido/{fallecido}', [App\Http\Controllers\Cementerio\FallecidoController::class, 'show'])->name('registro-fallecido.show');
    Route::put('/registro-fallecido/{fallecido}', [App\Http\Controllers\Cementerio\FallecidoController::class, 'update'])->name('registro-fallecido.update');
    Route::delete('/registro-fallecido/{fallecido}', [App\Http\Controllers\Cementerio\FallecidoController::class, 'destroy'])->name('registro-fallecido.destroy');
    Route::get('/buscar-fallecidos', [App\Http\Controllers\Cementerio\FallecidoController::class, 'search'])->name('fallecidos.search');
    Route::get('/fallecido/{fallecido}/detalle', [App\Http\Controllers\Cementerio\FallecidoController::class, 'detalle'])->name('fallecidos.detalle');

    Route::get('/historial-deudores', [App\Http\Controllers\Cementerio\DeudorController::class, 'index'])->name('historial-deudores');
    Route::post('/historial-deudores', [App\Http\Controllers\Cementerio\DeudorController::class, 'store'])->name('historial-deudores.store');
    Route::put('/historial-deudores/{deudor}', [App\Http\Controllers\Cementerio\DeudorController::class, 'update'])->name('historial-deudores.update');
    Route::delete('/historial-deudores/{deudor}', [App\Http\Controllers\Cementerio\DeudorController::class, 'destroy'])->name('historial-deudores.destroy');
    Route::get('/buscar-deudores', [App\Http\Controllers\Cementerio\DeudorController::class, 'search'])->name('deudores.search');

    Route::get('/ingresar-ot', function () {
        return inertia('Cementerio/IngresarOt', [
            'relaciones' => \App\Models\Cementerio\Relacion::orderBy('nombre_relacion')->get(['id', 'nombre_relacion']),
            'financiamientos' => \App\Models\Cementerio\Financiamiento::orderBy('nombre')->get(['id', 'nombre', 'valor_arriendo']),
            'servicios' => \App\Models\Cementerio\Servicio::orderBy('nombre')->get(['id', 'nombre', 'valor_servicio']),
            'sectores' => \App\Models\Cementerio\Sector::orderBy('nombre')->get(['id', 'nombre']),
            'tipos_ubicacion' => \App\Models\Cementerio\TipoUbicacion::orderBy('nombre')->get(['id', 'nombre']),
            'formas_pago' => \App\Models\Cementerio\FormaPago::orderBy('nombre')->get(['id', 'nombre']),
            'estados_ubicacion_default' => 1,
        ]);
    })->name('ingresar-ot');

    Route::post('/ingresar-ot', [App\Http\Controllers\Cementerio\OtController::class, 'store'])->name('ingresar-ot.store');
    Route::get('/ot/{ot}/detalle', [App\Http\Controllers\Cementerio\OtController::class, 'detalle'])->name('ot.detalle');
    Route::put('/ot/{ot}', [App\Http\Controllers\Cementerio\OtController::class, 'update'])->name('ot.update');
    Route::get('/ot/{ot}/cuotas', [App\Http\Controllers\Cementerio\OtController::class, 'cuotas'])->name('ot.cuotas');
    Route::put('/cuotas/{cuota}/pagar', [App\Http\Controllers\Cementerio\OtController::class, 'pagar'])->name('cuotas.pagar');
    Route::get('/ot/{ot}/imprimir', [App\Http\Controllers\Cementerio\OtController::class, 'imprimir'])->name('ot.imprimir');
    Route::get('/formas-pago', [App\Http\Controllers\Cementerio\OtController::class, 'formasPago'])->name('formas-pago');
    Route::get('/referencias-ot', function () {
        return response()->json([
            'relaciones' => \App\Models\Cementerio\Relacion::orderBy('nombre_relacion')->get(['id', 'nombre_relacion']),
            'financiamientos' => \App\Models\Cementerio\Financiamiento::orderBy('nombre')->get(['id', 'nombre', 'valor_arriendo']),
            'servicios' => \App\Models\Cementerio\Servicio::orderBy('nombre')->get(['id', 'nombre', 'valor_servicio']),
            'sectores' => \App\Models\Cementerio\Sector::orderBy('nombre')->get(['id', 'nombre']),
            'tipos_ubicacion' => \App\Models\Cementerio\TipoUbicacion::orderBy('nombre')->get(['id', 'nombre']),
            'estados' => \App\Models\Cementerio\OtEstado::orderBy('id')->get(['id', 'nombre']),
        ]);
    });
    Route::get('/cuotas/{cuota}/comprobante', [App\Http\Controllers\Cementerio\OtController::class, 'comprobante'])->name('cuotas.comprobante');

    Route::get('/buscar-ot', function () {
        $ots = \App\Models\Cementerio\Ot::with(['fallecido', 'deudor', 'servicios', 'tipoFinanciamiento', 'estado'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($ot) => [
                'numero_ot' => $ot->numero_ot,
                'fallecido_nombre' => $ot->fallecido?->nombre_completo ?? '—',
                'fallecido_identificador' => $ot->fallecido?->identificador ?? '—',
                'deudor_nombre' => $ot->deudor?->nombre_completo_deudor ?? '—',
                'deudor_identificador' => $ot->deudor ? ($ot->deudor->rut . '-' . $ot->deudor->dv) : '—',
                'servicios' => ($ot->tipoFinanciamiento?->nombre ?? '—') . ' - ' . $ot->servicios->pluck('nombre')->implode(' - '),
                'total' => $ot->total,
                'estado' => $ot->estado?->nombre ?? '—',
                'created_at' => $ot->created_at?->format('Y-m-d'),
            ]);

        return inertia('Cementerio/BuscarOt', [
            'ots' => $ots,
        ]);
    })->name('buscar-ot');

    Route::get('/buscar-por-fallecido', function () {
        return inertia('Cementerio/BuscarPorFallecido');
    })->name('buscar-por-fallecido');

    Route::get('/verificar-rut', [App\Http\Controllers\Cementerio\FallecidoController::class, 'verificarRut'])
        ->name('fallecidos.verificar-rut');

    Route::get('/buscar-fallecido-ubicacion', [App\Http\Controllers\Cementerio\FallecidoController::class, 'buscarUbicacion'])
        ->name('buscar-fallecido-ubicacion');

    Route::get('/consultar-ubicaciones', function () {
        return inertia('Cementerio/ConsultarUbicaciones', [
            'tipos' => \App\Models\Cementerio\TipoUbicacion::orderBy('nombre')->get(['id', 'nombre']),
            'sectores' => \App\Models\Cementerio\Sector::orderBy('nombre')->get(['id', 'nombre']),
            'estados' => \App\Models\Cementerio\EstadoUbicacion::orderBy('nombre')->get(['id', 'nombre']),
            'sexos' => \App\Models\Cementerio\Sexo::orderBy('id')->get(['id', 'slug', 'nombre']),
            'estadosCiviles' => \App\Models\Cementerio\EstadoCivil::orderBy('id')->get(['id', 'slug', 'nombre']),
        ]);
    })->name('consultar-ubicaciones');

    Route::get('/ubicaciones/consultar-data', function (\Illuminate\Http\Request $request) {
        $query = \App\Models\Cementerio\Ubicacion::with([
            'tipoUbicacion', 'sector', 'estadoUbicacion',
            'fallecidosActivos.fallecido.sexo',
            'fallecidosActivos.fallecido.estadoCivil',
        ]);

        if ($request->filled('tipo'))
            $query->where('tipo_ubicacion_id', $request->tipo);
        if ($request->filled('sector'))
            $query->where('sector_id', $request->sector);
        if ($request->filled('estado'))
            $query->where('estado_ubicacion_id', $request->estado);

        $ubicaciones = $query->get()->map(fn ($u) => [
            'codigo' => $u->codigo,
            'tipo' => $u->tipoUbicacion->nombre,
            'sector' => $u->sector->nombre,
            'estado' => $u->estadoUbicacion->nombre,
            'capacidad' => $u->capacidad,
            'ocupados' => $u->fallecidosActivos->count(),
            'fallecidos' => $u->fallecidosActivos->map(fn ($fu) => [
                'id' => $fu->fallecido->id,
                'nombre' => $fu->fallecido->nombre_completo,
                'rut_fallecido' => $fu->fallecido->rut_fallecido,
                'codigo_nn' => $fu->fallecido->codigo_nn,
                'nombres_fallecido' => $fu->fallecido->nombres_fallecido,
                'apellido_paterno_fallecido' => $fu->fallecido->apellido_paterno_fallecido,
                'apellido_materno_fallecido' => $fu->fallecido->apellido_materno_fallecido,
                'fecha_nacimiento_fallecido' => $fu->fallecido->fecha_nacimiento_fallecido?->format('Y-m-d'),
                'fecha_fallecimiento' => $fu->fallecido->fecha_fallecimiento?->format('Y-m-d'),
                'sexo_id' => $fu->fallecido->sexo_id,
                'sexo_nombre' => $fu->fallecido->sexo?->nombre,
                'estado_civil_id' => $fu->fallecido->estado_civil_id,
                'estado_civil_nombre' => $fu->fallecido->estadoCivil?->nombre,
                'nacionalidad_fallecido' => $fu->fallecido->nacionalidad_fallecido,
                'lugar_fallecimiento' => $fu->fallecido->lugar_fallecimiento,
                'observaciones' => $fu->fallecido->observaciones,
                'es_nn' => $fu->fallecido->es_nn,
                'registrador_id' => $fu->fallecido->registrador_id,
                'carta_defuncion' => $fu->fallecido->carta_defuncion,
                'fecha_sepultacion' => $fu->fecha_asignacion?->format('d-m-Y') ?? '',
                'ot_id' => \App\Models\Cementerio\Ot::where('fallecido_id', $fu->fallecido_id)->latest()?->first()?->numero_ot ?? '',
            ]),
        ]);

        return response()->json($ubicaciones);
    })->name('ubicaciones.consultar-data');

    Route::get('/documentos', function () {
        return inertia('Cementerio/Documentos');
    })->name('documentos');

    Route::get('/reportes', function () {
        $ingresos = \App\Models\Cementerio\Cuota::with([
            'ot.fallecido',
            'ot.tipoFinanciamiento',
            'ot.servicios',
        ])->latest()->get()->map(fn ($cuota) => [
            'id' => $cuota->id,
            'ot_id' => $cuota->ot?->numero_ot ?? '—',
            'fallecido' => $cuota->ot?->fallecido?->nombre_completo ?? '—',
            'servicio' => ($cuota->ot?->tipoFinanciamiento?->nombre ?? '')
                . ($cuota->ot?->servicios?->isNotEmpty()
                    ? ' - ' . $cuota->ot->servicios->pluck('nombre')->join(', ')
                    : ''),
            'cuota' => $cuota->numero_cuota . '/' . $cuota->total_cuotas,
            'monto' => $cuota->monto,
            'fecha_ultimo_pago' => $cuota->fecha_pago?->format('d-m-Y') ?? '—',
            'estado' => $cuota->estado,
        ]);

        $cuotasPorVencer = \App\Models\Cementerio\Cuota::with([
            'ot.fallecido',
            'ot.tipoFinanciamiento',
            'ot.servicios',
        ])
            ->whereIn('estado', ['pendiente', 'parcial'])
            ->get()
            ->map(fn ($cuota) => [
                'id' => $cuota->id,
                'fallecido' => $cuota->ot?->fallecido?->nombre_completo ?? '—',
                'ot_id' => $cuota->ot?->numero_ot ?? '—',
                'servicio' => ($cuota->ot?->tipoFinanciamiento?->nombre ?? '')
                    . ($cuota->ot?->servicios?->isNotEmpty()
                        ? ' - ' . $cuota->ot->servicios->pluck('nombre')->join(', ')
                        : ''),
                'cuota' => $cuota->numero_cuota . '/' . $cuota->total_cuotas,
                'fecha_vencimiento' => $cuota->fecha_vencimiento->format('d-m-Y'),
                'dias_restantes' => (int) now()->startOfDay()->diffInDays($cuota->fecha_vencimiento, false),
                'estado' => $cuota->fecha_vencimiento->isPast()
                    ? 'vencida'
                    : (now()->startOfDay()->diffInDays($cuota->fecha_vencimiento) <= 7
                        ? 'proximo_vencimiento'
                        : 'futura'),
            ]);

        return inertia('Cementerio/Reportes', [
            'ingresos' => $ingresos,
            'cuotasPorVencer' => $cuotasPorVencer,
        ]);
    })->name('reportes');
});

Route::middleware(['auth', 'verified'])->prefix('asistencia')->name('asistencia.')->group(function () {
    Route::get('/', function () {
        return to_route('asistencia.dashboard');
    });

    Route::get('/dashboard', function () {
        return inertia('Asistencia/Dashboard/Index');
    })->name('dashboard');

    Route::get('/reportes/por-funcionario', function () {
        return inertia('Asistencia/Reportes/PorFuncionario');
    })->name('reportes.por-funcionario');

    Route::get('/reportes/por-unidad', function () {
        return inertia('Asistencia/Reportes/PorUnidad');
    })->name('reportes.por-unidad');

    Route::get('/reportes/por-unidad/diario', function () {
        return inertia('Asistencia/Reportes/PorUnidad/Diario');
    })->name('reportes.por-unidad.diario');

    Route::get('/reportes/por-unidad/mensual', function () {
        return inertia('Asistencia/Reportes/PorUnidad/Mensual');
    })->name('reportes.por-unidad.mensual');

    Route::get('/horarios', function () {
        return inertia('Asistencia/Horarios/Index');
    })->name('horarios');
});
