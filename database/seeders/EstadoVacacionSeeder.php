<?php

namespace Database\Seeders;

use App\Models\EstadoVacacione;
use Illuminate\Database\Seeder;

class EstadoVacacionSeeder extends Seeder
{
    public function run(): void
    {
        collect(['Ingresada', 'Aceptada', 'Rechazada', 'Anulada'])
            ->each(fn($n) => EstadoVacacione::firstOrCreate(['nombre' => $n]));
    }
}
