<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CementerioFinanciamientoSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = [
            ['nombre' => 'Servicio', 'valor_arriendo' => 0],
            ['nombre' => 'Arriendo (1 año)', 'valor_arriendo' => 150000],
            ['nombre' => 'Arriendo (5 Años)', 'valor_arriendo' => 400000],
            ['nombre' => 'Arriendo (20 Años)', 'valor_arriendo' => 750000],
            ['nombre' => 'Otros', 'valor_arriendo' => 0],
        ];

        foreach ($tipos as $data) {
            \App\Models\Cementerio\Financiamiento::firstOrCreate(
                ['nombre' => $data['nombre']],
                ['valor_arriendo' => $data['valor_arriendo']],
            );
        }
    }
}
