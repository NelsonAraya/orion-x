<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CementerioRelacionesSeeder extends Seeder
{
    public function run(): void
    {
        $relaciones = ['Cónyuge', 'Hijo/a', 'Padre/Madre', 'Hermano/a', 'Otro Familiar', 'Amigo/a', 'Otro'];

        foreach ($relaciones as $nombre) {
            \App\Models\Cementerio\Relacion::firstOrCreate(['nombre_relacion' => $nombre]);
        }
    }
}
