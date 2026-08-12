<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;

class FormaPago extends Model
{
    protected $table = 'cementerio_formas_pago';

    protected $fillable = ['nombre'];
}
