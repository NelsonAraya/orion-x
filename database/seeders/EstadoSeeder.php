<?php

namespace Database\Seeders;

use App\Models\Estado;
use Illuminate\Database\Seeder;

class EstadoSeeder extends Seeder
{
    public function run(): void
    {
        collect(['Activo', 'Inactivo', 'Suspendido'])
            ->each(fn ($nombre) => Estado::firstOrCreate(compact('nombre')));
    }
}
