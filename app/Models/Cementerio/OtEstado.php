<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;

class OtEstado extends Model
{
    protected $table = 'cementerio_ot_estados';

    protected $fillable = [
        'nombre',
    ];
}
