<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cementerio_deudores', function (Blueprint $table) {
            $table->string('dv', 1)->after('rut');
        });
    }

    public function down(): void
    {
        Schema::table('cementerio_deudores', function (Blueprint $table) {
            $table->dropColumn('dv');
        });
    }
};
