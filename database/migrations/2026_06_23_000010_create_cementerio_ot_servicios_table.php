<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cementerio_ot_servicios', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ot_id');
            $table->unsignedBigInteger('servicio_id');
            $table->integer('valor_unitario');
            $table->timestamps();

            $table->unique(['ot_id', 'servicio_id']);
            $table->foreign('ot_id')->references('id')->on('cementerio_ot');
            $table->foreign('servicio_id')->references('id')->on('cementerio_servicios');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cementerio_ot_servicios');
    }
};
