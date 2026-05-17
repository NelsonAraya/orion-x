<?php

namespace Database\Seeders;

use App\Models\TipoPermiso;
use Illuminate\Database\Seeder;

class TipoPermisoSeeder extends Seeder
{
    public function run(): void
    {
        collect([
            'Capacitación',
            'Nacimiento',
            'Devolución de Hora',
            'Casamiento',
            'Defunción',
            'Con Goce de Sueldo',
            'Fuero Sindical',
        ])->each(fn ($n) => TipoPermiso::firstOrCreate(['nombre' => $n]));
    }
}
