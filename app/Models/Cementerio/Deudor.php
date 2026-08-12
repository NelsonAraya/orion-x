<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Deudor extends Model
{
    use SoftDeletes;

    protected $table = 'cementerio_deudores';

    protected $primaryKey = 'rut';

    public $incrementing = false;

    protected $keyType = 'integer';

    protected $fillable = [
        'rut',
        'dv',
        'nombre_completo_deudor',
        'direccion_deudor',
        'telefono_deudor',
        'correo_electronico_deudor',
        'registrador_id',
    ];

    public function contacto(): HasOne
    {
        return $this->hasOne(DeudorContacto::class, 'deudor_id', 'rut');
    }
}
