<?php

namespace App\Http\Requests\Ott;

use Illuminate\Foundation\Http\FormRequest;

class StoreOttRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tipo_orden_id' => ['required', 'integer', 'exists:tipos_orden,id'],
            'tipo_contrato_id' => ['required', 'integer', 'exists:tipos_contrato,id'],
            'fecha_inicio' => ['required', 'date'],
            'fecha_termino' => ['nullable', 'date', 'after_or_equal:fecha_inicio'],
            'jornada_horas' => ['nullable', 'integer', 'min:1', 'max:168'],
            'centro_costo_id' => ['required', 'integer', 'exists:centros_costo,id'],
            'nivel' => ['nullable', 'integer', 'min:1'],
            'afp_id' => ['nullable', 'integer', 'exists:afps,id'],
            'prevision_id' => ['nullable', 'integer', 'exists:previsiones,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'tipo_orden_id.required' => 'El tipo de orden es obligatorio.',
            'tipo_contrato_id.required' => 'El tipo de contrato es obligatorio.',
            'fecha_inicio.required' => 'La fecha de inicio es obligatoria.',
            'fecha_termino.after_or_equal' => 'La fecha de término debe ser posterior o igual a la fecha de inicio.',
            'jornada_horas.required' => 'La jornada (horas) es obligatoria.',
            'centro_costo_id.required' => 'El centro de costo es obligatorio.',
            'nivel.required' => 'El nivel es obligatorio.',
        ];
    }
}
