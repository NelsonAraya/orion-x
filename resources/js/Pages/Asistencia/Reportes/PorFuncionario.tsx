import { FormInput } from '@/Components/forms/FormInput';
import { FormSelect } from '@/Components/forms/FormSelect';
import { Breadcrumbs } from '@/Components/shared/Breadcrumbs';
import { PageHeader } from '@/Components/shared/PageHeader';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Input } from '@/Components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import AppLayout from '@/Layouts/AppLayout';
import {
    funcionarios,
    generarRegistrosAsistencia,
    horarios,
} from '@/lib/asistenciaMockData';
import { cn } from '@/lib/utils';
import type {
    EstadoAsistencia,
    FuncionarioAsistencia,
    RegistroAsistencia,
} from '@/types/asistencia';
import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    BriefcaseBusiness,
    Building2,
    Calendar,
    CalendarClock,
    CalendarDays,
    ClipboardList,
    Clock,
    Download,
    FileText,
    GraduationCap,
    Hospital,
    RotateCcw,
    Search,
    Timer,
    TrendingUp,
    UserCog,
    UserRound,
    Users,
    X,
    Zap,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

const HORARIO_REF = '08:00 - 17:00';

const estadoConfig: Record<
    EstadoAsistencia,
    { label: string; badge: string; dot: string }
> = {
    presente: {
        label: 'Presente',
        badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        dot: 'bg-emerald-500',
    },
    atraso: {
        label: 'Atraso',
        badge: 'border-amber-200 bg-amber-50 text-amber-700',
        dot: 'bg-amber-500',
    },
    horas_extra: {
        label: 'Horas Extra',
        badge: 'border-blue-200 bg-blue-50 text-blue-700',
        dot: 'bg-blue-500',
    },
    permiso: {
        label: 'Permiso Admin',
        badge: 'border-purple-200 bg-purple-50 text-purple-700',
        dot: 'bg-purple-500',
    },
    licencia: {
        label: 'Licencia Médica',
        badge: 'border-red-200 bg-red-50 text-red-700',
        dot: 'bg-red-500',
    },
    vacaciones: {
        label: 'Vacaciones',
        badge: 'border-teal-200 bg-teal-50 text-teal-700',
        dot: 'bg-teal-500',
    },
    descanso: {
        label: 'Fin de Semana',
        badge: 'border-slate-200 bg-slate-100 text-slate-500',
        dot: 'bg-slate-400',
    },
};

function normalizarRut(texto: string): string {
    return texto.replace(/[.\s-]/g, '').toLowerCase();
}

function formatearFecha(iso: string): string {
    const [anio, mes, dia] = iso.split('-');
    return `${dia}-${mes}-${anio}`;
}

function formatearAtraso(min: number): string {
    return min > 0 ? `${min} min` : '—';
}

function formatearHorasExtra(min: number): string {
    if (min <= 0) return '—';
    if (min < 60) return `${min} min`;
    const horas = Math.floor(min / 60);
    const minutos = String(min % 60).padStart(2, '0');
    return `${horas}h ${minutos}m`;
}

