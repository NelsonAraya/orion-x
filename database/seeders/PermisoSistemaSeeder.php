<?php

namespace Database\Seeders;

use App\Models\PermisoSistema;
use Illuminate\Database\Seeder;

class PermisoSistemaSeeder extends Seeder
{
    public function run(): void
    {
        PermisoSistema::firstOrCreate(
            ['slug' => 'rrhh'],
            [
                'nombre' => 'RRHH',
                'descripcion' => 'Acceso al módulo de RRHH',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'solicitudes'],
            [
                'nombre' => 'Solicitudes',
                'descripcion' => 'Acceso a la bandeja de solicitudes',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'cementerio'],
            [
                'nombre' => 'Cementerio',
                'descripcion' => 'Acceso al módulo de Cementerio',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'cementerio-gestion-mortuaria'],
            [
                'nombre' => 'Gestión Mortuaria',
                'descripcion' => 'Acceso al módulo de Gestión Mortuaria',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'cementerio-registro-fallecido'],
            [
                'nombre' => 'Registro de Fallecido',
                'descripcion' => 'Acceso al registro de fallecidos',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'cementerio-historial-deudores'],
            [
                'nombre' => 'Historial Deudores',
                'descripcion' => 'Acceso al historial de deudores',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'cementerio-orden-trabajo'],
            [
                'nombre' => 'Orden de Trabajo',
                'descripcion' => 'Acceso al módulo de Orden de Trabajo',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'cementerio-ingresar-ot'],
            [
                'nombre' => 'Ingresar OT',
                'descripcion' => 'Acceso a Ingresar Orden de Trabajo',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'cementerio-buscar-ot'],
            [
                'nombre' => 'Buscar OT',
                'descripcion' => 'Acceso a Buscar Orden de Trabajo',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'cementerio-reportes'],
            [
                'nombre' => 'Reportes',
                'descripcion' => 'Acceso al módulo de Reportes',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'cementerio-ubicaciones'],
            [
                'nombre' => 'Ubicaciones',
                'descripcion' => 'Acceso al módulo de Ubicaciones',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'cementerio-buscar-por-fallecido'],
            [
                'nombre' => 'Buscar por Fallecido',
                'descripcion' => 'Acceso a buscar por fallecido',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'cementerio-consultar-ubicaciones'],
            [
                'nombre' => 'Consultar Ubicaciones',
                'descripcion' => 'Acceso a consultar ubicaciones',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'cementerio-documentos'],
            [
                'nombre' => 'Documentos',
                'descripcion' => 'Acceso al módulo de Documentos',
            ]
        );

        PermisoSistema::firstOrCreate(
            ['slug' => 'asistencia'],
            [
                'nombre' => 'Asistencia',
                'descripcion' => 'Acceso al módulo de Asistencia',
            ]
        );
    }
}
