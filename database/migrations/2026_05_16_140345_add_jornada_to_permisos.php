<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('permisos', function (Blueprint $table) {
            $table->string('jornada')->nullable()->after('fecha_termino');
            $table->integer('bloques_consumidos')->nullable()->after('jornada');
        });
    }

    public function down(): void
    {
        Schema::table('permisos', function (Blueprint $table) {
            $table->dropColumn(['jornada', 'bloques_consumidos']);
        });
    }
};
