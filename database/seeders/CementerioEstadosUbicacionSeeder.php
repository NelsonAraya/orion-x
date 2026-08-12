<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CementerioEstadosUbicacionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cementerio_estados_ubicacion')->insert([
            ['nombre' => 'Disponible'],
            ['nombre' => 'Ocupado'],
            ['nombre' => 'Reservado'],
            ['nombre' => 'En Mantención'],
            ['nombre' => 'Bloqueado'],
        ]);
    }
}
