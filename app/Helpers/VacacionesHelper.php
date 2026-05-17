<?php

namespace App\Helpers;

use App\Models\Vacacione;
use Carbon\Carbon;

class VacacionesHelper
{
    public static function calcularPeriodos(?Carbon $fechaIngreso): array
    {
        if (!$fechaIngreso) return [];

        $hoy = now()->startOfDay();
        $aniosServicio = (int) $fechaIngreso->diffInYears($hoy);

        if ($aniosServicio < 1) return [];

        $periodos = [];
        for ($i = 1; $i <= $aniosServicio; $i++) {
            $inicio = $fechaIngreso->copy()->addYears($i - 1);
            $fin = $fechaIngreso->copy()->addYears($i)->subDay();

            $periodos[] = [
                'numero' => $i,
                'inicio' => $inicio->format('Y-m-d'),
                'fin' => $fin->format('Y-m-d'),
                'anio' => $fin->year,
            ];
        }

        return $periodos;
    }

    public static function calcularDiasCorrespondientes(int $aniosServicio, bool $esSalud): int
    {
        if ($esSalud) {
            if ($aniosServicio < 15) return 20;
            if ($aniosServicio < 20) return 25;
            return 30;
        }

        return 20 + intdiv(max(0, $aniosServicio - 10) + 2, 3);
    }

    public static function contarDiasHabiles(Carbon $inicio, Carbon $fin): int
    {
        $dias = 0;
        $current = $inicio->copy()->startOfDay();

        while ($current->lte($fin)) {
            if ($current->dayOfWeek !== Carbon::SUNDAY && $current->dayOfWeek !== Carbon::SATURDAY) {
                $dias++;
            }
            $current->addDay();
        }

        return $dias;
    }

    public static function calcularDiasUsados(int $userId, int $periodoNumero): int
    {
        return \App\Models\VacacionPeriodo::whereHas('vacacion', fn($q) => $q
            ->where('user_id', $userId)
            ->whereHas('estadoVacacione', fn($q) => $q->where('nombre', 'Aceptada'))
        )
            ->where('periodo_numero', $periodoNumero)
            ->sum('dias_consumidos');
    }

    public static function esSalud(int $userId): bool
    {
        $ultimaOtt = \App\Models\OrdenTrabajo::where('user_id_asignado', $userId)
            ->with('tipoOrden')
            ->latest('created_at')
            ->first();

        return $ultimaOtt?->tipoOrden?->nombre === 'Estatuto Salud';
    }
}
