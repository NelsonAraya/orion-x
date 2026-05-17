<?php

namespace Database\Seeders;

use App\Models\Afp;
use Illuminate\Database\Seeder;

class AfpSeeder extends Seeder
{
    public function run(): void
    {
        collect([
            'Provida', 'Habitat', 'Capital', 'Cuprum', 'PlanVital', 'Uno', 'No AFP',
        ])->each(fn ($nombre) => Afp::firstOrCreate(compact('nombre')));
    }
}
