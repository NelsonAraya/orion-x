<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;

class Cuota extends Model
{
    protected $table = 'cementerio_cuotas';

    protected $fillable = [
        'ot_id',
        'numero_cuota',
        'total_cuotas',
        'monto',
        'fecha_vencimiento',
        'estado',
        'monto_pagado',
        'monto_recibido',
        'fecha_pago',
        'metodo_pago_id',
    ];

    protected $casts = [
        'fecha_pago' => 'datetime',
        'fecha_vencimiento' => 'date',
    ];

    public function ot()
    {
        return $this->belongsTo(Ot::class, 'ot_id');
    }

    public function metodoPago()
    {
        return $this->belongsTo(FormaPago::class, 'metodo_pago_id');
    }

    public function pagosMixtos()
    {
        return $this->hasMany(CuotaPagoMixto::class, 'cuota_id');
    }
}
