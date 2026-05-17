<?php

namespace Database\Seeders;

use App\Models\Profesion;
use Illuminate\Database\Seeder;

class ProfesionSeeder extends Seeder
{
    public function run(): void
    {
        collect([
            'Médico Cirujano', 'Enfermero(a)', 'Ingeniero(a)',
            'Técnico(a)', 'Administrativo(a)', 'Abogado(a)',
            'Contador(a)', 'Psicólogo(a)', 'Kinesiólogo(a)',
            'Tecnólogo(a) Médico', 'Otro',
        ])->each(fn ($nombre) => Profesion::firstOrCreate(compact('nombre')));
    }
}
