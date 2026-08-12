<?php

namespace App\Http\Controllers\Rrhh;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ott\StoreOttFileRequest;
use App\Http\Requests\Ott\StoreOttRequest;
use App\Http\Requests\Permiso\StorePermisoRequest;
use App\Http\Requests\Rrhh\StoreUserRequest;
use App\Http\Requests\Rrhh\UpdateUserRequest;
use App\Http\Requests\Vacacion\StoreVacacionRequest;
use App\Http\Requests\Vacacion\StoreVacacionHistoricoRequest;
use App\Helpers\RutHelper;
use App\Helpers\VacacionesHelper;
use App\Models\Afp;
use App\Models\CentroCosto;
use App\Models\Estado;
use App\Models\EstadoOtt;
use App\Models\EstadoPermiso;
use App\Models\Nacionalidad;
use App\Models\OrdenTrabajo;
use App\Models\OttFile;
use App\Models\Permiso;
use App\Models\PermisoDetalle;
use App\Models\Prevision;
use App\Models\Profesion;
use App\Models\Sexo;
use App\Models\TipoContrato;
use App\Models\TipoOrden;
use App\Models\TipoPermiso;
use App\Models\User;
use App\Models\Vacacione;
use App\Notifications\PermisoAceptada;
use App\Notifications\PermisoCreada;
use App\Notifications\PermisoRechazada;
use App\Notifications\VacacionAceptada;
use App\Notifications\VacacionAnulada;
use App\Notifications\VacacionCreada;
use App\Notifications\VacacionRechazada;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RrhhUserController extends Controller
{
    public function index(Request $request): Response
    {
        $users = User::with(['sexo', 'nacionalidad', 'profesion', 'prevision', 'afp', 'estado'])
            ->when($request->search, fn ($q, $search) => $q->search($search))
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($user) => [
                'id' => $user->id,
                'rut_formateado' => $user->rutCompleto,
                'name' => $user->name,
                'nombres' => $user->nombres,
                'apellido_paterno' => $user->apellido_paterno,
                'apellido_materno' => $user->apellido_materno,
                'email' => $user->email,
                'fecha_ingreso' => $user->fecha_ingreso?->format('d/m/Y'),
                'estado' => $user->estado?->nombre ?? 'Sin estado',
                'foto_perfil_url' => $user->foto_perfil_url,
                'created_at' => $user->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Rrhh/Index', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Rrhh/Create', [
            'sexos' => Sexo::orderBy('nombre')->get(['id', 'nombre']),
            'nacionalidades' => Nacionalidad::orderBy('nombre')->get(['id', 'nombre']),
            'profesiones' => Profesion::orderBy('nombre')->get(['id', 'nombre']),
            'previsiones' => Prevision::orderBy('nombre')->get(['id', 'nombre']),
            'afps' => Afp::orderBy('nombre')->get(['id', 'nombre']),
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $rutNumerico = (int) explode('-', $request->id)[0];

        preg_match('/[kK0-9]$/', $request->id, $dvMatch);
        $dvIngresado = strtoupper($dvMatch[0] ?? '');
        $dvEsperado = RutHelper::digitoVerificador($rutNumerico);

        if ($dvIngresado !== $dvEsperado) {
            throw ValidationException::withMessages([
                'id' => 'El RUT ingresado no es válido.',
            ]);
        }

        if (User::whereKey($rutNumerico)->exists()) {
            throw ValidationException::withMessages([
                'id' => 'Este RUT ya está registrado.',
            ]);
        }

        User::create([
            'id' => $rutNumerico,
            'nombres' => $request->nombres,
            'apellido_paterno' => $request->apellido_paterno,
            'apellido_materno' => $request->apellido_materno,
            'email' => $request->email,
            'password' => (string) $rutNumerico,
            'email_verified_at' => now(),
            'sexo_id' => $request->sexo_id,
            'nacionalidad_id' => $request->nacionalidad_id,
            'profesion_id' => $request->profesion_id,
            'prevision_id' => $request->prevision_id,
            'afp_id' => $request->afp_id,
            'estado_id' => Estado::firstOrCreate(['nombre' => 'Activo'])->id,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'telefono' => $request->telefono,
            'direccion' => $request->direccion,
            'fecha_ingreso' => $request->fecha_ingreso,
        ]);

        return redirect()->route('rrhh.index')
            ->with('success', "Usuario {$request->nombres} {$request->apellido_paterno} creado correctamente.");
    }

    public function edit(int $id): Response
    {
        $user = User::with(['sexo', 'nacionalidad', 'profesion', 'prevision', 'afp', 'estado'])
            ->findOrFail($id);

        $ordenes = OrdenTrabajo::with([
            'tipoOrden', 'tipoContrato', 'centroCosto', 'estadoOtt',
            'afp', 'prevision', 'userCreador', 'files.userCreador',
        ])
            ->where('user_id_asignado', $id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($o) => [
                'id' => $o->id,
                'ott_display' => $o->ott_display,
                'tipo_orden' => $o->tipoOrden?->nombre,
                'tipo_contrato' => $o->tipoContrato?->nombre,
                'fecha_inicio' => $o->fecha_inicio->format('d/m/Y'),
                'fecha_termino' => $o->fecha_termino?->format('d/m/Y'),
                'jornada_horas' => $o->jornada_horas,
                'centro_costo' => $o->centroCosto?->nombre,
                'nivel' => $o->nivel,
                'afp' => $o->afp?->nombre,
                'prevision' => $o->prevision?->nombre,
                'estado' => $o->estadoOtt?->nombre,
                'creado_por' => $o->userCreador?->name,
                'created_at' => $o->created_at->format('d/m/Y H:i'),
                'files' => $o->files->map(fn ($f) => [
                    'id' => $f->id,
                    'nombre_original' => $f->nombre_original,
                    'mime_type' => $f->mime_type,
                    'tamano' => $f->tamano_formateado,
                    'creado_por' => $f->userCreador?->name,
                    'created_at' => $f->created_at->format('d/m/Y H:i'),
                ]),
            ]);

        $permisos = Permiso::with([
            'tipoPermiso', 'estadoPermiso', 'userCreador', 'userGestion', 'detalles',
        ])
            ->where('user_id', $id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($p) => [
                'id' => $p->id,
                'permiso_display' => $p->permiso_display,
                'tipo_permiso' => $p->tipoPermiso?->nombre,
                'fecha_inicio' => $p->fecha_inicio->format('d/m/Y'),
                'fecha_termino' => $p->fecha_termino?->format('d/m/Y'),
                'jornada' => $p->jornada,
                'bloques_consumidos' => $p->bloques_consumidos,
                'detalle' => $p->detalle,
                'dias_solicitados' => $p->dias_solicitados,
                'detalles' => $p->detalles->map(fn($d) => [
                    'fecha' => $d->fecha->format('Y-m-d'),
                    'jornada' => $d->jornada,
                    'bloques' => $d->bloques,
                ]),
                'motivo' => $p->motivo,
                'estado' => $p->estadoPermiso?->nombre,
                'fecha_gestion' => $p->fecha_gestion?->format('d/m/Y'),
                'gestionado_por' => $p->userGestion?->name,
                'observacion_rechazo' => $p->observacion_rechazo,
                'creado_por' => $p->userCreador?->name,
                'created_at' => $p->created_at->format('d/m/Y H:i'),
            ]);

        $conGoceId = TipoPermiso::where('nombre', 'Con Goce de Sueldo')->value('id');

        $vacaciones = Vacacione::with(['estadoVacacione', 'userCreador', 'userGestion', 'periodos'])
            ->where('user_id', $id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($v) => [
                'id' => $v->id,
                'fecha_inicio' => $v->fecha_inicio?->format('d/m/Y'),
                'fecha_termino' => $v->fecha_termino?->format('d/m/Y'),
                'dias_solicitados' => $v->dias_solicitados,
                'periodos' => $v->periodos->map(fn($p) => [
                    'periodo_numero' => $p->periodo_numero,
                    'dias_consumidos' => $p->dias_consumidos,
                ]),
                'motivo' => $v->motivo,
                'estado' => $v->estadoVacacione?->nombre,
                'fecha_gestion' => $v->fecha_gestion?->format('d/m/Y'),
                'gestionado_por' => $v->userGestion?->name,
                'observacion_rechazo' => $v->observacion_rechazo,
                'observacion_anulacion' => $v->observacion_anulacion,
                'creado_por' => $v->userCreador?->name,
                'created_at' => $v->created_at->format('d/m/Y H:i'),
            ]);

        $periodosVacaciones = collect(VacacionesHelper::calcularPeriodos($user->fecha_ingreso))
            ->map(fn($p) => [
                ...$p,
                'dias_correspondientes' => VacacionesHelper::calcularDiasCorrespondientes(
                    $p['numero'],
                    VacacionesHelper::esSalud($id)
                ),
                'dias_usados' => VacacionesHelper::calcularDiasUsados($id, $p['numero']),
            ])
            ->toArray();

        return Inertia::render('Rrhh/Edit', [
            'user' => [
                'id' => $user->id,
                'rut_formateado' => $user->rutCompleto,
                'nombres' => $user->nombres,
                'apellido_paterno' => $user->apellido_paterno,
                'apellido_materno' => $user->apellido_materno,
                'email' => $user->email,
                'sexo_id' => $user->sexo_id,
                'nacionalidad_id' => $user->nacionalidad_id,
                'profesion_id' => $user->profesion_id,
                'prevision_id' => $user->prevision_id,
                'afp_id' => $user->afp_id,
                'estado_id' => $user->estado_id,
                'fecha_nacimiento' => $user->fecha_nacimiento?->format('Y-m-d'),
                'telefono' => $user->telefono,
                'direccion' => $user->direccion,
                'fecha_ingreso' => $user->fecha_ingreso?->format('Y-m-d'),
            ],
            'ordenes' => $ordenes,
            'lista_permisos' => $permisos,
            'sexos' => Sexo::orderBy('nombre')->get(['id', 'nombre']),
            'nacionalidades' => Nacionalidad::orderBy('nombre')->get(['id', 'nombre']),
            'profesiones' => Profesion::orderBy('nombre')->get(['id', 'nombre']),
            'previsiones' => Prevision::orderBy('nombre')->get(['id', 'nombre']),
            'afps' => Afp::orderBy('nombre')->get(['id', 'nombre']),
            'estados' => Estado::orderBy('nombre')->get(['id', 'nombre']),
            'tipos_orden' => TipoOrden::orderBy('nombre')->get(['id', 'nombre']),
            'tipos_contrato' => TipoContrato::orderBy('nombre')->get(['id', 'nombre']),
            'centros_costo' => CentroCosto::orderBy('nombre')->get(['id', 'nombre']),
            'estados_ott' => EstadoOtt::orderBy('nombre')->get(['id', 'nombre']),
            'tipos_permiso' => TipoPermiso::orderBy('nombre')->get(['id', 'nombre']),
            'estados_permiso' => EstadoPermiso::orderBy('nombre')->get(['id', 'nombre']),
            'con_goce_id' => $conGoceId,
            'bloques_anuales' => [
                'usados' => PermisoDetalle::whereHas('permiso', fn($q) => $q
                    ->where('user_id', $id)
                    ->where('tipo_permiso_id', $conGoceId)
                    ->where('estado_permiso_id', EstadoPermiso::where('nombre', 'Aceptada')->value('id'))
                )
                    ->whereYear('fecha', now()->year)
                    ->sum('bloques'),
                'total' => 12,
            ],
            'vacaciones' => $vacaciones,
            'periodos_vacaciones' => $periodosVacaciones,
            'permisos_sistema' => \App\Models\PermisoSistema::all(['id', 'nombre', 'slug', 'descripcion']),
            'user_permisos' => $user->permisosSistema->pluck('slug'),
        ]);
    }

    public function update(int $id, UpdateUserRequest $request): RedirectResponse
    {
        $user = User::findOrFail($id);
        $user->update($request->safe()->toArray());

        return redirect()->route('rrhh.index')
            ->with('success', "Usuario {$user->nombres} {$user->apellido_paterno} actualizado correctamente.");
    }

    public function storeOtt(int $userId, StoreOttRequest $request): RedirectResponse
    {
        $user = User::findOrFail($userId);

        OrdenTrabajo::create([
            'tipo_orden_id' => $request->tipo_orden_id,
            'user_id_asignado' => $user->id,
            'user_id_creador' => auth()->id(),
            'afp_id' => $request->afp_id,
            'prevision_id' => $request->prevision_id,
            'tipo_contrato_id' => $request->tipo_contrato_id,
            'fecha_inicio' => $request->fecha_inicio,
            'fecha_termino' => $request->fecha_termino,
            'jornada_horas' => $request->jornada_horas,
            'centro_costo_id' => $request->centro_costo_id,
            'nivel' => $request->nivel,
            'estado_ott_id' => EstadoOtt::where('nombre', 'Ingresada')->value('id'),
        ]);

        return redirect()->route('rrhh.edit', $user->id)
            ->with('success', 'Orden de trabajo creada correctamente.');
    }

    public function destroyOtt(int $ordenId): RedirectResponse
    {
        $orden = OrdenTrabajo::findOrFail($ordenId);
        $userId = $orden->user_id_asignado;
        $orden->delete();

        return redirect()->route('rrhh.edit', $userId)
            ->with('success', 'Orden de trabajo eliminada correctamente.');
    }

    public function storePermiso(int $userId, StorePermisoRequest $request): RedirectResponse
    {
        $user = User::findOrFail($userId);

        $conGoceId = TipoPermiso::where('nombre', 'Con Goce de Sueldo')->value('id');
        $esConGoce = $request->tipo_permiso_id == $conGoceId;

        if ($esConGoce) {
            $bloquesNuevos = collect($request->detalles)->sum(fn($d) => $d['jornada'] === 'completo' ? 2 : 1);

            $aceptadaId = EstadoPermiso::where('nombre', 'Aceptada')->value('id');

            $bloquesUsados = PermisoDetalle::whereHas('permiso', fn($q) => $q
                ->where('user_id', $user->id)
                ->where('tipo_permiso_id', $conGoceId)
                ->where('estado_permiso_id', $aceptadaId)
            )
                ->whereYear('fecha', now()->year)
                ->sum('bloques');

            if (($bloquesUsados + $bloquesNuevos) > 12) {
                return redirect()->back()
                    ->withErrors(['detalles' => 'Has alcanzado el límite de 12 bloques anuales para "Con Goce de Sueldo". Te quedan ' . (12 - $bloquesUsados) . ' bloque(s).'])
                    ->withInput();
            }
        }

        $permiso = Permiso::create([
            'user_id' => $user->id,
            'user_id_creador' => auth()->id(),
            'tipo_permiso_id' => $request->tipo_permiso_id,
            'fecha_inicio' => $esConGoce ? collect($request->detalles)->min('fecha') : $request->fecha_inicio,
            'fecha_termino' => $esConGoce ? null : $request->fecha_termino,
            'jornada' => null,
            'bloques_consumidos' => null,
            'motivo' => $request->motivo,
            'estado_permiso_id' => EstadoPermiso::where('nombre', 'Ingresada')->value('id'),
        ]);

        if ($esConGoce) {
            foreach ($request->detalles as $d) {
                $permiso->detalles()->create([
                    'fecha' => $d['fecha'],
                    'jornada' => $d['jornada'],
                    'bloques' => $d['jornada'] === 'completo' ? 2 : 1,
                ]);
            }
        }

        $permiso->userAsignado->notify(new PermisoCreada($permiso));

        return redirect()->route('rrhh.edit', $user->id)
            ->with('success', 'Permiso creado correctamente.');
    }

    public function destroyPermiso(int $permisoId): RedirectResponse
    {
        $permiso = Permiso::findOrFail($permisoId);
        $userId = $permiso->user_id;
        $permiso->delete();

        return redirect()->route('rrhh.edit', $userId)
            ->with('success', 'Permiso eliminado correctamente.');
    }

    public function aceptarPermiso(int $permisoId): RedirectResponse
    {
        $permiso = Permiso::findOrFail($permisoId);

        if ($permiso->estadoPermiso?->nombre !== 'Ingresada') {
            return redirect()->back()
                ->with('error', 'Solo se pueden aceptar permisos en estado Ingresada.');
        }

        $permiso->update([
            'estado_permiso_id' => EstadoPermiso::where('nombre', 'Aceptada')->value('id'),
            'fecha_gestion' => now(),
            'user_id_gestion' => auth()->id(),
        ]);

        $permiso->userAsignado->notify(new PermisoAceptada($permiso));

        return redirect()->route('rrhh.edit', $permiso->user_id)
            ->with('success', 'Permiso aceptado correctamente.');
    }

    public function rechazarPermiso(int $permisoId, Request $request): RedirectResponse
    {
        $permiso = Permiso::findOrFail($permisoId);

        if ($permiso->estadoPermiso?->nombre !== 'Ingresada') {
            return redirect()->back()
                ->with('error', 'Solo se pueden rechazar permisos en estado Ingresada.');
        }

        $validated = $request->validate([
            'observacion_rechazo' => ['required', 'string', 'min:5'],
        ]);

        $permiso->update([
            'estado_permiso_id' => EstadoPermiso::where('nombre', 'Rechazada')->value('id'),
            'fecha_gestion' => now(),
            'user_id_gestion' => auth()->id(),
            'observacion_rechazo' => $validated['observacion_rechazo'],
        ]);

        $permiso->userAsignado->notify(new PermisoRechazada($permiso));

        return redirect()->route('rrhh.edit', $permiso->user_id)
            ->with('success', 'Permiso rechazado correctamente.');
    }

    public function storeVacacion(int $userId, StoreVacacionRequest $request): RedirectResponse
    {
        $user = User::findOrFail($userId);

        $inicio = $request->date('fecha_inicio');
        $fin = $request->date('fecha_termino');
        $diasSolicitados = VacacionesHelper::contarDiasHabiles($inicio, $fin);
        $esSalud = VacacionesHelper::esSalud($user->id);
        $aniosServicio = (int) $user->fecha_ingreso->diffInYears(now());

        $vacacion = Vacacione::create([
            'user_id' => $user->id,
            'user_id_creador' => auth()->id(),
            'estado_vacaciones_id' => \App\Models\EstadoVacacione::where('nombre', 'Ingresada')->value('id'),
            'fecha_inicio' => $inicio,
            'fecha_termino' => $fin,
            'dias_solicitados' => $diasSolicitados,
            'motivo' => $request->motivo,
        ]);

        $remaining = $diasSolicitados;
        for ($i = 1; $i <= $aniosServicio && $remaining > 0; $i++) {
            $corresponden = VacacionesHelper::calcularDiasCorrespondientes($i, $esSalud);
            $usados = VacacionesHelper::calcularDiasUsados($user->id, $i);
            $restantes = max(0, $corresponden - $usados);
            if ($restantes <= 0) continue;
            $consumir = min($restantes, $remaining);
            \App\Models\VacacionPeriodo::create([
                'vacacion_id' => $vacacion->id,
                'periodo_numero' => $i,
                'dias_consumidos' => $consumir,
            ]);
            $remaining -= $consumir;
        }

        $vacacion->user->notify(new VacacionCreada($vacacion));

        return redirect()->route('rrhh.edit', $user->id)
            ->with('success', 'Solicitud de vacaciones creada correctamente.');
    }

    public function storeVacacionHistorico(int $userId, StoreVacacionHistoricoRequest $request): RedirectResponse
    {
        $user = User::findOrFail($userId);

        $dias = (int) $request->dias;
        $esSalud = VacacionesHelper::esSalud($user->id);
        $aniosServicio = (int) $user->fecha_ingreso->diffInYears(now());

        $vacacion = Vacacione::create([
            'user_id' => $user->id,
            'user_id_creador' => auth()->id(),
            'user_id_gestion' => auth()->id(),
            'estado_vacaciones_id' => \App\Models\EstadoVacacione::where('nombre', 'Aceptada')->value('id'),
            'dias_solicitados' => $dias,
            'motivo' => 'Registro histórico',
            'fecha_gestion' => now(),
        ]);

        $remaining = $dias;
        $periodosAfectados = [];
        for ($i = 1; $i <= $aniosServicio && $remaining > 0; $i++) {
            $corresponden = VacacionesHelper::calcularDiasCorrespondientes($i, $esSalud);
            $usados = VacacionesHelper::calcularDiasUsados($user->id, $i);
            $restantes = max(0, $corresponden - $usados);
            if ($restantes <= 0) continue;
            $consumir = min($restantes, $remaining);
            \App\Models\VacacionPeriodo::create([
                'vacacion_id' => $vacacion->id,
                'periodo_numero' => $i,
                'dias_consumidos' => $consumir,
            ]);
            $periodosAfectados[] = "Período {$i}: {$consumir} día(s)";
            $remaining -= $consumir;
        }

        return redirect()->route('rrhh.edit', $user->id)
            ->with('success', 'Vacaciones históricas registradas: ' . implode(', ', $periodosAfectados) . '.');
    }

    public function aceptarVacacion(int $vacacionId): RedirectResponse
    {
        $vacacion = Vacacione::findOrFail($vacacionId);

        if ($vacacion->estadoVacacione?->nombre !== 'Ingresada') {
            return redirect()->back()
                ->with('error', 'Solo se pueden aceptar solicitudes en estado Ingresada.');
        }

        $vacacion->update([
            'estado_vacaciones_id' => \App\Models\EstadoVacacione::where('nombre', 'Aceptada')->value('id'),
            'fecha_gestion' => now(),
            'user_id_gestion' => auth()->id(),
        ]);

        $vacacion->user->notify(new VacacionAceptada($vacacion));

        return redirect()->route('rrhh.edit', $vacacion->user_id)
            ->with('success', 'Vacaciones aceptadas correctamente.');
    }

    public function rechazarVacacion(int $vacacionId, Request $request): RedirectResponse
    {
        $vacacion = Vacacione::findOrFail($vacacionId);

        if ($vacacion->estadoVacacione?->nombre !== 'Ingresada') {
            return redirect()->back()
                ->with('error', 'Solo se pueden rechazar solicitudes en estado Ingresada.');
        }

        $validated = $request->validate([
            'observacion_rechazo' => ['required', 'string', 'min:5'],
        ]);

        $vacacion->update([
            'estado_vacaciones_id' => \App\Models\EstadoVacacione::where('nombre', 'Rechazada')->value('id'),
            'fecha_gestion' => now(),
            'user_id_gestion' => auth()->id(),
            'observacion_rechazo' => $validated['observacion_rechazo'],
        ]);

        $vacacion->user->notify(new VacacionRechazada($vacacion));

        return redirect()->route('rrhh.edit', $vacacion->user_id)
            ->with('success', 'Vacaciones rechazadas correctamente.');
    }

    public function anularVacacion(int $vacacionId, Request $request): RedirectResponse
    {
        $vacacion = Vacacione::findOrFail($vacacionId);

        if ($vacacion->estadoVacacione?->nombre !== 'Aceptada') {
            return redirect()->back()
                ->with('error', 'Solo se pueden anular vacaciones en estado Aceptada.');
        }

        $validated = $request->validate([
            'observacion_anulacion' => ['required', 'string', 'min:5'],
        ]);

        $vacacion->update([
            'estado_vacaciones_id' => \App\Models\EstadoVacacione::where('nombre', 'Anulada')->value('id'),
            'fecha_gestion' => now(),
            'user_id_gestion' => auth()->id(),
            'observacion_anulacion' => $validated['observacion_anulacion'],
        ]);

        $vacacion->user->notify(new VacacionAnulada($vacacion));

        return redirect()->route('rrhh.edit', $vacacion->user_id)
            ->with('success', 'Vacaciones anuladas correctamente.');
    }

    public function destroyVacacion(int $vacacionId): RedirectResponse
    {
        $vacacion = Vacacione::findOrFail($vacacionId);

        if ($vacacion->estadoVacacione?->nombre !== 'Ingresada') {
            return redirect()->back()
                ->with('error', 'Solo se pueden eliminar solicitudes en estado Ingresada.');
        }

        $userId = $vacacion->user_id;
        $vacacion->delete();

        return redirect()->route('rrhh.edit', $userId)
            ->with('success', 'Solicitud de vacaciones eliminada correctamente.');
    }

    public function storeOttFile(int $ordenId, StoreOttFileRequest $request): RedirectResponse
    {
        $orden = OrdenTrabajo::findOrFail($ordenId);

        $file = $request->file('archivo');
        $extension = $file->getClientOriginalExtension();
        $nombreOriginal = $file->getClientOriginalName();
        $uuid = (string) \Illuminate\Support\Str::uuid();

        $nombreArchivo = "{$uuid}.{$extension}";
        $path = $file->storeAs("ott-files/{$ordenId}", $nombreArchivo, 's3');

        $orden->files()->create([
            'user_id_creador' => auth()->id(),
            'nombre_original' => $nombreOriginal,
            'nombre_archivo' => $path,
            'mime_type' => $file->getClientMimeType(),
            'tamano' => $file->getSize(),
        ]);

        return redirect()->route('rrhh.edit', $orden->user_id_asignado)
            ->with('success', 'Archivo subido correctamente.');
    }

    public function destroyOttFile(int $fileId): RedirectResponse
    {
        $file = OttFile::findOrFail($fileId);
        $userId = $file->ordenTrabajo->user_id_asignado;

        Storage::disk('s3')->delete($file->nombre_archivo);
        $file->delete();

        return redirect()->route('rrhh.edit', $userId)
            ->with('success', 'Archivo eliminado correctamente.');
    }

    public function downloadOttFile(int $fileId)
    {
        $file = OttFile::findOrFail($fileId);

        return Storage::disk('s3')->download($file->nombre_archivo, $file->nombre_original);
    }

    public function storePermisosSistema(int $userId, Request $request): RedirectResponse
    {
        $user = User::findOrFail($userId);

        $validated = $request->validate([
            'permisos' => ['nullable', 'array'],
            'permisos.*' => ['string', 'exists:permisos_sistema,slug'],
        ]);

        $permisoIds = \App\Models\PermisoSistema::whereIn('slug', $validated['permisos'] ?? [])->pluck('id');
        $user->permisosSistema()->sync($permisoIds);

        return redirect()->route('rrhh.edit', $user->id)
            ->with('success', 'Permisos actualizados correctamente.');
    }

    public function updateModuloPerfiles(int $userId, Request $request): RedirectResponse
    {
        $user = User::findOrFail($userId);

        $validated = $request->validate([
            'asignaciones' => ['nullable', 'array'],
            'asignaciones.*' => ['string', 'in:superadmin,admin,usuario,auditor'],
        ]);

        $user->moduloPerfiles()->delete();

        $rows = [];
        foreach (($validated['asignaciones'] ?? []) as $moduloSlug => $perfilSlug) {
            $rows[] = [
                'user_id' => $user->id,
                'modulo_slug' => $moduloSlug,
                'perfil_slug' => $perfilSlug,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if (!empty($rows)) {
            \App\Models\UserModuloPerfil::insert($rows);
        }

        return redirect()->route('rrhh.edit', $user->id)
            ->with('success', 'Acciones actualizadas correctamente.');
    }
}
