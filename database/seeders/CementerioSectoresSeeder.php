<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CementerioSectoresSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cementerio_sectores')->insert([
            ['nombre' => 'Cementerio 1'],
            ['nombre' => 'Cementerio 3'],
        ]);
    }
}
