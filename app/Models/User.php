<?php

namespace App\Models;

use App\Helpers\RutHelper;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public $incrementing = false;

    protected $fillable = [
        'id',
        'nombres',
        'apellido_paterno',
        'apellido_materno',
        'email',
        'password',
        'foto_perfil',
        'sexo_id',
        'nacionalidad_id',
        'profesion_id',
        'prevision_id',
        'afp_id',
        'estado_id',
        'fecha_nacimiento',
        'telefono',
        'direccion',
        'fecha_ingreso',
    ];

    protected $appends = ['name', 'foto_perfil_url'];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'fecha_nacimiento' => 'date',
            'fecha_ingreso' => 'date',
            'password' => 'hashed',
        ];
    }

    public function name(): Attribute
    {
        return Attribute::get(fn () => trim("{$this->nombres} {$this->apellido_paterno}"));
    }

    public function fotoPerfilUrl(): Attribute
    {
        return Attribute::get(fn () => $this->foto_perfil
            ? asset('storage/' . $this->foto_perfil)
            : null);
    }

    public function rutCompleto(): Attribute
    {
        return Attribute::get(fn () => RutHelper::formatear($this->id));
    }

    public function scopeSearch(Builder $query, string $term): Builder
    {
        return $query->whereAny(['nombres', 'apellido_paterno', 'apellido_materno', 'email'], 'like', "%{$term}%");
    }

    public function sexo()
    {
        return $this->belongsTo(Sexo::class);
    }

    public function nacionalidad()
    {
        return $this->belongsTo(Nacionalidad::class);
    }

    public function profesion()
    {
        return $this->belongsTo(Profesion::class);
    }

    public function prevision()
    {
        return $this->belongsTo(Prevision::class);
    }

    public function afp()
    {
        return $this->belongsTo(Afp::class);
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class);
    }

    public function ordenesTrabajo()
    {
        return $this->hasMany(OrdenTrabajo::class, 'user_id_asignado');
    }

    public function permisosSistema()
    {
        return $this->belongsToMany(PermisoSistema::class, 'user_permiso_sistema', 'user_id', 'permiso_id');
    }
}
