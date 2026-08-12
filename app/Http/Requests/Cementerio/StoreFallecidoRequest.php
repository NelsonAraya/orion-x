<?php

namespace App\Http\Requests\Cementerio;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFallecidoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rut_fallecido' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('cementerio_fallecidos', 'rut_fallecido')->ignore($this->route('fallecido')),
                Rule::requiredIf(fn () => !$this->boolean('es_nn')),
            ],
            'nombres_fallecido' => ['required', 'string', 'max:255'],
            'apellido_paterno_fallecido' => ['required', 'string', 'max:255'],
            'apellido_materno_fallecido' => ['nullable', 'string', 'max:255'],
            'fecha_nacimiento_fallecido' => ['required', 'date'],
            'fecha_fallecimiento' => ['required', 'date'],
            'sexo_id' => ['required', 'exists:cementerio_sexos,id'],
            'estado_civil_id' => ['required', 'exists:cementerio_estados_civiles,id'],
            'nacionalidad_fallecido' => ['required', 'string', 'max:100'],
            'lugar_fallecimiento' => ['required', 'string', 'max:500'],
            'observaciones' => ['nullable', 'string'],
            'es_nn' => ['boolean'],
            'registrador_id' => ['nullable', 'string', 'max:20'],
            'carta_defuncion' => ['nullable', 'file', 'mimes:pdf', 'max:10240'],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->sometimes('rut_fallecido', 'prohibited', function ($input) {
            return $input->es_nn;
        });
    }

    public function messages(): array
    {
        return [
            'rut_fallecido.required_if' => 'El RUT es obligatorio cuando el fallecido no es NN.',
            'rut_fallecido.prohibited' => 'No puede ingresar RUT si el fallecido es NN.',
            'rut_fallecido.unique' => 'Este RUT ya está registrado.',
            'nombres_fallecido.required' => 'El nombre es obligatorio.',
            'apellido_paterno_fallecido.required' => 'El apellido paterno es obligatorio.',
            'fecha_nacimiento_fallecido.required' => 'La fecha de nacimiento es obligatoria.',
            'fecha_fallecimiento.required' => 'La fecha de fallecimiento es obligatoria.',
            'sexo_id.required' => 'El sexo es obligatorio.',
            'estado_civil_id.required' => 'El estado civil es obligatorio.',
            'nacionalidad_fallecido.required' => 'La nacionalidad es obligatoria.',
            'lugar_fallecimiento.required' => 'El lugar de fallecimiento es obligatorio.',
            'carta_defuncion.mimes' => 'La carta de defunción debe ser un archivo PDF.',
            'carta_defuncion.max' => 'La carta de defunción no debe superar los 10MB.',
        ];
    }
}
