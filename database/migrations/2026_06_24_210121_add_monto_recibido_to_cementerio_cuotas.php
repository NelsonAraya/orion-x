<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cementerio_cuotas', function (Blueprint $table) {
            $table->unsignedInteger('monto_recibido')->nullable()->after('monto_pagado');
        });
    }

    public function down(): void
    {
        Schema::table('cementerio_cuotas', function (Blueprint $table) {
            $table->dropColumn('monto_recibido');
        });
    }
};
