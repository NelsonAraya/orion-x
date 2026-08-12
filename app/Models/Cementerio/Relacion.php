<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;

class Relacion extends Model
{
    protected $table = 'cementerio_relaciones';

    protected $fillable = ['nombre_relacion'];
}
