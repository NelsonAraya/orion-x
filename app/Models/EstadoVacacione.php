<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EstadoVacacione extends Model
{
    protected $table = 'estados_vacaciones';

    protected $fillable = ['nombre'];
}
