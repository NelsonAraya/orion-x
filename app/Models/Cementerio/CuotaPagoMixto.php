<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;

class CuotaPagoMixto extends Model
{
    protected $table = 'cementerio_cuotas_pagos_mixto';

    protected $fillable = [
        'cuota_id',
        'metodo_pago_id',
        'monto',
        'fecha_pago',
    ];

    public function cuota()
    {
        return $this->belongsTo(Cuota::class, 'cuota_id');
    }

    public function metodoPago()
    {
        return $this->belongsTo(FormaPago::class, 'metodo_pago_id');
    }
}
