<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vacacione extends Model
{
    protected $table = 'vacaciones';

    protected $fillable = [
        'user_id',
        'user_id_creador',
        'estado_vacaciones_id',
        'fecha_inicio',
        'fecha_termino',
        'dias_solicitados',
        'motivo',
        'fecha_gestion',
        'user_id_gestion',
        'observacion_rechazo',
        'observacion_anulacion',
    ];

    protected function casts(): array
    {
        return [
            'fecha_inicio' => 'date',
            'fecha_termino' => 'date',
            'fecha_gestion' => 'date',
        ];
    }

    public function periodos(): HasMany
    {
        return $this->hasMany(VacacionPeriodo::class, 'vacacion_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function userCreador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_creador');
    }

    public function userGestion(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_gestion');
    }

    public function estadoVacacione(): BelongsTo
    {
        return $this->belongsTo(EstadoVacacione::class, 'estado_vacaciones_id');
    }
}
