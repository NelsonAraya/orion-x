<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            //$table->bigInteger('id')->primary();
            $table->unsignedBigInteger('id')->primary();
            $table->string('nombres');
            $table->string('apellido_paterno');
            $table->string('apellido_materno')->nullable();
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->foreignId('sexo_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('nacionalidad_id')->nullable()->constrained(table: 'nacionalidades')->nullOnDelete();
            $table->foreignId('profesion_id')->nullable()->constrained(table: 'profesiones')->nullOnDelete();
            $table->foreignId('prevision_id')->nullable()->constrained(table: 'previsiones')->nullOnDelete();
            $table->foreignId('afp_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('estado_id')->nullable()->constrained()->nullOnDelete();
            $table->date('fecha_nacimiento')->nullable();
            $table->string('telefono')->nullable();
            $table->text('direccion')->nullable();
            $table->date('fecha_ingreso')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};
