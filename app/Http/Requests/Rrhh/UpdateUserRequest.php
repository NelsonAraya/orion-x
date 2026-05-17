<?php

namespace App\Http\Requests\Rrhh;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $userId = $this->route('user');

        return [
            'nombres' => ['required', 'string', 'max:255'],
            'apellido_paterno' => ['required', 'string', 'max:255'],
            'apellido_materno' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId, 'id')],
            'sexo_id' => ['nullable', 'integer', 'exists:sexos,id'],
            'nacionalidad_id' => ['nullable', 'integer', 'exists:nacionalidades,id'],
            'profesion_id' => ['nullable', 'integer', 'exists:profesiones,id'],
            'prevision_id' => ['nullable', 'integer', 'exists:previsiones,id'],
            'afp_id' => ['nullable', 'integer', 'exists:afps,id'],
            'estado_id' => ['nullable', 'integer', 'exists:estados,id'],
            'fecha_nacimiento' => ['nullable', 'date'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'direccion' => ['nullable', 'string', 'max:500'],
            'fecha_ingreso' => ['nullable', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombres.required' => 'Los nombres son obligatorios.',
            'apellido_paterno.required' => 'El apellido paterno es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingresa un correo electrónico válido.',
            'email.unique' => 'Este correo electrónico ya está registrado.',
        ];
    }
}
