<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VacacionPeriodo extends Model
{
    protected $table = 'vacacion_periodos';

    protected $fillable = [
        'vacacion_id',
        'periodo_numero',
        'dias_consumidos',
    ];

    public function vacacion(): BelongsTo
    {
        return $this->belongsTo(Vacacione::class);
    }
}
