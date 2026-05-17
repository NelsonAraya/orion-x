<?php

namespace Database\Seeders;

use App\Models\Sexo;
use Illuminate\Database\Seeder;

class SexoSeeder extends Seeder
{
    public function run(): void
    {
        collect(['Masculino', 'Femenino', 'Otro'])
            ->each(fn ($nombre) => Sexo::firstOrCreate(compact('nombre')));
    }
}
