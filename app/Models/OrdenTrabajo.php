<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrdenTrabajo extends Model
{
    protected $table = 'ordenes_trabajo';

    protected $fillable = [
        'tipo_orden_id',
        'user_id_asignado',
        'user_id_creador',
        'afp_id',
        'prevision_id',
        'tipo_contrato_id',
        'fecha_inicio',
        'fecha_termino',
        'jornada_horas',
        'centro_costo_id',
        'nivel',
        'estado_ott_id',
    ];

    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date',
            'fecha_termino' => 'date',
        ];
    }

    public function getOttDisplayAttribute(): string
    {
        return "OTT-{$this->id}";
    }

    public function tipoOrden(): BelongsTo
    {
        return $this->belongsTo(TipoOrden::class);
    }

    public function tipoContrato(): BelongsTo
    {
        return $this->belongsTo(TipoContrato::class);
    }

    public function centroCosto(): BelongsTo
    {
        return $this->belongsTo(CentroCosto::class);
    }

    public function estadoOtt(): BelongsTo
    {
        return $this->belongsTo(EstadoOtt::class);
    }

    public function afp(): BelongsTo
    {
        return $this->belongsTo(Afp::class);
    }

    public function prevision(): BelongsTo
    {
        return $this->belongsTo(Prevision::class);
    }

    public function userAsignado(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_asignado');
    }

    public function userCreador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_creador');
    }
}
