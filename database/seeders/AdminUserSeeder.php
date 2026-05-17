<?php

namespace Database\Seeders;

use App\Models\PermisoSistema;
use App\Models\User;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['id' => 17096233],
            [
                'nombres' => 'Admin',
                'apellido_paterno' => 'Sistema',
                'email' => 'admin@orionx.cl',
                'password' => bcrypt('password'),
                'sexo_id' => 1,
                'nacionalidad_id' => 1,
                'estado_id' => 1,
                'fecha_ingreso' => now(),
            ]
        );

        $permisoRrhh = PermisoSistema::where('slug', 'rrhh')->first();
        if ($permisoRrhh) {
            $user->permisosSistema()->syncWithoutDetaching([$permisoRrhh->id]);
        }
    }
}
