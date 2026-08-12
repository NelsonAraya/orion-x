<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;

class Sexo extends Model
{
    protected $table = 'cementerio_sexos';

    protected $fillable = [
        'slug',
        'nombre',
    ];
}
