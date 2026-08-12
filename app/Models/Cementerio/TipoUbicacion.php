<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoUbicacion extends Model
{
    protected $table = 'cementerio_tipos_ubicacion';

    protected $fillable = [
        'nombre',
    ];

    public function ubicaciones(): HasMany
    {
        return $this->hasMany(Ubicacion::class);
    }
}
