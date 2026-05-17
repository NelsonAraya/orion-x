<?php

use App\Models\VacacionPeriodo;
use App\Models\Vacacione;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $migrated = 0;
        Vacacione::whereNotNull('periodo_numero')
            ->whereDoesntHave('periodos')
            ->chunk(100, function ($vacaciones) use (&$migrated) {
                foreach ($vacaciones as $v) {
                    VacacionPeriodo::create([
                        'vacacion_id' => $v->id,
                        'periodo_numero' => $v->periodo_numero,
                        'dias_consumidos' => $v->dias_solicitados,
                    ]);
                    $migrated++;
                }
            });

        if ($migrated > 0) {
            echo "Migrados {$migrated} registro(s) legacy a vacacion_periodos.\n";
        }

        Schema::table('vacaciones', function (Blueprint $table) {
            $table->dropColumn('periodo_numero');
        });
    }

    public function down(): void
    {
        Schema::table('vacaciones', function (Blueprint $table) {
            $table->unsignedTinyInteger('periodo_numero')->nullable();
        });
    }
};
