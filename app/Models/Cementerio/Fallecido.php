<?php

namespace App\Models\Cementerio;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Fallecido extends Model
{
    use SoftDeletes;

    protected $table = 'cementerio_fallecidos';

    protected $fillable = [
        'rut_fallecido',
        'codigo_nn',
        'nombres_fallecido',
        'apellido_paterno_fallecido',
        'apellido_materno_fallecido',
        'fecha_nacimiento_fallecido',
        'fecha_fallecimiento',
        'sexo_id',
        'estado_civil_id',
        'nacionalidad_fallecido',
        'lugar_fallecimiento',
        'observaciones',
        'es_nn',
        'carta_defuncion',
        'registrador_id',
    ];

    protected $appends = ['nombre_completo'];

    protected function casts(): array
    {
        return [
            'es_nn' => 'boolean',
            'fecha_nacimiento_fallecido' => 'date',
            'fecha_fallecimiento' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (self $fallecido) {
            if ($fallecido->es_nn) {
                $fallecido->rut_fallecido = null;
            }
        });

        static::created(function (self $fallecido) {
            if ($fallecido->es_nn && !$fallecido->codigo_nn) {
                $fallecido->codigo_nn = 'NN-' . str_pad($fallecido->id, 5, '0', STR_PAD_LEFT);
                $fallecido->saveQuietly();
            }
        });
    }

    public function getNombreCompletoAttribute(): string
    {
        return trim("{$this->nombres_fallecido} {$this->apellido_paterno_fallecido} {$this->apellido_materno_fallecido}");
    }

    public function getIdentificadorAttribute(): string
    {
        return $this->rut_fallecido ?? $this->codigo_nn ?? 'Sin identificar';
    }

    public function sexo(): BelongsTo
    {
        return $this->belongsTo(Sexo::class);
    }

    public function estadoCivil(): BelongsTo
    {
        return $this->belongsTo(EstadoCivil::class);
    }

    public function ubicacionActual(): HasOne
    {
        return $this->hasOne(FallecidoUbicacion::class)->where('activo', true);
    }

    public function historialUbicaciones(): HasMany
    {
        return $this->hasMany(FallecidoUbicacion::class);
    }
}
