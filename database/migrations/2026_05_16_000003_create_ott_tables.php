<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipos_orden', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->timestamps();
        });

        Schema::create('tipos_contrato', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->timestamps();
        });

        Schema::create('centros_costo', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->timestamps();
        });

        Schema::create('estados_ott', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->timestamps();
        });

        Schema::create('ordenes_trabajo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tipo_orden_id')->constrained('tipos_orden');
            $table->foreignId('user_id_asignado')->constrained('users');
            $table->foreignId('user_id_creador')->constrained('users');
            $table->foreignId('afp_id')->nullable()->constrained('afps')->nullOnDelete();
            $table->foreignId('prevision_id')->nullable()->constrained('previsiones')->nullOnDelete();
            $table->foreignId('tipo_contrato_id')->constrained('tipos_contrato');
            $table->date('fecha_inicio');
            $table->date('fecha_termino')->nullable();
            $table->integer('jornada_horas');
            $table->foreignId('centro_costo_id')->constrained('centros_costo');
            $table->integer('nivel');
            $table->foreignId('estado_ott_id')->constrained('estados_ott');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ordenes_trabajo');
        Schema::dropIfExists('estados_ott');
        Schema::dropIfExists('centros_costo');
        Schema::dropIfExists('tipos_contrato');
        Schema::dropIfExists('tipos_orden');
    }
};
