<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permiso_detalles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('permiso_id')->constrained('permisos')->cascadeOnDelete();
            $table->date('fecha');
            $table->string('jornada');
            $table->integer('bloques');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permiso_detalles');
    }
};
