<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('cementerio_formas_pago')->insert([
            'nombre' => 'Pago Mixto',
        ]);
    }

    public function down(): void
    {
        DB::table('cementerio_formas_pago')->where('nombre', 'Pago Mixto')->delete();
    }
};
