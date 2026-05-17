<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tipos_permiso', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->timestamps();
        });

        Schema::create('estados_permiso', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->timestamps();
        });

        Schema::create('permisos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->foreignId('user_id_creador')->constrained('users');
            $table->foreignId('tipo_permiso_id')->constrained('tipos_permiso');
            $table->date('fecha_inicio');
            $table->date('fecha_termino')->nullable();
            $table->text('motivo');
            $table->foreignId('estado_permiso_id')->constrained('estados_permiso');
            $table->date('fecha_gestion')->nullable();
            $table->foreignId('user_id_gestion')->nullable()->constrained('users');
            $table->text('observacion_rechazo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permisos');
        Schema::dropIfExists('estados_permiso');
        Schema::dropIfExists('tipos_permiso');
    }
};
