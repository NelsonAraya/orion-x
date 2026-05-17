<?php

namespace App\Http\Requests\Vacacion;

use App\Helpers\VacacionesHelper;
use Illuminate\Foundation\Http\FormRequest;

class StoreVacacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fecha_inicio' => ['required', 'date'],
            'fecha_termino' => ['required', 'date', 'after_or_equal:fecha_inicio'],
            'motivo' => ['required', 'string', 'min:5'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $inicio = $this->date('fecha_inicio');
            $fin = $this->date('fecha_termino');

            if (!$inicio || !$fin) return;

            $diasSolicitados = VacacionesHelper::contarDiasHabiles($inicio, $fin);

            if ($diasSolicitados === 0) {
                $validator->errors()->add('fecha_inicio', 'El rango no contiene días hábiles.');
                return;
            }

            $userId = $this->route('user') ?? auth()->id();
            $user = \App\Models\User::find($userId);
            if (!$user || !$user->fecha_ingreso) {
                $validator->errors()->add('fecha_inicio', 'El usuario no tiene fecha de ingreso.');
                return;
            }

            $esSalud = VacacionesHelper::esSalud($user->id);
            $aniosServicio = (int) $user->fecha_ingreso->diffInYears(now());

            $totalDisponible = 0;
            for ($i = 1; $i <= $aniosServicio; $i++) {
                $corresponden = VacacionesHelper::calcularDiasCorrespondientes($i, $esSalud);
                $usados = VacacionesHelper::calcularDiasUsados($user->id, $i);
                $totalDisponible += max(0, $corresponden - $usados);
            }

            if ($diasSolicitados > $totalDisponible) {
                $validator->errors()->add('fecha_termino', "Solo hay {$totalDisponible} día(s) disponible(s) en total entre todos los períodos.");
            }
        });
    }

    public function messages(): array
    {
        return [
            'fecha_inicio.required' => 'La fecha de inicio es obligatoria.',
            'fecha_termino.required' => 'La fecha de término es obligatoria.',
            'fecha_termino.after_or_equal' => 'La fecha de término debe ser posterior o igual a la de inicio.',
            'motivo.required' => 'El motivo es obligatorio.',
            'motivo.min' => 'El motivo debe tener al menos 5 caracteres.',
        ];
    }
}
