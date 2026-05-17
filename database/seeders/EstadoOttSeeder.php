<?php

namespace Database\Seeders;

use App\Models\EstadoOtt;
use Illuminate\Database\Seeder;

class EstadoOttSeeder extends Seeder
{
    public function run(): void
    {
        collect(['Ingresada', 'Anulada'])->each(fn ($n) => EstadoOtt::firstOrCreate(['nombre' => $n]));
    }
}
