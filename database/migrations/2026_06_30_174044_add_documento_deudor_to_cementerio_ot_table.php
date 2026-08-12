<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cementerio_ot', function (Blueprint $table) {
            $table->string('documento_deudor', 255)->nullable()->after('documento_adjunto');
        });
    }

    public function down(): void
    {
        Schema::table('cementerio_ot', function (Blueprint $table) {
            $table->dropColumn('documento_deudor');
        });
    }
};
