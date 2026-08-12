<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EstadoUbicacion extends Model
{
    protected $table = 'cementerio_estados_ubicacion';

    protected $fillable = [
        'nombre',
    ];

    public function ubicaciones(): HasMany
    {
        return $this->hasMany(Ubicacion::class);
    }
}
