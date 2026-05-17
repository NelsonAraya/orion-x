<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PermisoSistema extends Model
{
    protected $table = 'permisos_sistema';

    protected $fillable = [
        'nombre',
        'slug',
        'descripcion',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_permiso_sistema', 'permiso_id', 'user_id');
    }
}