function PorFuncionario() {
    const [busquedaRut, setBusquedaRut] = useState('');
    const [sugerenciasAbiertas, setSugerenciasAbiertas] = useState(false);
    const [funcionarioSeleccionado, setFuncionarioSeleccionado] =
        useState<FuncionarioAsistencia | null>(null);
    const [filtros, setFiltros] = useState({
        desde: '2026-07-01',
        hasta: '2026-07-31',
        horario: '0800-1700',
    });

    const buscarRef = useRef<HTMLDivElement>(null);

    const registros = useMemo<RegistroAsistencia[]>(
        () => generarRegistrosAsistencia(),
        [],
    );

    const sugerencias = useMemo(() => {
        const query = normalizarRut(busquedaRut.trim());
        if (!query) return [];
        return funcionarios.filter(
            (f) =>
                normalizarRut(f.rut).startsWith(query) ||
                f.nombre.toLowerCase().includes(query),
        );
    }, [busquedaRut]);

    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (
                buscarRef.current &&
                !buscarRef.current.contains(e.target as Node)
            ) {
                setSugerenciasAbiertas(false);
            }
        };
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const seleccionarFuncionario = (f: FuncionarioAsistencia) => {
        setFuncionarioSeleccionado(f);
        setBusquedaRut(f.rut);
        setSugerenciasAbiertas(false);
    };

    const buscar = () => {
        const match = sugerencias[0];
        if (match) seleccionarFuncionario(match);
    };

    const limpiar = () => {
        setFuncionarioSeleccionado(null);
        setBusquedaRut('');
        setSugerenciasAbiertas(false);
        setFiltros({
            desde: '2026-07-01',
            hasta: '2026-07-31',
            horario: '0800-1700',
        });
    };

    const registrosVisibles = useMemo(
        () =>
            registros.filter(
                (r) => r.fecha >= filtros.desde && r.fecha <= filtros.hasta,
            ),
        [registros, filtros],
    );

    const resumen = useMemo(() => {
        const diasHabiles = registros.filter(
            (r) => r.estado !== 'descanso',
        ).length;
        const horasTrabajadas = registros.reduce((acc, r) => {
            if (r.estado === 'permiso') return acc + 4;
            if (
                r.estado === 'presente' ||
                r.estado === 'atraso' ||
                r.estado === 'horas_extra'
            ) {
                return acc + 8;
            }
            return acc;
        }, 0);
        const totalAtraso = registros.reduce((acc, r) => acc + r.atrasoMin, 0);
        const totalHorasExtra = registros.reduce(
            (acc, r) => acc + r.horasExtraMin,
            0,
        );
        const permisos = registros.filter((r) => r.estado === 'permiso').length;
        const licencias = registros.filter(
            (r) => r.estado === 'licencia',
        ).length;
        const vacaciones = registros.filter(
            (r) => r.estado === 'vacaciones',
        ).length;
        const horasEsperadas = diasHabiles * 8;
        const baseCumplimiento =
            horasEsperadas - licencias * 8 - vacaciones * 8;
        const cumplimiento =
            baseCumplimiento > 0
                ? (horasTrabajadas / baseCumplimiento) * 100
                : 0;
        return {
            diasHabiles,
            horasEsperadas,
            horasTrabajadas,
            totalAtraso,
            totalHorasExtra,
            permisos,
            licencias,
            vacaciones,
            cumplimiento,
        };
    }, [registros]);

    const datosFicha = funcionarioSeleccionado
        ? [
              {
                  icono: BriefcaseBusiness,
                  label: 'Cargo',
                  valor: funcionarioSeleccionado.cargo,
              },
              {
                  icono: GraduationCap,
                  label: 'Profesión',
                  valor: funcionarioSeleccionado.profesion,
              },
              {
                  icono: Building2,
                  label: 'Unidad',
                  valor: funcionarioSeleccionado.unidad,
              },
              {
                  icono: Hospital,
                  label: 'Centro de Salud',
                  valor: funcionarioSeleccionado.centroSalud,
              },
              {
                  icono: UserCog,
                  label: 'Jefatura',
                  valor: funcionarioSeleccionado.jefatura,
              },
              {
                  icono: CalendarDays,
                  label: 'Jornada',
                  valor: funcionarioSeleccionado.jornada,
              },
              {
                  icono: CalendarClock,
                  label: 'Horario Asignado',
                  valor: funcionarioSeleccionado.horarioAsignado,
              },
              {
                  icono: CalendarDays,
                  label: 'Fecha de Ingreso',
                  valor: funcionarioSeleccionado.fechaIngreso,
              },
          ]
        : [];

    return (
        <>
            <Head title="Reporte por Funcionario" />

            <div className="animate-fade-in-up space-y-6">
                <Breadcrumbs
                    items={[
                        { label: 'Asistencia', href: '/asistencia/dashboard' },
                        { label: 'Reportes' },
                        { label: 'Por Funcionario' },
                    ]}
                />

                <PageHeader
                    title="Reporte por Funcionario"
                    description="Análisis detallado de asistencia por funcionario individual"
                    actions={
                        <Users className="h-10 w-10 text-muted-foreground/30" />
                    }
                />

                <Card className="border-border/50">
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4">
                            <div ref={buscarRef} className="relative">
                                <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                                    Funcionario
                                </p>
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        value={busquedaRut}
                                        placeholder="Buscar por RUT del funcionario (ej: 11111111)..."
                                        className="pl-10 pr-9"
                                        onChange={(e) => {
                                            setBusquedaRut(e.target.value);
                                            setSugerenciasAbiertas(true);
                                        }}
                                        onFocus={() =>
                                            setSugerenciasAbiertas(true)
                                        }
                                    />
                                    {busquedaRut && (
                                        <button
                                            type="button"
                                            aria-label="Limpiar búsqueda"
                                            onClick={() => {
                                                setBusquedaRut('');
                                                setSugerenciasAbiertas(false);
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {sugerenciasAbiertas &&
                                    busquedaRut.trim() !== '' && (
                                        <div className="animate-fade-in-up absolute z-20 mt-2 w-full overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                                            {sugerencias.length > 0 ? (
                                                sugerencias.map((f) => (
                                                    <button
                                                        key={f.rut}
                                                        type="button"
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            seleccionarFuncionario(
                                                                f,
                                                            );
                                                        }}
                                                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/60"
                                                    >
                                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                                            {f.iniciales}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium text-foreground">
                                                                {f.nombre}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {f.rut}
                                                            </p>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className="shrink-0 text-xs"
                                                        >
                                                            RUT
                                                        </Badge>
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="px-3 py-3 text-center text-sm text-muted-foreground">
                                                    No se encontraron
                                                    funcionarios con ese RUT o
                                                    nombre
                                                </p>
                                            )}
                                        </div>
                                    )}
                            </div>

                            <div className="flex flex-wrap items-end gap-3">
                                <div className="w-full sm:w-40">
                                    <FormInput
                                        label="Desde"
                                        type="date"
                                        value={filtros.desde}
                                        onChange={(e) =>
                                            setFiltros((prev) => ({
                                                ...prev,
                                                desde: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="w-full sm:w-40">
                                    <FormInput
                                        label="Hasta"
                                        type="date"
                                        value={filtros.hasta}
                                        onChange={(e) =>
                                            setFiltros((prev) => ({
                                                ...prev,
                                                hasta: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="w-full sm:w-44">
                                    <FormSelect
                                        label="Horario"
                                        value={filtros.horario}
                                        onValueChange={(value) =>
                                            setFiltros((prev) => ({
                                                ...prev,
                                                horario: value,
                                            }))
                                        }
                                        options={horarios}
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="gap-2"
                                        onClick={buscar}
                                    >
                                        <Search className="h-4 w-4" />
                                        Buscar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={limpiar}
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Limpiar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <FileText className="h-4 w-4" />
                                        Generar Informe
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <Download className="h-4 w-4" />
                                        Exportar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {funcionarioSeleccionado && (
                    <>
                        <Card className="border-border/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <UserRound className="h-4 w-4 text-blue-500" />
                                    Información del Funcionario
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-3">
                                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                                    <div className="flex flex-col items-center gap-3 text-center md:w-56 md:shrink-0 md:items-start md:text-left">
                                        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary ring-4 ring-primary/5">
                                            {funcionarioSeleccionado.iniciales}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-foreground">
                                                {funcionarioSeleccionado.nombre}
                                            </h3>
                                            <p className="mt-0.5 text-sm text-muted-foreground">
                                                RUT{' '}
                                                {funcionarioSeleccionado.rut}
                                            </p>
                                        </div>
                                        <Badge className="gap-1 bg-emerald-500/10 text-xs text-emerald-700 hover:bg-emerald-500/10">
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                            {funcionarioSeleccionado.estado}
                                        </Badge>
                                    </div>

                                    <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        {datosFicha.map((item, index) => (
                                            <div
                                                key={index}
                                                className="rounded-lg border border-border/50 bg-muted/30 p-3"
                                            >
                                                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                                    <item.icono className="h-3.5 w-3.5" />
                                                    {item.label}
                                                </div>
                                                <p className="mt-1 text-sm font-medium text-foreground">
                                                    {item.valor}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <CalendarDays className="h-4 w-4 text-blue-500" />
                                    Cartola Mensual de Asistencia
                                </CardTitle>
                                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2">
                                    {Object.values(estadoConfig).map(
                                        (config) => (
                                            <span
                                                key={config.label}
                                                className="flex items-center gap-1.5 text-xs text-muted-foreground"
                                            >
                                                <span
                                                    className={cn(
                                                        'h-2 w-2 rounded-full',
                                                        config.dot,
                                                    )}
                                                />
                                                {config.label}
                                            </span>
                                        ),
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="whitespace-nowrap">
                                                    Fecha
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap">
                                                    Día
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap">
                                                    Entrada
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap">
                                                    Salida
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap">
                                                    Horario
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap">
                                                    Atraso
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap">
                                                    Horas Extra
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap">
                                                    Estado
                                                </TableHead>
                                                <TableHead className="whitespace-nowrap">
                                                    Observación
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {registrosVisibles.map(
                                                (registro) => {
                                                    const config =
                                                        estadoConfig[
                                                            registro.estado
                                                        ];
                                                    const esDescanso =
                                                        registro.estado ===
                                                        'descanso';
                                                    return (
                                                        <TableRow
                                                            key={registro.fecha}
                                                            className={cn(
                                                                'transition-colors',
                                                                esDescanso &&
                                                                    'bg-muted/40 hover:bg-muted/50',
                                                            )}
                                                        >
                                                            <TableCell className="whitespace-nowrap font-medium text-foreground">
                                                                {formatearFecha(
                                                                    registro.fecha,
                                                                )}
                                                            </TableCell>
                                                            <TableCell
                                                                className={cn(
                                                                    'whitespace-nowrap capitalize',
                                                                    esDescanso &&
                                                                        'text-muted-foreground',
                                                                )}
                                                            >
                                                                {registro.dia}
                                                            </TableCell>
                                                            <TableCell className="whitespace-nowrap">
                                                                {registro.entrada ??
                                                                    '—'}
                                                            </TableCell>
                                                            <TableCell className="whitespace-nowrap">
                                                                {registro.salida ??
                                                                    '—'}
                                                            </TableCell>
                                                            <TableCell className="whitespace-nowrap">
                                                                {HORARIO_REF}
                                                            </TableCell>
                                                            <TableCell
                                                                className={cn(
                                                                    'whitespace-nowrap',
                                                                    registro.atrasoMin >
                                                                        0 &&
                                                                        'font-medium text-amber-600',
                                                                )}
                                                            >
                                                                {formatearAtraso(
                                                                    registro.atrasoMin,
                                                                )}
                                                            </TableCell>
                                                            <TableCell
                                                                className={cn(
                                                                    'whitespace-nowrap',
                                                                    registro.horasExtraMin >
                                                                        0 &&
                                                                        'font-medium text-blue-600',
                                                                )}
                                                            >
                                                                {formatearHorasExtra(
                                                                    registro.horasExtraMin,
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="whitespace-nowrap">
                                                                <Badge
                                                                    variant="outline"
                                                                    className={cn(
                                                                        'border text-xs',
                                                                        config.badge,
                                                                    )}
                                                                >
                                                                    {
                                                                        config.label
                                                                    }
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell
                                                                className={cn(
                                                                    'whitespace-nowrap',
                                                                    esDescanso &&
                                                                        'text-muted-foreground',
                                                                )}
                                                            >
                                                                {registro.observacion ||
                                                                    '—'}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                },
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <ClipboardList className="h-4 w-4 text-indigo-500" />
                                    Resumen del Período
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-3">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    <div className="rounded-lg border border-border/50 p-4">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <Clock className="h-3.5 w-3.5 text-blue-500" />
                                            Horas Esperadas
                                        </div>
                                        <p className="mt-1.5 text-lg font-bold text-foreground">
                                            {resumen.horasEsperadas}h
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {resumen.diasHabiles} días hábiles
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border/50 p-4">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <Timer className="h-3.5 w-3.5 text-indigo-500" />
                                            Horas Trabajadas
                                        </div>
                                        <p className="mt-1.5 text-lg font-bold text-foreground">
                                            {resumen.horasTrabajadas}h
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Incluye medias jornadas por permiso
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border/50 p-4">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                                            Total Atrasos
                                        </div>
                                        <p className="mt-1.5 text-lg font-bold text-foreground">
                                            {resumen.totalAtraso} min
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            En 4 días hábiles
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border/50 p-4">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <Zap className="h-3.5 w-3.5 text-amber-500" />
                                            Total Horas Extra
                                        </div>
                                        <p className="mt-1.5 text-lg font-bold text-foreground">
                                            {formatearHorasExtra(
                                                resumen.totalHorasExtra,
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            En 4 días
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border/50 p-4">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <ClipboardList className="h-3.5 w-3.5 text-purple-500" />
                                            Permisos Administrativos
                                        </div>
                                        <p className="mt-1.5 text-lg font-bold text-foreground">
                                            {resumen.permisos}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            1 bloque mañana / 1 bloque tarde
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border/50 p-4">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <FileText className="h-3.5 w-3.5 text-red-500" />
                                            Licencias Médicas
                                        </div>
                                        <p className="mt-1.5 text-lg font-bold text-foreground">
                                            {resumen.licencias} días
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Días consecutivos
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border/50 p-4">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5 text-teal-500" />
                                            Vacaciones
                                        </div>
                                        <p className="mt-1.5 text-lg font-bold text-foreground">
                                            {resumen.vacaciones} días
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Días consecutivos
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border/50 p-4">
                                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                                            Cumplimiento
                                        </div>
                                        <p className="mt-1.5 text-lg font-bold text-foreground">
                                            {resumen.cumplimiento.toFixed(1)}%
                                        </p>
                                        <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                                                style={{
                                                    width: `${resumen.cumplimiento}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </>
    );
}

PorFuncionario.layout = (page: ReactNode) => (
    <AppLayout title="Reporte por Funcionario" children={page} />
);

export default PorFuncionario;
