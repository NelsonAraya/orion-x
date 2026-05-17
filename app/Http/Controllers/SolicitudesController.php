<?php

namespace App\Http\Controllers;

use App\Models\EstadoPermiso;
use App\Models\EstadoVacacione;
use App\Models\Permiso;
use App\Models\Vacacione;
use App\Notifications\PermisoAceptada;
use App\Notifications\PermisoRechazada;
use App\Notifications\VacacionAceptada;
use App\Notifications\VacacionRechazada;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SolicitudesController extends Controller
{
    public function index(): Response
    {
        $pendientesPermisos = Permiso::with(['userAsignado', 'tipoPermiso', 'estadoPermiso', 'detalles'])
            ->whereHas('estadoPermiso', fn($q) => $q->where('nombre', 'Ingresada'))
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'solicitud' => $p->permiso_display,
                'empleado' => $p->userAsignado?->name,
                'tipo' => $p->tipoPermiso?->nombre,
                'detalle' => $p->detalle,
                'motivo' => $p->motivo,
                'created_at' => $p->created_at->format('d/m/Y H:i'),
            ]);

        $pendientesVacaciones = Vacacione::with(['user', 'estadoVacacione', 'periodos'])
            ->whereHas('estadoVacacione', fn($q) => $q->where('nombre', 'Ingresada'))
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($v) => [
                'id' => $v->id,
                'solicitud' => 'VAC-' . $v->id,
                'empleado' => $v->user?->name,
                'fecha_inicio' => $v->fecha_inicio?->format('d/m/Y'),
                'fecha_termino' => $v->fecha_termino?->format('d/m/Y'),
                'dias' => $v->dias_solicitados,
                'motivo' => $v->motivo,
                'created_at' => $v->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Solicitudes/Index', [
            'pendientes_permisos' => $pendientesPermisos,
            'pendientes_vacaciones' => $pendientesVacaciones,
        ]);
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

        return redirect()->route('solicitudes.index')
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

        return redirect()->route('solicitudes.index')
            ->with('success', 'Permiso rechazado correctamente.');
    }

    public function aceptarVacacion(int $vacacionId): RedirectResponse
    {
        $vacacion = Vacacione::findOrFail($vacacionId);

        if ($vacacion->estadoVacacione?->nombre !== 'Ingresada') {
            return redirect()->back()
                ->with('error', 'Solo se pueden aceptar solicitudes en estado Ingresada.');
        }

        $vacacion->update([
            'estado_vacaciones_id' => EstadoVacacione::where('nombre', 'Aceptada')->value('id'),
            'fecha_gestion' => now(),
            'user_id_gestion' => auth()->id(),
        ]);

        $vacacion->user->notify(new VacacionAceptada($vacacion));

        return redirect()->route('solicitudes.index')
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
            'estado_vacaciones_id' => EstadoVacacione::where('nombre', 'Rechazada')->value('id'),
            'fecha_gestion' => now(),
            'user_id_gestion' => auth()->id(),
            'observacion_rechazo' => $validated['observacion_rechazo'],
        ]);

        $vacacion->user->notify(new VacacionRechazada($vacacion));

        return redirect()->route('solicitudes.index')
            ->with('success', 'Vacaciones rechazadas correctamente.');
    }
}
