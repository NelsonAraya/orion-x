<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vacaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('user_id_creador')->constrained('users');
            $table->foreignId('estado_vacaciones_id')->constrained('estados_vacaciones');
            $table->integer('periodo_numero');
            $table->date('fecha_inicio');
            $table->date('fecha_termino');
            $table->integer('dias_solicitados');
            $table->text('motivo');
            $table->date('fecha_gestion')->nullable();
            $table->foreignId('user_id_gestion')->nullable()->constrained('users');
            $table->text('observacion_rechazo')->nullable();
            $table->text('observacion_anulacion')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vacaciones');
    }
};
