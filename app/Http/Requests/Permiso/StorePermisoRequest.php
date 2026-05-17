<?php

namespace App\Http\Requests\Permiso;

use App\Models\TipoPermiso;
use Illuminate\Foundation\Http\FormRequest;

class StorePermisoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $conGoceId = TipoPermiso::where('nombre', 'Con Goce de Sueldo')->value('id');
        $esConGoce = $this->input('tipo_permiso_id') == $conGoceId;

        return [
            'tipo_permiso_id' => ['required', 'integer', 'exists:tipos_permiso,id'],
            'fecha_inicio' => $esConGoce
                ? ['nullable', 'date']
                : ['required', 'date'],
            'fecha_termino' => $esConGoce
                ? ['nullable', 'prohibited']
                : ['nullable', 'date', 'after_or_equal:fecha_inicio'],
            'jornada' => ['nullable', 'prohibited'],
            'motivo' => ['required', 'string', 'min:10'],
            'detalles' => $esConGoce
                ? ['required', 'array', 'min:1']
                : ['nullable', 'prohibited'],
            'detalles.*.fecha' => $esConGoce
                ? ['required', 'date', 'distinct']
                : ['nullable', 'prohibited'],
            'detalles.*.jornada' => $esConGoce
                ? ['required', 'in:mañana,tarde,completo']
                : ['nullable', 'prohibited'],
        ];
    }

    public function messages(): array
    {
        return [
            'tipo_permiso_id.required' => 'El tipo de permiso es obligatorio.',
            'fecha_inicio.required' => 'La fecha de inicio es obligatoria.',
            'fecha_termino.after_or_equal' => 'La fecha de término debe ser posterior o igual a la fecha de inicio.',
            'motivo.required' => 'El motivo es obligatorio.',
            'motivo.min' => 'El motivo debe tener al menos 10 caracteres.',
            'detalles.required' => 'Debes agregar al menos un día con su jornada.',
            'detalles.min' => 'Debes agregar al menos un día con su jornada.',
            'detalles.*.fecha.required' => 'Cada día debe tener una fecha.',
            'detalles.*.fecha.distinct' => 'No puedes repetir la misma fecha.',
            'detalles.*.jornada.required' => 'Cada día debe tener una jornada.',
            'detalles.*.jornada.in' => 'La jornada debe ser mañana, tarde o completo.',
        ];
    }
}
