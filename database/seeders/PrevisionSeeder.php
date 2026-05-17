<?php

namespace Database\Seeders;

use App\Models\Prevision;
use Illuminate\Database\Seeder;

class PrevisionSeeder extends Seeder
{
    public function run(): void
    {
        collect([
            'Fonasa',
            'Isapre Banmédica',
            'Isapre Colmena',
            'Isapre Consalud',
            'Isapre Cruz Blanca',
            'Isapre Nueva Masvida',
            'Isapre Vida Tres',
            'Ninguna',
        ])->each(fn ($nombre) => Prevision::firstOrCreate(compact('nombre')));
    }
}
