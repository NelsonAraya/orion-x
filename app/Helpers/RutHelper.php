<?php

namespace App\Helpers;

class RutHelper
{
    public static function digitoVerificador(int $rut): string
    {
        $sum = 0;
        $mult = 2;
        $temp = $rut;

        while ($temp > 0) {
            $sum += ($temp % 10) * $mult;
            $temp = intdiv($temp, 10);
            $mult = $mult < 7 ? $mult + 1 : 2;
        }

        $rest = $sum % 11;
        $dv = 11 - $rest;

        return match ($dv) {
            11 => '0',
            10 => 'K',
            default => (string) $dv,
        };
    }

    public static function formatear(int $rut): string
    {
        $dv = self::digitoVerificador($rut);
        $rutStr = (string) $rut;
        $formatted = number_format((int) $rutStr, 0, ',', '.');

        return "$formatted-$dv";
    }
}
