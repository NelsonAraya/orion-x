<?php

namespace App\Http\Controllers\Cementerio;

use App\Http\Controllers\Controller;
use App\Http\Requests\Cementerio\StoreDeudorRequest;
use App\Models\Cementerio\Deudor;
use App\Models\Cementerio\DeudorContacto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Response;

class DeudorController extends Controller
{
    public function index(): Response
    {
        $deudores = Deudor::with('contacto')
            ->orderBy('nombre_completo_deudor')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Deudor $d) => [
                'rut' => $d->rut,
                'dv' => $d->dv,
                'nombre_completo_deudor' => $d->nombre_completo_deudor,
                'direccion_deudor' => $d->direccion_deudor,
                'telefono_deudor' => $d->telefono_deudor,
                'correo_electronico_deudor' => $d->correo_electronico_deudor,
                'registrador_id' => $d->registrador_id,
                'contacto' => $d->contacto ? [
                    'nombre_contacto1' => $d->contacto->nombre_contacto1,
                    'telefono_contacto1' => $d->contacto->telefono_contacto1,
                    'correo_contacto1' => $d->contacto->correo_contacto1,
                    'nombre_contacto2' => $d->contacto->nombre_contacto2,
                    'telefono_contacto2' => $d->contacto->telefono_contacto2,
                    'correo_contacto2' => $d->contacto->correo_contacto2,
                ] : null,
            ]);

        return inertia('Cementerio/HistorialDeudores', [
            'deudores' => $deudores,
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        abort_unless(auth()->user()->puede('cementerio-historial-deudores', 'create'), 403);
        $q = $request->get('q', '');
        $rutInt = (int) preg_replace('/[^0-9]/', '', $q);

        $deudores = Deudor::with('contacto')
            ->where('rut', $rutInt > 0 ? $rutInt : 0)
            ->orWhere('nombre_completo_deudor', 'like', "%{$q}%")
            ->limit(10)
            ->get()
            ->map(fn (Deudor $d) => [
                'rut' => $d->rut,
                'dv' => $d->dv,
                'nombre_completo_deudor' => $d->nombre_completo_deudor,
                'direccion_deudor' => $d->direccion_deudor,
                'telefono_deudor' => $d->telefono_deudor,
                'correo_electronico_deudor' => $d->correo_electronico_deudor,
                'contacto' => $d->contacto ? [
                    'nombre_contacto1' => $d->contacto->nombre_contacto1,
                    'telefono_contacto1' => $d->contacto->telefono_contacto1,
                    'correo_contacto1' => $d->contacto->correo_contacto1,
                    'nombre_contacto2' => $d->contacto->nombre_contacto2,
                    'telefono_contacto2' => $d->contacto->telefono_contacto2,
                    'correo_contacto2' => $d->contacto->correo_contacto2,
                ] : null,
            ]);

        return response()->json($deudores);
    }

    public function store(StoreDeudorRequest $request): RedirectResponse
    {
        abort_unless(auth()->user()->puede('cementerio-historial-deudores', 'create'), 403);
        $deudor = Deudor::create($request->validated());

        if ($request->filled(['primer_contacto_nombre', 'primer_contacto_telefono', 'primer_contacto_correo'])) {
            $deudor->contacto()->create([
                'nombre_contacto1' => $request->primer_contacto_nombre,
                'telefono_contacto1' => $request->primer_contacto_telefono,
                'correo_contacto1' => $request->primer_contacto_correo,
                'nombre_contacto2' => $request->segundo_contacto_nombre,
                'telefono_contacto2' => $request->segundo_contacto_telefono,
                'correo_contacto2' => $request->segundo_contacto_correo,
            ]);
        }

        return to_route('cementerio.historial-deudores')
            ->with('success', 'Deudor registrado correctamente.');
    }

    public function update(StoreDeudorRequest $request, Deudor $deudor): RedirectResponse
    {
        abort_unless(auth()->user()->puede('cementerio-historial-deudores', 'update'), 403);
        $data = $request->validated();

        $perfil = auth()->user()->perfilPara('cementerio-historial-deudores');

        if ($perfil !== 'superadmin') {
            $data['rut'] = $deudor->rut;
            $data['dv'] = $deudor->dv;
        }

        $deudor->update($data);

        $contactoData = array_filter([
            'nombre_contacto1' => $request->primer_contacto_nombre,
            'telefono_contacto1' => $request->primer_contacto_telefono,
            'correo_contacto1' => $request->primer_contacto_correo,
            'nombre_contacto2' => $request->segundo_contacto_nombre,
            'telefono_contacto2' => $request->segundo_contacto_telefono,
            'correo_contacto2' => $request->segundo_contacto_correo,
        ], fn ($v) => $v !== null && $v !== '');

        if (!empty($contactoData)) {
            $deudor->contacto()->updateOrCreate(
                ['deudor_id' => $deudor->rut],
                $contactoData
            );
        }

        return to_route('cementerio.historial-deudores')
            ->with('success', 'Deudor actualizado correctamente.');
    }

    public function destroy(Deudor $deudor): RedirectResponse
    {
        abort_unless(auth()->user()->puede('cementerio-historial-deudores', 'delete'), 403);
        $deudor->delete();

        return to_route('cementerio.historial-deudores')
            ->with('success', 'Deudor eliminado correctamente.');
    }
}
