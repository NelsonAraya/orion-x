<?php

namespace Database\Seeders;

use App\Models\TipoContrato;
use Illuminate\Database\Seeder;

class TipoContratoSeeder extends Seeder
{
    public function run(): void
    {
        collect(['Indefinido', 'Honorario', 'Plazo Fijo', 'Reemplazo'])
            ->each(fn ($n) => TipoContrato::firstOrCreate(['nombre' => $n]));
    }
}
