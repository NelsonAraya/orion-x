<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cementerio_deudores_contacto', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_contacto1', 255)->nullable();
            $table->string('telefono_contacto1', 50)->nullable();
            $table->string('correo_contacto1', 255)->nullable();
            $table->string('nombre_contacto2', 255)->nullable();
            $table->string('telefono_contacto2', 50)->nullable();
            $table->string('correo_contacto2', 255)->nullable();
            $table->unsignedBigInteger('deudor_id')->unique();
            $table->timestamps();

            $table->foreign('deudor_id')
                ->references('rut')
                ->on('cementerio_deudores')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cementerio_deudores_contacto');
    }
};
