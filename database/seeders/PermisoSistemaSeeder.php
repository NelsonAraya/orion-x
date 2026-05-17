<?php

namespace Database\Seeders;

use App\Models\PermisoSistema;
use Illuminate\Database\Seeder;

class PermisoSistemaSeeder extends Seeder
{
    public function run(): void
    {
        PermisoSistema::firstOrCreate(
            ['slug' => 'rrhh'],
            [
                'nombre' => 'RRHH',
                'descripcion' => 'Acceso al módulo de RRHH',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'solicitudes'],
            [
                'nombre' => 'Solicitudes',
                'descripcion' => 'Acceso a la bandeja de solicitudes',
            ]
        );
    }
}
