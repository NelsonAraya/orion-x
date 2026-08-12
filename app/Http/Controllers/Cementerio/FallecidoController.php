<?php

namespace App\Http\Controllers\Cementerio;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cementerio\StoreFallecidoRequest;
use App\Models\Cementerio\EstadoCivil;
use App\Models\Cementerio\Fallecido;
use App\Models\Cementerio\Ot;
use App\Models\Cementerio\Sexo;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class FallecidoController extends Controller
{
    public function index(): Response
    {
        $fallecidos = Fallecido::with(['sexo', 'estadoCivil'])
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Fallecido $f) => [
                'id' => $f->id,
                'rut_fallecido' => $f->rut_fallecido,
                'codigo_nn' => $f->codigo_nn,
                'nombres_fallecido' => $f->nombres_fallecido,
                'apellido_paterno_fallecido' => $f->apellido_paterno_fallecido,
                'apellido_materno_fallecido' => $f->apellido_materno_fallecido,
                'nombre_completo' => $f->nombre_completo,
                'fecha_nacimiento_fallecido' => $f->fecha_nacimiento_fallecido?->format('Y-m-d'),
                'fecha_fallecimiento' => $f->fecha_fallecimiento?->format('Y-m-d'),
                'sexo_id' => $f->sexo_id,
                'estado_civil_id' => $f->estado_civil_id,
                'sexo_nombre' => $f->sexo?->nombre,
                'estado_civil_nombre' => $f->estadoCivil?->nombre,
                'nacionalidad_fallecido' => $f->nacionalidad_fallecido,
                'lugar_fallecimiento' => $f->lugar_fallecimiento,
                'observaciones' => $f->observaciones,
                'carta_defuncion' => $f->carta_defuncion,
                'es_nn' => $f->es_nn,
                'registrador_id' => $f->registrador_id,
            ]);

        return inertia('Cementerio/RegistroFallecido', [
            'fallecidos' => $fallecidos,
            'sexos' => Sexo::orderBy('id')->get(['id', 'slug', 'nombre']),
            'estadosCiviles' => EstadoCivil::orderBy('id')->get(['id', 'slug', 'nombre']),
        ]);
    }

    public function store(StoreFallecidoRequest $request): RedirectResponse
    {
        abort_unless(auth()->user()->puede('cementerio-registro-fallecido', 'create'), 403);
        $data = $request->validated();

        if ($request->boolean('es_nn')) {
            $data['rut_fallecido'] = null;
        }

        if ($request->hasFile('carta_defuncion')) {
            $data['carta_defuncion'] = $request->file('carta_defuncion')
                ->store('carta-defuncion', 'public');
        }

        Fallecido::create($data);

        return to_route('cementerio.registro-fallecido')
            ->with('success', 'Fallecido registrado correctamente.');
    }

    public function show(Fallecido $fallecido): Response
    {
        abort_unless(auth()->user()->puede('cementerio-registro-fallecido', 'create'), 403);

        $fallecido->load(['sexo', 'estadoCivil']);

        return inertia('Cementerio/RegistroFallecido', [
            'fallecido' => [
                'id' => $fallecido->id,
                'rut_fallecido' => $fallecido->rut_fallecido,
                'codigo_nn' => $fallecido->codigo_nn,
                'nombres_fallecido' => $fallecido->nombres_fallecido,
                'apellido_paterno_fallecido' => $fallecido->apellido_paterno_fallecido,
                'apellido_materno_fallecido' => $fallecido->apellido_materno_fallecido,
                'fecha_nacimiento_fallecido' => $fallecido->fecha_nacimiento_fallecido?->format('Y-m-d'),
                'fecha_fallecimiento' => $fallecido->fecha_fallecimiento?->format('Y-m-d'),
                'sexo_id' => $fallecido->sexo_id,
                'estado_civil_id' => $fallecido->estado_civil_id,
                'nacionalidad_fallecido' => $fallecido->nacionalidad_fallecido,
                'lugar_fallecimiento' => $fallecido->lugar_fallecimiento,
                'observaciones' => $fallecido->observaciones,
                'es_nn' => $fallecido->es_nn,
                'carta_defuncion' => $fallecido->carta_defuncion,
                'registrador_id' => $fallecido->registrador_id,
            ],
            'sexos' => Sexo::orderBy('id')->get(['id', 'slug', 'nombre']),
            'estadosCiviles' => EstadoCivil::orderBy('id')->get(['id', 'slug', 'nombre']),
        ]);
    }

    public function update(StoreFallecidoRequest $request, Fallecido $fallecido): RedirectResponse
    {
        abort_unless(auth()->user()->puede('cementerio-registro-fallecido', 'update'), 403);
        $data = $request->validated();

        $perfil = auth()->user()->perfilPara('cementerio-registro-fallecido');

        if ($perfil !== 'superadmin') {
            $data['rut_fallecido'] = $fallecido->rut_fallecido;
            $data['es_nn'] = $fallecido->es_nn;
        } elseif ($request->boolean('es_nn')) {
            $data['rut_fallecido'] = null;
        }

        if ($request->hasFile('carta_defuncion')) {
            $data['carta_defuncion'] = $request->file('carta_defuncion')
                ->store('carta-defuncion', 'public');
        }

        $fallecido->update($data);

        return to_route('cementerio.registro-fallecido')
            ->with('success', 'Fallecido actualizado correctamente.');
    }

    public function destroy(Fallecido $fallecido): RedirectResponse
    {
        abort_unless(auth()->user()->puede('cementerio-registro-fallecido', 'delete'), 403);
        $fallecido->delete();

        return to_route('cementerio.registro-fallecido')
            ->with('success', 'Fallecido eliminado correctamente.');
    }

    public function detalle(Fallecido $fallecido): \Illuminate\Http\JsonResponse
    {
        abort_unless(auth()->user()->puede('cementerio-registro-fallecido', 'create'), 403);

        $fallecido->load(['sexo', 'estadoCivil']);

        return response()->json([
            'id' => $fallecido->id,
            'rut_fallecido' => $fallecido->rut_fallecido,
            'codigo_nn' => $fallecido->codigo_nn,
            'nombres_fallecido' => $fallecido->nombres_fallecido,
            'apellido_paterno_fallecido' => $fallecido->apellido_paterno_fallecido,
            'apellido_materno_fallecido' => $fallecido->apellido_materno_fallecido,
            'nombre_completo' => $fallecido->nombre_completo,
            'identificador' => $fallecido->identificador,
            'fecha_nacimiento_fallecido' => $fallecido->fecha_nacimiento_fallecido?->format('Y-m-d'),
            'fecha_fallecimiento' => $fallecido->fecha_fallecimiento?->format('Y-m-d'),
            'sexo_nombre' => $fallecido->sexo?->nombre,
            'estado_civil_nombre' => $fallecido->estadoCivil?->nombre,
            'nacionalidad_fallecido' => $fallecido->nacionalidad_fallecido,
            'lugar_fallecimiento' => $fallecido->lugar_fallecimiento,
            'observaciones' => $fallecido->observaciones,
        ]);
    }

    public function search(Request $request): \Illuminate\Http\JsonResponse
    {
        abort_unless(auth()->user()->puede('cementerio-registro-fallecido', 'create'), 403);

        $query = $request->get('q');

        $fallecidos = Fallecido::where('rut_fallecido', 'LIKE', "%{$query}%")
            ->orWhere('codigo_nn', 'LIKE', "%{$query}%")
            ->orWhere('nombres_fallecido', 'LIKE', "%{$query}%")
            ->orWhere('apellido_paterno_fallecido', 'LIKE', "%{$query}%")
            ->orWhere('apellido_materno_fallecido', 'LIKE', "%{$query}%")
            ->limit(10)
            ->get()
            ->map(fn (Fallecido $f) => [
                'id' => $f->id,
                'rut_fallecido' => $f->rut_fallecido,
                'codigo_nn' => $f->codigo_nn,
                'nombres_fallecido' => $f->nombres_fallecido,
                'apellido_paterno_fallecido' => $f->apellido_paterno_fallecido,
                'apellido_materno_fallecido' => $f->apellido_materno_fallecido,
                'nombre_completo' => $f->nombre_completo,
                'identificador' => $f->identificador,
                'fecha_fallecimiento' => $f->fecha_fallecimiento?->format('Y-m-d'),
            ]);

        return response()->json($fallecidos);
    }

    public function verificarRut(Request $request): \Illuminate\Http\JsonResponse
    {
        abort_unless(auth()->user()->puede('cementerio-registro-fallecido', 'create'), 403);

        $rut = $request->get('rut');

        if (!$rut) {
            return response()->json(['exists' => false]);
        }

        $cleanRut = preg_replace('/[^0-9kK]/', '', $rut);
        $exists = Fallecido::whereRaw(
            "REPLACE(REPLACE(rut_fallecido, '.', ''), '-', '') = ?",
            [$cleanRut]
        )->exists();

        return response()->json(['exists' => $exists]);
    }

    public function buscarUbicacion(Request $request): \Illuminate\Http\JsonResponse
    {
        $rut = $request->input('rut');
        $nombre = $request->input('nombre');

        if (!$rut && !$nombre) {
            return response()->json(['message' => 'Debe ingresar RUT o nombre para buscar.'], 422);
        }

        $query = Fallecido::query();

        if ($rut) {
            $cleanRut = preg_replace('/[^0-9kK]/', '', $rut);
            $query->where('rut_fallecido', 'like', "%{$cleanRut}%");
        }

        if ($nombre) {
            $query->where(function ($q) use ($nombre) {
                $q->where('nombres_fallecido', 'like', "%{$nombre}%")
                    ->orWhere('apellido_paterno_fallecido', 'like', "%{$nombre}%")
                    ->orWhere('apellido_materno_fallecido', 'like', "%{$nombre}%");
            });
        }

        $fallecido = $query->with([
            'sexo',
            'ubicacionActual.ubicacion.sector',
            'ubicacionActual.ubicacion.tipoUbicacion',
            'ubicacionActual.ubicacion.estadoUbicacion',
        ])->first();

        if (!$fallecido) {
            return response()->json(['message' => 'No se encontró un fallecido con esos datos.'], 404);
        }

        $ubicacionActual = $fallecido->ubicacionActual?->ubicacion;
        $ot = Ot::where('fallecido_id', $fallecido->id)->latest()->first();

        return response()->json([
            'id' => $fallecido->id,
            'nombre' => $fallecido->nombre_completo,
            'rut' => $fallecido->rut_fallecido ?? $fallecido->codigo_nn ?? '—',
            'sexo' => $fallecido->sexo?->nombre ?? '—',
            'fecha_fallecimiento' => $fallecido->fecha_fallecimiento?->format('d-m-Y') ?? '—',
            'sector' => $ubicacionActual?->sector?->nombre ?? '—',
            'patio' => $ubicacionActual?->patio ?? '—',
            'codigo_ubicacion' => $ubicacionActual?->codigo ?? '—',
            'tipo_ubicacion' => $ubicacionActual?->tipoUbicacion?->nombre ?? '—',
            'estado_ubicacion' => $ubicacionActual?->estadoUbicacion?->nombre ?? '—',
            'fecha_asignacion' => $fallecido->ubicacionActual?->fecha_asignacion?->format('d-m-Y') ?? '—',
            'ot_numero' => $ot?->numero_ot ?? null,
        ]);
    }
}
