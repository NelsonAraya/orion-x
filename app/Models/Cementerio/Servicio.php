<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;

class Servicio extends Model
{
    protected $table = 'cementerio_servicios';

    protected $fillable = ['nombre', 'valor_servicio'];
}
