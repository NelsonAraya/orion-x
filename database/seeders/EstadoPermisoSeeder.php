<?php

namespace Database\Seeders;

use App\Models\EstadoPermiso;
use Illuminate\Database\Seeder;

class EstadoPermisoSeeder extends Seeder
{
    public function run(): void
    {
        collect([
            'Ingresada',
            'Aceptada',
            'Rechazada',
        ])->each(fn ($n) => EstadoPermiso::firstOrCreate(['nombre' => $n]));
    }
}
