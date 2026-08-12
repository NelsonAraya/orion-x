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
        Schema::create('cementerio_deudores', function (Blueprint $table) {
            $table->unsignedBigInteger('rut')->primary();
            $table->string('nombre_completo_deudor')->unique();
            $table->string('direccion_deudor');
            $table->string('telefono_deudor');
            $table->string('correo_electronico_deudor');
            $table->string('registrador_id');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cementerio_deudores');
    }
};
