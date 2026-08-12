<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CementerioSexosSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cementerio_sexos')->insert([
            ['slug' => 'masculino', 'nombre' => 'Masculino'],
            ['slug' => 'femenino', 'nombre' => 'Femenino'],
        ]);
    }
}
