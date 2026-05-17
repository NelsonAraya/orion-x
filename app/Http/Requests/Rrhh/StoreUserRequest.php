<?php

namespace App\Http\Requests\Rrhh;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'id' => ['required', 'string', 'max:20'],
            'nombres' => ['required', 'string', 'max:255'],
            'apellido_paterno' => ['required', 'string', 'max:255'],
            'apellido_materno' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
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
            'id.required' => 'El RUT es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Ingresa un correo electrónico válido.',
            'email.unique' => 'Este correo electrónico ya está registrado.',
        ];
    }
}
