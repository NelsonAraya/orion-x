<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;

class Financiamiento extends Model
{
    protected $table = 'cementerio_financiamiento';

    protected $fillable = ['nombre', 'valor_arriendo'];
}
