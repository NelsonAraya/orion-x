<?php

namespace Database\Seeders;

use App\Models\Nacionalidad;
use Illuminate\Database\Seeder;

class NacionalidadSeeder extends Seeder
{
    public function run(): void
    {
        collect([
            'Chile', 'Argentina', 'Perú', 'Bolivia', 'Ecuador',
            'Colombia', 'Venezuela', 'México', 'España', 'Otro',
        ])->each(fn ($nombre) => Nacionalidad::firstOrCreate(compact('nombre')));
    }
}
