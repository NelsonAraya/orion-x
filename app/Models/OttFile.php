<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class OttFile extends Model
{
    protected $table = 'ott_files';

    protected $fillable = [
        'orden_trabajo_id',
        'user_id_creador',
        'nombre_original',
        'nombre_archivo',
        'mime_type',
        'tamano',
    ];

    public function ordenTrabajo(): BelongsTo
    {
        return $this->belongsTo(OrdenTrabajo::class);
    }

    public function userCreador(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_creador');
    }

    public function getTemporaryUrlAttribute(): string
    {
        $filename = rawurlencode($this->nombre_original);
        return Storage::disk('s3')->temporaryUrl(
            $this->nombre_archivo,
            now()->addMinutes(5),
            ['ResponseContentDisposition' => "attachment; filename*=UTF-8''{$filename}"]
        );
    }

    public function getTamanoFormateadoAttribute(): string
    {
        $bytes = $this->tamano;
        if ($bytes >= 1048576) {
            return round($bytes / 1048576, 1) . ' MB';
        }
        if ($bytes >= 1024) {
            return round($bytes / 1024, 1) . ' KB';
        }
        return $bytes . ' B';
    }
}
