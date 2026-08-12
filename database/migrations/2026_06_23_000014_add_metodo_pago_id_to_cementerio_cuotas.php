<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cementerio_cuotas', function (Blueprint $table) {
            $table->unsignedBigInteger('metodo_pago_id')->nullable()->after('fecha_pago');

            $table->foreign('metodo_pago_id')->references('id')->on('cementerio_formas_pago');
        });
    }

    public function down(): void
    {
        Schema::table('cementerio_cuotas', function (Blueprint $table) {
            $table->dropForeign(['metodo_pago_id']);
            $table->dropColumn('metodo_pago_id');
        });
    }
};
