<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cementerio_cuotas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ot_id');
            $table->integer('numero_cuota');
            $table->integer('total_cuotas');
            $table->integer('monto');
            $table->date('fecha_vencimiento');
            $table->string('estado', 20)->default('pendiente');
            $table->integer('monto_pagado')->default(0);
            $table->date('fecha_pago')->nullable();
            $table->timestamps();

            $table->foreign('ot_id')->references('id')->on('cementerio_ot')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cementerio_cuotas');
    }
};
