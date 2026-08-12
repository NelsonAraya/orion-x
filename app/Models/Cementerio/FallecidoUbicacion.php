<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FallecidoUbicacion extends Model
{
    protected $table = 'cementerio_fallecido_ubicacion';

    protected $fillable = [
        'fallecido_id',
        'ubicacion_id',
        'fecha_asignacion',
        'fecha_retiro',
        'activo',
    ];

    protected function casts(): array
    {
        return [
            'activo' => 'boolean',
            'fecha_asignacion' => 'date',
            'fecha_retiro' => 'date',
        ];
    }

    public function fallecido(): BelongsTo
    {
        return $this->belongsTo(Fallecido::class);
    }

    public function ubicacion(): BelongsTo
    {
        return $this->belongsTo(Ubicacion::class);
    }
}
