<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserModuloPerfil extends Model
{
    protected $table = 'user_modulo_perfil';

    protected $fillable = [
        'user_id',
        'modulo_slug',
        'perfil_slug',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
