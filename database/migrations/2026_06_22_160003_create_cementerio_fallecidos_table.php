<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cementerio_fallecidos', function (Blueprint $table) {
            $table->id();
            $table->string('rut_fallecido', 20)->nullable()->unique();
            $table->string('codigo_nn', 20)->nullable()->unique();
            $table->string('nombres_fallecido', 255);
            $table->string('apellido_paterno_fallecido', 255);
            $table->string('apellido_materno_fallecido', 255)->nullable();
            $table->date('fecha_nacimiento_fallecido');
            $table->date('fecha_fallecimiento');
            $table->foreignId('sexo_id')->constrained('cementerio_sexos');
            $table->foreignId('estado_civil_id')->constrained('cementerio_estados_civiles');
            $table->string('nacionalidad_fallecido', 100);
            $table->string('lugar_fallecimiento', 500);
            $table->text('observaciones')->nullable();
            $table->boolean('es_nn')->default(false);
            $table->string('carta_defuncion', 255)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cementerio_fallecidos');
    }
};
