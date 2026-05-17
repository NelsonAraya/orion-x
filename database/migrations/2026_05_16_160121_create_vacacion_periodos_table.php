<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vacacion_periodos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vacacion_id')->constrained('vacaciones')->cascadeOnDelete();
            $table->unsignedTinyInteger('periodo_numero');
            $table->unsignedSmallInteger('dias_consumidos');
            $table->timestamps();

            $table->unique(['vacacion_id', 'periodo_numero']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vacacion_periodos');
    }
};
