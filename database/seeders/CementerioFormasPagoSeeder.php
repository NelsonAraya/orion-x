<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CementerioFormasPagoSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = [
            ['nombre' => 'Efectivo'],
            ['nombre' => 'Transferencia Electronica'],
            ['nombre' => 'Tarjeta Debito'],
            ['nombre' => 'Tarjeta Credito'],
            ['nombre' => 'Cheque'],
            ['nombre' => 'Abono'],
            ['nombre' => 'Otro'],
        ];

        foreach ($tipos as $data) {
            \App\Models\Cementerio\FormaPago::firstOrCreate(
                ['nombre' => $data['nombre']],
            );
        }
    }
}
