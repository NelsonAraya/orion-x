<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cementerio_ot_servicios', function (Blueprint $table) {
            $table->integer('cantidad')->default(1)->after('valor_unitario');
        });
    }

    public function down(): void
    {
        Schema::table('cementerio_ot_servicios', function (Blueprint $table) {
            $table->dropColumn('cantidad');
        });
    }
};
