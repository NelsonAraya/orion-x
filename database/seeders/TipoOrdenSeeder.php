<?php

namespace Database\Seeders;

use App\Models\TipoOrden;
use Illuminate\Database\Seeder;

class TipoOrdenSeeder extends Seeder
{
    public function run(): void
    {
        collect(['Código del Trabajo', 'Estatuto Salud'])->each(fn ($n) => TipoOrden::firstOrCreate(['nombre' => $n]));
    }
}
