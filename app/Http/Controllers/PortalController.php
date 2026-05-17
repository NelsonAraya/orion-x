<?php

namespace App\Http\Controllers;

use App\Helpers\VacacionesHelper;
use App\Http\Requests\Permiso\StorePermisoRequest;
use App\Http\Requests\Vacacion\StoreVacacionRequest;
use App\Models\EstadoPermiso;
use App\Models\EstadoVacacione;
use App\Models\OrdenTrabajo;
use App\Models\Permiso;
use App\Models\PermisoDetalle;
use App\Models\TipoPermiso;
use App\Models\Vacacione;
use App\Models\VacacionPeriodo;
use App\Notifications\PermisoCreada;
use App\Notifications\VacacionCreada;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id();
        $user = auth()->user();

        $permisos = Permiso::with(['tipoPermiso', 'estadoPermiso', 'userCreador', 'userGestion', 'detalles'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'permiso_display' => $p->permiso_display,
                'tipo_permiso' => $p->tipoPermiso?->nombre,
                'fecha_inicio' => $p->fecha_inicio?->format('d/m/Y'),
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

        $bloquesAnuales = [
            'usados' => PermisoDetalle::whereHas('permiso', fn($q) => $q
                ->where('user_id', $userId)
                ->where('tipo_permiso_id', $conGoceId)
                ->where('estado_permiso_id', EstadoPermiso::where('nombre', 'Aceptada')->value('id'))
            )
                ->whereYear('fecha', now()->year)
                ->sum('bloques'),
            'total' => 12,
        ];

        $vacaciones = Vacacione::with(['estadoVacacione', 'userCreador', 'userGestion', 'periodos'])
            ->where('user_id', $userId)
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
                    VacacionesHelper::esSalud($userId)
                ),
                'dias_usados' => VacacionesHelper::calcularDiasUsados($userId, $p['numero']),
            ])
            ->toArray();

        $ordenes = OrdenTrabajo::with([
            'tipoOrden', 'tipoContrato', 'centroCosto', 'estadoOtt',
            'afp', 'prevision', 'userCreador',
        ])
            ->where('user_id_asignado', $userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($o) => [
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
            ]);

        return Inertia::render('Portal/Index', [
            'lista_permisos' => $permisos,
            'tipos_permiso' => TipoPermiso::orderBy('nombre')->get(['id', 'nombre']),
            'con_goce_id' => $conGoceId,
            'bloques_anuales' => $bloquesAnuales,
            'vacaciones' => $vacaciones,
            'periodos_vacaciones' => $periodosVacaciones,
            'ordenes' => $ordenes,
            'tiene_fecha_ingreso' => $user->fecha_ingreso !== null,
        ]);
    }

    public function storePermiso(StorePermisoRequest $request): RedirectResponse
    {
        $userId = auth()->id();
        $user = auth()->user();

        $conGoceId = TipoPermiso::where('nombre', 'Con Goce de Sueldo')->value('id');
        $esConGoce = $request->tipo_permiso_id == $conGoceId;

        if ($esConGoce) {
            $bloquesNuevos = collect($request->detalles)->sum(fn($d) => $d['jornada'] === 'completo' ? 2 : 1);

            $aceptadaId = EstadoPermiso::where('nombre', 'Aceptada')->value('id');

            $bloquesUsados = PermisoDetalle::whereHas('permiso', fn($q) => $q
                ->where('user_id', $userId)
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
            'user_id' => $userId,
            'user_id_creador' => $userId,
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

        return redirect()->route('portal.index')
            ->with('success', 'Permiso creado correctamente.');
    }

    public function storeVacacion(StoreVacacionRequest $request): RedirectResponse
    {
        $userId = auth()->id();
        $user = auth()->user();

        $inicio = $request->date('fecha_inicio');
        $fin = $request->date('fecha_termino');
        $diasSolicitados = VacacionesHelper::contarDiasHabiles($inicio, $fin);
        $esSalud = VacacionesHelper::esSalud($userId);
        $aniosServicio = (int) $user->fecha_ingreso->diffInYears(now());

        $vacacion = Vacacione::create([
            'user_id' => $userId,
            'user_id_creador' => $userId,
            'estado_vacaciones_id' => EstadoVacacione::where('nombre', 'Ingresada')->value('id'),
            'fecha_inicio' => $inicio,
            'fecha_termino' => $fin,
            'dias_solicitados' => $diasSolicitados,
            'motivo' => $request->motivo,
        ]);

        $remaining = $diasSolicitados;
        for ($i = 1; $i <= $aniosServicio && $remaining > 0; $i++) {
            $corresponden = VacacionesHelper::calcularDiasCorrespondientes($i, $esSalud);
            $usados = VacacionesHelper::calcularDiasUsados($userId, $i);
            $restantes = max(0, $corresponden - $usados);
            if ($restantes <= 0) continue;
            $consumir = min($restantes, $remaining);
            VacacionPeriodo::create([
                'vacacion_id' => $vacacion->id,
                'periodo_numero' => $i,
                'dias_consumidos' => $consumir,
            ]);
            $remaining -= $consumir;
        }

        $vacacion->user->notify(new VacacionCreada($vacacion));

        return redirect()->route('portal.index')
            ->with('success', 'Solicitud de vacaciones creada correctamente.');
    }
}
