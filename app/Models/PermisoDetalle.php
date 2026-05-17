<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PermisoDetalle extends Model
{
    protected $fillable = [
        'permiso_id',
        'fecha',
        'jornada',
        'bloques',
    ];

    protected function casts(): array
    {
        return [
            'fecha' => 'date',
        ];
    }

    public function permiso(): BelongsTo
    {
        return $this->belongsTo(Permiso::class);
    }
}
