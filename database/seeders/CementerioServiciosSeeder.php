<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CementerioServiciosSeeder extends Seeder
{
    public function run(): void
    {
        $servicios = [
            ['nombre' => 'Sepultación', 'valor_servicio' => 120000],
            ['nombre' => 'Exhumación', 'valor_servicio' => 150000],
            ['nombre' => 'Reducción', 'valor_servicio' => 120000],
            ['nombre' => 'Traslado', 'valor_servicio' => 250000],
            ['nombre' => 'Cremación', 'valor_servicio' => 600000],
            ['nombre' => 'Mantención', 'valor_servicio' => 50000],
            ['nombre' => 'Apertura Nicho', 'valor_servicio' => 50000],
            ['nombre' => 'Cierre Nicho', 'valor_servicio' => 50000],
        ];

        foreach ($servicios as $data) {
            \App\Models\Cementerio\Servicio::firstOrCreate(
                ['nombre' => $data['nombre']],
                ['valor_servicio' => $data['valor_servicio']],
            );
        }
    }
}
