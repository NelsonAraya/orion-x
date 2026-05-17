<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prevision extends Model
{
    protected $table = 'previsiones';

    protected $fillable = ['nombre'];
}
