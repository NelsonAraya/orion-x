<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cementerio_ot', function (Blueprint $table) {
            $table->id();
            $table->string('numero_ot', 30)->unique();
            $table->unsignedBigInteger('fallecido_id');
            $table->unsignedBigInteger('deudor_id');
            $table->unsignedBigInteger('relacion_id');
            $table->unsignedBigInteger('ubicacion_id')->nullable();
            $table->unsignedBigInteger('tipo_financiamiento_id');
            $table->unsignedBigInteger('forma_pago_id');
            $table->integer('numero_cuotas')->nullable();
            $table->integer('subtotal')->default(0);
            $table->integer('iva')->default(0);
            $table->integer('total')->default(0);
            $table->string('estado', 30)->default('pendiente');
            $table->string('registrador_id')->nullable();
            $table->timestamps();

            $table->foreign('fallecido_id')->references('id')->on('cementerio_fallecidos');
            $table->foreign('deudor_id')->references('rut')->on('cementerio_deudores');
            $table->foreign('relacion_id')->references('id')->on('cementerio_relaciones');
            $table->foreign('ubicacion_id')->references('id')->on('cementerio_ubicaciones');
            $table->foreign('tipo_financiamiento_id')->references('id')->on('cementerio_financiamiento');
            $table->foreign('forma_pago_id')->references('id')->on('cementerio_formas_pago');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cementerio_ot');
    }
};
