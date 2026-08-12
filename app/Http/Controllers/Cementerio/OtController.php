<?php

namespace App\Http\Controllers\Cementerio;

use App\Http\Controllers\Controller;
use App\Models\Cementerio\Cuota;
use App\Models\Cementerio\Deudor;
use App\Models\Cementerio\DeudorContacto;
use App\Models\Cementerio\FallecidoUbicacion;
use App\Models\Cementerio\Financiamiento;
use App\Models\Cementerio\FormaPago;
use App\Models\Cementerio\Ot;
use App\Models\Cementerio\OtEstado;
use App\Models\Cementerio\Servicio;
use App\Models\Cementerio\Ubicacion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OtController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        abort_unless(auth()->user()->puede('cementerio-ingresar-ot', 'create'), 403);
        $validated = $request->validate([
            'fallecido_id' => 'required|exists:cementerio_fallecidos,id',
            'rf_rut' => 'required|string',
            'rf_direccion' => 'required|string|max:255',
            'rf_nombre' => 'required|string|max:255',
            'rf_telefono' => 'required|string|max:50',
            'rf_correo' => 'required|email|max:255',
            'rf_relacion' => 'required|exists:cementerio_relaciones,id',
            'primer_contacto_nombre' => 'required|string|max:255',
            'primer_contacto_telefono' => 'required|string|max:50',
            'primer_contacto_correo' => 'required|email|max:255',
            'segundo_contacto_nombre' => 'nullable|string|max:255',
            'segundo_contacto_telefono' => 'nullable|string|max:50',
            'segundo_contacto_correo' => 'nullable|email|max:255',
            'tipo_financiamiento' => 'required|exists:cementerio_financiamiento,id',
            'servicios' => 'required|array|min:1',
            'servicios.*.id' => 'required|exists:cementerio_servicios,id',
            'servicios.*.cantidad' => 'required|integer|min:1',
            'sector' => 'nullable|exists:cementerio_sectores,id',
            'tipo_ubicacion' => 'nullable|exists:cementerio_tipos_ubicacion,id',
            'patio' => 'nullable|string|max:50',
            'calle' => 'nullable|string|max:100',
            'lote' => 'nullable|string|max:50',
            'forma_pago' => 'nullable|exists:cementerio_formas_pago,id',
            'numero_cuotas' => 'nullable|integer|min:1',
            'documento_adjunto' => 'nullable|file|mimes:pdf|max:20480',
            'documento_deudor' => 'nullable|file|mimes:pdf|max:20480',
        ]);

        preg_match('/^(\d+)-(\w)$/', $validated['rf_rut'], $matches);
        $rutInteger = (int) ($matches[1] ?? 0);
        $dv = $matches[2] ?? '';

        $deudor = Deudor::where('rut', $rutInteger)->first();

        if ($deudor) {
            $deudor->update([
                'dv' => $dv,
                'nombre_completo_deudor' => $validated['rf_nombre'],
                'direccion_deudor' => $validated['rf_direccion'],
                'telefono_deudor' => $validated['rf_telefono'],
                'correo_electronico_deudor' => $validated['rf_correo'],
            ]);
        } else {
            $deudor = Deudor::create([
                'rut' => $rutInteger,
                'dv' => $dv,
                'nombre_completo_deudor' => $validated['rf_nombre'],
                'direccion_deudor' => $validated['rf_direccion'],
                'telefono_deudor' => $validated['rf_telefono'],
                'correo_electronico_deudor' => $validated['rf_correo'],
                'registrador_id' => Auth::id(),
            ]);
        }

        $deudor->contacto()->updateOrCreate(
            ['deudor_id' => $deudor->rut],
            [
                'nombre_contacto1' => $validated['primer_contacto_nombre'],
                'telefono_contacto1' => $validated['primer_contacto_telefono'],
                'correo_contacto1' => $validated['primer_contacto_correo'],
                'nombre_contacto2' => $validated['segundo_contacto_nombre'] ?? null,
                'telefono_contacto2' => $validated['segundo_contacto_telefono'] ?? null,
                'correo_contacto2' => $validated['segundo_contacto_correo'] ?? null,
            ]
        );

        $existingOt = Ot::where('fallecido_id', $validated['fallecido_id'])
            ->where('deudor_id', $deudor->rut)
            ->whereHas('cuotas', fn ($q) => $q->where('estado', '!=', 'pagada'))
            ->first();

        if ($existingOt) {
            return redirect()->back()
                ->withErrors([
                    'duplicate_ot' => "El cliente ya cuenta con la Orden de Trabajo N°{$existingOt->numero_ot} en proceso asociada al fallecido.",
                ])
                ->withInput();
        }

        if ($validated['sector'] && $validated['tipo_ubicacion']) {
            $ubicacion = Ubicacion::create([
                'codigo' => 'UBR-' . strtoupper(uniqid()),
                'sector_id' => $validated['sector'],
                'tipo_ubicacion_id' => $validated['tipo_ubicacion'],
                'patio' => $validated['patio'] ?? '',
                'calle' => $validated['calle'] ?? '',
                'lote' => $validated['lote'] ?? '',
                'estado_ubicacion_id' => 1,
            ]);
            $ubicacionId = $ubicacion->id;
        } else {
            $ubicacionId = null;
        }

        $lastOt = Ot::latest('id')->first();
        $nextNumber = $lastOt ? (int) substr($lastOt->numero_ot, 3) + 1 : 1;
        $numeroOt = 'OT-' . str_pad($nextNumber, 5, '0', STR_PAD_LEFT);

        $servicioIds = collect($validated['servicios'])->pluck('id')->unique()->toArray();
        $servicios = Servicio::whereIn('id', $servicioIds)->get()->keyBy('id');
        $valorArriendo = Financiamiento::findOrFail($validated['tipo_financiamiento'])->valor_arriendo;
        $subtotalServicios = collect($validated['servicios'])->sum(
            fn ($item) => ($servicios[$item['id']]->valor_servicio ?? 0) * $item['cantidad']
        );
        $subtotal = $valorArriendo + $subtotalServicios;
        $iva = (int) round($subtotal * 0.19);
        $total = $subtotal + $iva;

        $ot = Ot::create([
            'numero_ot' => $numeroOt,
            'fallecido_id' => $validated['fallecido_id'],
            'deudor_id' => $deudor->rut,
            'relacion_id' => $validated['rf_relacion'],
            'ubicacion_id' => $ubicacionId,
            'tipo_financiamiento_id' => $validated['tipo_financiamiento'],
            'forma_pago_id' => $validated['forma_pago'] ?? null,
            'numero_cuotas' => $validated['numero_cuotas'],
            'subtotal' => $subtotal,
            'iva' => $iva,
            'total' => $total,
            'ot_estado_id' => OtEstado::where('nombre', 'Ingresada')->value('id'),
            'registrador_id' => Auth::id(),
        ]);

        if ($validated['numero_cuotas'] && $total > 0) {
            $montoBase = intdiv($total, $validated['numero_cuotas']);
            $residuo = $total % $validated['numero_cuotas'];
            $fechaBase = now()->addDays(30);

            for ($i = 1; $i <= $validated['numero_cuotas']; $i++) {
                $monto = $montoBase + ($i <= $residuo ? 1 : 0);
                $ot->cuotas()->create([
                    'numero_cuota' => $i,
                    'total_cuotas' => $validated['numero_cuotas'],
                    'monto' => $monto,
                    'fecha_vencimiento' => $fechaBase->copy()->addDays(($i - 1) * 30),
                    'estado' => 'pendiente',
                ]);
            }
        }

        $pivotData = collect($validated['servicios'])
            ->groupBy('id')
            ->mapWithKeys(fn ($items, $id) => [
                (int) $id => [
                    'valor_unitario' => $servicios[(int) $id]->valor_servicio,
                    'cantidad' => $items->sum('cantidad'),
                ],
            ])
            ->toArray();

        if ($request->hasFile('documento_adjunto')) {
            $ot->update([
                'documento_adjunto' => $request->file('documento_adjunto')
                    ->store('ot-documentos', 'public')
            ]);
        }

        if ($request->hasFile('documento_deudor')) {
            $ot->update([
                'documento_deudor' => $request->file('documento_deudor')
                    ->store('ot-documentos', 'public')
            ]);
        }

        $ot->servicios()->attach($pivotData);

        if ($ubicacionId) {
            FallecidoUbicacion::create([
                'fallecido_id' => $validated['fallecido_id'],
                'ubicacion_id' => $ubicacionId,
                'fecha_asignacion' => now()->toDateString(),
                'activo' => true,
            ]);
        }

        return to_route('cementerio.ingresar-ot')
            ->with('success', "{$numeroOt} creada correctamente.");
    }

    public function update(Request $request, Ot $ot): RedirectResponse
    {
        $perfil = auth()->user()->perfilPara('cementerio-buscar-ot');
        abort_unless($perfil === 'superadmin' || $perfil === 'admin', 403);

        $validated = $request->validate([
            'rf_relacion' => 'required|exists:cementerio_relaciones,id',
            'primer_contacto_nombre' => 'required|string|max:255',
            'primer_contacto_telefono' => 'required|string|max:50',
            'primer_contacto_correo' => 'required|email|max:255',
            'segundo_contacto_nombre' => 'nullable|string|max:255',
            'segundo_contacto_telefono' => 'nullable|string|max:50',
            'segundo_contacto_correo' => 'nullable|email|max:255',
            'sector' => 'nullable|exists:cementerio_sectores,id',
            'tipo_ubicacion' => 'nullable|exists:cementerio_tipos_ubicacion,id',
            'patio' => 'nullable|string|max:50',
            'calle' => 'nullable|string|max:100',
            'lote' => 'nullable|string|max:50',
            'ot_estado_id' => 'required|exists:cementerio_ot_estados,id',
            'confirma_anulacion' => 'nullable|boolean',
        ]);

        $ot->load('deudor.contacto', 'ubicacion', 'cuotas');

        $ot->deudor->contacto()->updateOrCreate(
            ['deudor_id' => $ot->deudor->rut],
            [
                'nombre_contacto1' => $validated['primer_contacto_nombre'],
                'telefono_contacto1' => $validated['primer_contacto_telefono'],
                'correo_contacto1' => $validated['primer_contacto_correo'],
                'nombre_contacto2' => $validated['segundo_contacto_nombre'] ?? null,
                'telefono_contacto2' => $validated['segundo_contacto_telefono'] ?? null,
                'correo_contacto2' => $validated['segundo_contacto_correo'] ?? null,
            ]
        );

        if ($validated['sector'] && $validated['tipo_ubicacion']) {
            if ($ot->ubicacion) {
                $ot->ubicacion->update([
                    'sector_id' => $validated['sector'],
                    'tipo_ubicacion_id' => $validated['tipo_ubicacion'],
                    'patio' => $validated['patio'] ?? '',
                    'calle' => $validated['calle'] ?? '',
                    'lote' => $validated['lote'] ?? '',
                ]);
                $ubicacionId = $ot->ubicacion->id;
            } else {
                $ubicacion = Ubicacion::create([
                    'codigo' => 'UBR-' . strtoupper(uniqid()),
                    'sector_id' => $validated['sector'],
                    'tipo_ubicacion_id' => $validated['tipo_ubicacion'],
                    'patio' => $validated['patio'] ?? '',
                    'calle' => $validated['calle'] ?? '',
                    'lote' => $validated['lote'] ?? '',
                    'estado_ubicacion_id' => 1,
                ]);
                $ubicacionId = $ubicacion->id;

                FallecidoUbicacion::create([
                    'fallecido_id' => $ot->fallecido_id,
                    'ubicacion_id' => $ubicacionId,
                    'fecha_asignacion' => now()->toDateString(),
                    'activo' => true,
                ]);
            }
        } else {
            $ubicacionId = null;
            if ($ot->ubicacion) {
                $ot->ubicacion->delete();
            }
        }

        $nuevoEstado = OtEstado::find($validated['ot_estado_id']);

        if ($nuevoEstado->nombre === 'Anulada') {
            $tienePagadas = $ot->cuotas->where('estado', 'pagada')->isNotEmpty();

            if ($tienePagadas && !($validated['confirma_anulacion'] ?? false)) {
                return back()->withErrors([
                    'confirma_anulacion' => 'Debe confirmar la anulación para continuar.',
                ])->withInput();
            }

            $ot->cuotas()->where('estado', '!=', 'anulada')->update(['estado' => 'anulada']);
        }

        $ot->update([
            'relacion_id' => $validated['rf_relacion'],
            'ubicacion_id' => $ubicacionId,
            'ot_estado_id' => $validated['ot_estado_id'],
        ]);

        return to_route('cementerio.buscar-ot')
            ->with('success', "OT {$ot->numero_ot} actualizada correctamente.");
    }

    public function detalle(Ot $ot): JsonResponse
    {
        $ot->load([
            'fallecido.sexo',
            'deudor.contacto',
            'relacion',
            'ubicacion.sector',
            'ubicacion.tipoUbicacion',
            'tipoFinanciamiento',
            'formaPago',
            'servicios',
            'registrador',
            'estado',
        ]);

        $response = $ot->toArray();
        $response['tiene_cuotas_pagadas'] = $ot->cuotas()->where('estado', 'pagada')->exists();

        return response()->json($response);
    }

    public function cuotas(Ot $ot): JsonResponse
    {
        return response()->json($ot->cuotas->load('metodoPago'));
    }

    public function pagar(Request $request, Cuota $cuota): JsonResponse
    {
        $perfil = auth()->user()->perfilPara('cementerio-buscar-ot');
        abort_unless($perfil !== 'auditor', 403);

        $rules = [
            'fecha' => 'required|date',
        ];

        if ($request->has('pagos_mixtos')) {
            $rules['pagos_mixtos'] = 'required|array|min:1';
            $rules['pagos_mixtos.*.metodo_pago_id'] = 'required|exists:cementerio_formas_pago,id';
            $rules['pagos_mixtos.*.monto'] = 'required|integer|min:1';
        } else {
            $rules['monto'] = 'required|integer|min:1';
            $rules['metodo_pago_id'] = 'nullable|exists:cementerio_formas_pago,id';
            $rules['monto_recibido'] = 'nullable|integer|min:1';
        }

        $validated = $request->validate($rules);

        if ($request->has('pagos_mixtos')) {
            DB::beginTransaction();
            try {
                $totalPagado = collect($validated['pagos_mixtos'])->sum('monto');

                foreach ($validated['pagos_mixtos'] as $pago) {
                    $cuota->pagosMixtos()->create([
                        'metodo_pago_id' => $pago['metodo_pago_id'],
                        'monto' => $pago['monto'],
                        'fecha_pago' => $validated['fecha'],
                    ]);
                }

                $data = [
                    'monto_pagado' => $cuota->monto_pagado + $totalPagado,
                ];

                if ($data['monto_pagado'] >= $cuota->monto) {
                    $data['estado'] = 'pagada';
                    $data['monto_pagado'] = $cuota->monto;
                    $data['fecha_pago'] = $validated['fecha'];
                } else {
                    $data['estado'] = 'parcial';
                }

                $cuota->update($data);

                DB::commit();

                $response = $cuota->fresh()->load(['metodoPago', 'pagosMixtos.metodoPago'])->toArray();
                $response = $this->verificarOtFinalizada($cuota, $response);

                return response()->json($response);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['error' => 'Error al procesar pago mixto.'], 500);
            }
        }

        $data = [
            'monto_pagado' => $cuota->monto_pagado + $validated['monto'],
        ];

        if ($validated['metodo_pago_id']) {
            $data['metodo_pago_id'] = $validated['metodo_pago_id'];
        }

        if (($validated['monto_recibido'] ?? false)) {
            $data['monto_recibido'] = $validated['monto_recibido'];
        }

        if ($data['monto_pagado'] >= $cuota->monto) {
            $data['estado'] = 'pagada';
            $data['monto_pagado'] = $cuota->monto;
            $data['fecha_pago'] = $validated['fecha'];
        } else {
            $data['estado'] = 'parcial';
        }

        $cuota->update($data);

        $response = $cuota->fresh()->load('metodoPago')->toArray();
        $response = $this->verificarOtFinalizada($cuota, $response);

        return response()->json($response);
    }

    public function imprimir(Ot $ot)
    {
        $ot->load([
            'fallecido.sexo',
            'deudor.contacto',
            'relacion',
            'ubicacion.sector',
            'ubicacion.tipoUbicacion',
            'tipoFinanciamiento',
            'formaPago',
            'servicios',
            'registrador',
        ]);

        return inertia('Cementerio/ImprimirOt', ['ot' => $ot]);
    }

    public function formasPago(): JsonResponse
    {
        return response()->json(FormaPago::all(['id', 'nombre']));
    }

    public function comprobante(Cuota $cuota)
    {
        $cuota->load([
            'ot.fallecido',
            'ot.deudor',
            'metodoPago',
            'pagosMixtos.metodoPago',
        ]);

        return inertia('Cementerio/ComprobantePago', ['cuota' => $cuota]);
    }

    private function verificarOtFinalizada(Cuota $cuota, array $response): array
    {
        $ot = $cuota->ot;
        $totalCuotas = $ot->cuotas()->count();
        $pagadasCount = $ot->cuotas()->where('estado', 'pagada')->count();

        if ($totalCuotas > 0 && $pagadasCount >= $totalCuotas) {
            $finalizadaId = OtEstado::where('nombre', 'Finalizada')->value('id');
            $ot->update(['ot_estado_id' => $finalizadaId]);
            $response['ot_finalizada'] = true;
            $response['numero_ot'] = $ot->numero_ot;
        }

        return $response;
    }
}
