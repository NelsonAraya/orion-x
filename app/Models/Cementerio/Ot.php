<?php

namespace App\Models\Cementerio;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class Ot extends Model
{
    protected $table = 'cementerio_ot';

    public function getRouteKeyName(): string
    {
        return 'numero_ot';
    }

    protected $fillable = [
        'numero_ot',
        'fallecido_id',
        'deudor_id',
        'relacion_id',
        'ubicacion_id',
        'tipo_financiamiento_id',
        'forma_pago_id',
        'numero_cuotas',
        'subtotal',
        'iva',
        'total',
        'documento_adjunto',
        'documento_deudor',
        'ot_estado_id',
        'registrador_id',
    ];

    public function fallecido()
    {
        return $this->belongsTo(Fallecido::class);
    }

    public function deudor()
    {
        return $this->belongsTo(Deudor::class, 'deudor_id', 'rut');
    }

    public function relacion()
    {
        return $this->belongsTo(Relacion::class);
    }

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class);
    }

    public function tipoFinanciamiento()
    {
        return $this->belongsTo(Financiamiento::class, 'tipo_financiamiento_id');
    }

    public function formaPago()
    {
        return $this->belongsTo(FormaPago::class, 'forma_pago_id');
    }

    public function servicios()
    {
        return $this->belongsToMany(Servicio::class, 'cementerio_ot_servicios', 'ot_id', 'servicio_id')
            ->withPivot('valor_unitario', 'cantidad')
            ->withTimestamps();
    }

    public function registrador()
    {
        return $this->belongsTo(User::class, 'registrador_id', 'id');
    }

    public function cuotas()
    {
        return $this->hasMany(Cuota::class, 'ot_id')->orderBy('numero_cuota');
    }

    public function estado()
    {
        return $this->belongsTo(OtEstado::class, 'ot_estado_id');
    }
}
