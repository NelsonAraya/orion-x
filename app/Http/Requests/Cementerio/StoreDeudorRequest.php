<?php

namespace App\Http\Requests\Cementerio;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDeudorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('rut')) {
            preg_match('/^(\d+)-(\w)$/', $this->rut, $matches);
            $this->merge([
                'rut' => (int) ($matches[1] ?? 0),
                'dv' => $matches[2] ?? '',
            ]);
        }
    }

    public function rules(): array
    {
        $rut = $this->route('deudor');

        return [
            'rut' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('cementerio_deudores', 'rut')->ignore($rut),
            ],
            'dv' => ['required', 'string', 'max:1'],
            'nombre_completo_deudor' => [
                'required',
                'string',
                'max:255',
                Rule::unique('cementerio_deudores', 'nombre_completo_deudor')->ignore($rut, 'rut'),
            ],
            'direccion_deudor' => ['required', 'string', 'max:500'],
            'telefono_deudor' => ['required', 'string', 'max:20'],
            'correo_electronico_deudor' => ['required', 'email', 'max:255'],
            'registrador_id' => ['nullable', 'string', 'max:20'],
            'primer_contacto_nombre' => ['nullable', 'string', 'max:255'],
            'primer_contacto_telefono' => ['nullable', 'string', 'max:50'],
            'primer_contacto_correo' => ['nullable', 'email', 'max:255'],
            'segundo_contacto_nombre' => ['nullable', 'string', 'max:255'],
            'segundo_contacto_telefono' => ['nullable', 'string', 'max:50'],
            'segundo_contacto_correo' => ['nullable', 'email', 'max:255'],
        ];
    }

    public function messages(): array
    {
        return [
            'rut.required' => 'El RUT es obligatorio.',
            'rut.integer' => 'El RUT debe contener solo números antes del guión.',
            'rut.unique' => 'Este RUT ya está registrado.',
            'dv.required' => 'El dígito verificador es obligatorio.',
            'nombre_completo_deudor.required' => 'El nombre completo es obligatorio.',
            'nombre_completo_deudor.unique' => 'Este nombre ya está registrado.',
            'direccion_deudor.required' => 'La dirección es obligatoria.',
            'telefono_deudor.required' => 'El teléfono es obligatorio.',
            'correo_electronico_deudor.required' => 'El correo electrónico es obligatorio.',
            'correo_electronico_deudor.email' => 'Ingrese un correo electrónico válido.',
        ];
    }
}
