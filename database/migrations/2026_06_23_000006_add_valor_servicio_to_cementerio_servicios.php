<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cementerio_servicios', function (Blueprint $table) {
            $table->integer('valor_servicio')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('cementerio_servicios', function (Blueprint $table) {
            $table->dropColumn('valor_servicio');
        });
    }
};
