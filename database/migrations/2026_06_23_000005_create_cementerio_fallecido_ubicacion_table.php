<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cementerio_fallecido_ubicacion', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fallecido_id')->constrained('cementerio_fallecidos');
            $table->foreignId('ubicacion_id')->constrained('cementerio_ubicaciones');
            $table->date('fecha_asignacion');
            $table->date('fecha_retiro')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cementerio_fallecido_ubicacion');
    }
};
