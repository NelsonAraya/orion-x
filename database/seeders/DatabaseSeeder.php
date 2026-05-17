<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SexoSeeder::class,
            NacionalidadSeeder::class,
            ProfesionSeeder::class,
            PrevisionSeeder::class,
            AfpSeeder::class,
            EstadoSeeder::class,
            PermisoSistemaSeeder::class,
            AdminUserSeeder::class,
            TipoOrdenSeeder::class,
            TipoContratoSeeder::class,
            CentroCostoSeeder::class,
            EstadoOttSeeder::class,
            TipoPermisoSeeder::class,
            EstadoPermisoSeeder::class,
            EstadoVacacionSeeder::class,
        ]);
    }
}
