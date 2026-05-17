<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoOrden extends Model
{
    protected $table = 'tipos_orden';

    protected $fillable = ['nombre'];
}
