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
            CementerioSexosSeeder::class,
            CementerioEstadosCivilesSeeder::class,
            CementerioSectoresSeeder::class,
            CementerioTiposUbicacionSeeder::class,
            CementerioEstadosUbicacionSeeder::class,
            CementerioFormasPagoSeeder::class,
            CementerioRelacionesSeeder::class,
            CementerioFinanciamientoSeeder::class,
            CementerioServiciosSeeder::class,
            OtEstadoSeeder::class,
        ]);
    }
}
