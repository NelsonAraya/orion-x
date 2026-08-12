<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasColumn('cementerio_ot', 'ot_estado_id')) {
            Schema::table('cementerio_ot', function (Blueprint $table) {
                $table->foreignId('ot_estado_id')->nullable()->constrained('cementerio_ot_estados');
            });
        }

        DB::table('cementerio_ot_estados')->insertOrIgnore([
            ['nombre' => 'Ingresada', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Finalizada', 'created_at' => now(), 'updated_at' => now()],
            ['nombre' => 'Anulada', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $ingresada = DB::table('cementerio_ot_estados')->where('nombre', 'Ingresada')->value('id');
        $finalizada = DB::table('cementerio_ot_estados')->where('nombre', 'Finalizada')->value('id');
        $anulada = DB::table('cementerio_ot_estados')->where('nombre', 'Anulada')->value('id');

        DB::statement("UPDATE cementerio_ot SET ot_estado_id = {$ingresada} WHERE estado IN ('pendiente', 'en_proceso')");
        DB::statement("UPDATE cementerio_ot SET ot_estado_id = {$finalizada} WHERE estado = 'finalizada'");
        DB::statement("UPDATE cementerio_ot SET ot_estado_id = {$anulada} WHERE estado = 'anulada'");

        Schema::table('cementerio_ot', function (Blueprint $table) {
            $table->foreignId('ot_estado_id')->nullable(false)->change();
            $table->dropColumn('estado');
        });
    }

    public function down(): void
    {
        Schema::table('cementerio_ot', function (Blueprint $table) {
            $table->string('estado', 30)->default('pendiente');
        });

        $ingresada = DB::table('cementerio_ot_estados')->where('nombre', 'Ingresada')->value('id');
        $finalizada = DB::table('cementerio_ot_estados')->where('nombre', 'Finalizada')->value('id');
        $anulada = DB::table('cementerio_ot_estados')->where('nombre', 'Anulada')->value('id');

        DB::statement("UPDATE cementerio_ot SET estado = 'pendiente' WHERE ot_estado_id = {$ingresada}");
        DB::statement("UPDATE cementerio_ot SET estado = 'finalizada' WHERE ot_estado_id = {$finalizada}");
        DB::statement("UPDATE cementerio_ot SET estado = 'anulada' WHERE ot_estado_id = {$anulada}");

        Schema::table('cementerio_ot', function (Blueprint $table) {
            $table->dropForeign(['ot_estado_id']);
            $table->dropColumn('ot_estado_id');
        });
    }
};
