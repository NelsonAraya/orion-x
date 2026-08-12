<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cementerio_ubicaciones', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 30)->unique();
            $table->string('nombre', 200)->nullable();
            $table->foreignId('tipo_ubicacion_id')->constrained('cementerio_tipos_ubicacion');
            $table->foreignId('sector_id')->constrained('cementerio_sectores');
            $table->foreignId('estado_ubicacion_id')->constrained('cementerio_estados_ubicacion');
            $table->string('patio', 50)->nullable();
            $table->string('calle', 100)->nullable();
            $table->string('lote', 50)->nullable();
            $table->integer('capacidad')->default(1);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cementerio_ubicaciones');
    }
};
