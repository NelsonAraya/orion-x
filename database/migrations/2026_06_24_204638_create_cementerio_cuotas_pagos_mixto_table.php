<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cementerio_cuotas_pagos_mixto', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cuota_id')->constrained('cementerio_cuotas')->cascadeOnDelete();
            $table->foreignId('metodo_pago_id')->constrained('cementerio_formas_pago');
            $table->unsignedInteger('monto');
            $table->date('fecha_pago');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cementerio_cuotas_pagos_mixto');
    }
};
