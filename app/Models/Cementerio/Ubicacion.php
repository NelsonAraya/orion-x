<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ubicacion extends Model
{
    use SoftDeletes;

    protected $table = 'cementerio_ubicaciones';

    protected $fillable = [
        'codigo',
        'nombre',
        'tipo_ubicacion_id',
        'sector_id',
        'estado_ubicacion_id',
        'patio',
        'calle',
        'lote',
        'capacidad',
    ];

    public function tipoUbicacion(): BelongsTo
    {
        return $this->belongsTo(TipoUbicacion::class);
    }

    public function sector(): BelongsTo
    {
        return $this->belongsTo(Sector::class);
    }

    public function estadoUbicacion(): BelongsTo
    {
        return $this->belongsTo(EstadoUbicacion::class);
    }

    public function fallecidos(): HasMany
    {
        return $this->hasMany(FallecidoUbicacion::class);
    }

    public function fallecidosActivos(): HasMany
    {
        return $this->hasMany(FallecidoUbicacion::class)->where('activo', true);
    }
}
