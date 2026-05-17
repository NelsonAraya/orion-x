<?php

namespace Database\Seeders;

use App\Models\CentroCosto;
use Illuminate\Database\Seeder;

class CentroCostoSeeder extends Seeder
{
    public function run(): void
    {
        collect([
            'CASA CENTRAL',
            'CESFAM VIDELA',
            'CESFAM AGUIRRE',
            'CESFAM GUZMAN',
            'CESFAM SUR',
            'MUSEO',
            'CASA CULTURA',
        ])->each(fn ($n) => CentroCosto::firstOrCreate(['nombre' => $n]));
    }
}
