<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

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

    protected static function booted(): void
    {
        static::deleting(function (OrdenTrabajo $orden) {
            foreach ($orden->files as $file) {
                Storage::disk('s3')->delete($file->nombre_archivo);
                $file->delete();
            }
        });
    }

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

    public function files(): HasMany
    {
        return $this->hasMany(OttFile::class, 'orden_trabajo_id');
    }
}
