<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Permiso extends Model
{
    protected $table = 'permisos';

    protected $fillable = [
        'user_id',
        'user_id_creador',
        'tipo_permiso_id',
        'fecha_inicio',
        'fecha_termino',
        'jornada',
        'bloques_consumidos',
        'motivo',
        'estado_permiso_id',
        'fecha_gestion',
        'user_id_gestion',
        'observacion_rechazo',
    ];

    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date',
            'fecha_termino' => 'date',
            'fecha_gestion' => 'date',
        ];
    }

    public function getPermisoDisplayAttribute(): string
    {
        return "PERM-{$this->id}";
    }

    public function getDiasSolicitadosAttribute(): int
    {
        $inicio = $this->fecha_inicio->copy();
        $fin = $this->fecha_termino ? $this->fecha_termino->copy() : $this->fecha_inicio->copy();

        if ($inicio->gt($fin)) {
            return 0;
        }

        $dias = 0;
        while ($inicio->lte($fin)) {
            if ($inicio->dayOfWeek !== 0 && $inicio->dayOfWeek !== 6) {
                $dias++;
            }
            $inicio->addDay();
        }

        return $dias;
    }

    public function getDetalleAttribute(): string
    {
        if ($this->detalles && $this->detalles->isNotEmpty()) {
            return $this->detalles->map(fn($d) => $d->fecha->format('d/m/Y') . ' - ' . ucfirst($d->jornada))->implode(', ');
        }

        if ($this->jornada) {
            $jornadaLabel = match ($this->jornada) {
                'mañana' => 'Mañana',
                'tarde' => 'Tarde',
                'completo' => 'Completo',
                default => $this->jornada,
            };
            $bloques = $this->bloques_consumidos ?? 1;
            $bloqueText = $bloques === 1 ? '1 bloque' : '2 bloques';
            return "{$this->fecha_inicio->format('d/m/Y')} - {$jornadaLabel} ({$bloqueText})";
        }

        if ($this->fecha_termino) {
            return "{$this->fecha_inicio->format('d/m/Y')} - {$this->fecha_termino->format('d/m/Y')} ({$this->dias_solicitados} días)";
        }

        return $this->fecha_inicio->format('d/m/Y');
    }

    public function detalles(): HasMany
    {
        return $this->hasMany(PermisoDetalle::class);
    }

    public function userAsignado(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function userCreador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_creador');
    }

    public function userGestion(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_gestion');
    }

    public function tipoPermiso(): BelongsTo
    {
        return $this->belongsTo(TipoPermiso::class);
    }

    public function estadoPermiso(): BelongsTo
    {
        return $this->belongsTo(EstadoPermiso::class);
    }
}
