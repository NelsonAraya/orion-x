<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OtEstadoSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('cementerio_ot_estados')->insertOrIgnore([
            ['nombre' => 'Ingresada', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Finalizada', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Anulada', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
