<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_permiso_sistema', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('permiso_id')->constrained('permisos_sistema')->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['user_id', 'permiso_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_permiso_sistema');
    }
};
