<?php

namespace App\Http\Requests\Vacacion;

use App\Helpers\VacacionesHelper;
use Illuminate\Foundation\Http\FormRequest;

class StoreVacacionHistoricoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'dias' => ['required', 'integer', 'min:1'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $dias = (int) $this->dias;

            if ($dias <= 0) {
                $validator->errors()->add('dias', 'Debes ingresar al menos 1 día.');
                return;
            }

            $user = \App\Models\User::find($this->route('user'));
            if (!$user || !$user->fecha_ingreso) {
                $validator->errors()->add('dias', 'El usuario no tiene fecha de ingreso.');
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

            if ($dias > $totalDisponible) {
                $validator->errors()->add('dias', "Solo hay {$totalDisponible} día(s) disponible(s) en total entre todos los períodos.");
            }
        });
    }

    public function messages(): array
    {
        return [
            'dias.required' => 'Debes ingresar la cantidad de días a registrar.',
            'dias.integer' => 'Los días deben ser un número entero.',
            'dias.min' => 'Debes ingresar al menos 1 día.',
        ];
    }
}
