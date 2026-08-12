<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sector extends Model
{
    protected $table = 'cementerio_sectores';

    protected $fillable = [
        'nombre',
    ];

    public function ubicaciones(): HasMany
    {
        return $this->hasMany(Ubicacion::class);
    }
}
