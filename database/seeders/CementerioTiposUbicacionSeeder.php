<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CementerioTiposUbicacionSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cementerio_tipos_ubicacion')->insert([
            ['nombre' => 'Nicho'],
            ['nombre' => 'Mausoleo'],
            ['nombre' => 'Bóveda'],
            ['nombre' => 'Sepultura'],
            ['nombre' => 'Columbario'],
            ['nombre' => 'Osario'],
        ]);
    }
}
