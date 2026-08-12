<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CementerioEstadosCivilesSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cementerio_estados_civiles')->insert([
            ['slug' => 'soltero', 'nombre' => 'Soltero/a'],
            ['slug' => 'casado', 'nombre' => 'Casado/a'],
            ['slug' => 'viudo', 'nombre' => 'Viudo/a'],
            ['slug' => 'divorciado', 'nombre' => 'Divorciado/a'],
        ]);
    }
}
