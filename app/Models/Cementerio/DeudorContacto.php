<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeudorContacto extends Model
{
    protected $table = 'cementerio_deudores_contacto';

    protected $fillable = [
        'nombre_contacto1',
        'telefono_contacto1',
        'correo_contacto1',
        'nombre_contacto2',
        'telefono_contacto2',
        'correo_contacto2',
        'deudor_id',
    ];

    public function deudor(): BelongsTo
    {
        return $this->belongsTo(Deudor::class, 'deudor_id', 'rut');
    }
}
