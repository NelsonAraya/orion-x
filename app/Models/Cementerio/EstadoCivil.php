<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;

class EstadoCivil extends Model
{
    protected $table = 'cementerio_estados_civiles';

    protected $fillable = [
        'slug',
        'nombre',
    ];
}
