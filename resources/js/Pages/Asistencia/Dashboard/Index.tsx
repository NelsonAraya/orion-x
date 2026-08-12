import { Breadcrumbs } from '@/Components/shared/Breadcrumbs';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import AppLayout from '@/Layouts/AppLayout';
import {
    actividadReciente,
    alertas,
    centrosSalud,
    comparacionMes,
    cumplimientoCentros,
    cumplimientoUnidades,
    estadoDiario,
    evolucionAtrasos,
    evolucionHorasExtra,
    indicadores,
    periodos,
    rankingAusentismo,
    rankingCumplimiento,
    resumenInstitucional,
    tendenciaSemanal,
    unidades,
} from '@/lib/asistenciaMockData';
import { cn } from '@/lib/utils';
import { Head } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Calendar,
    CalendarDays,
    ClipboardList,
    Clock,
    Download,
    FileText,
    Info,
    Minus,
    RefreshCw,
    Target,
    Timer,
    TrendingDown,
    TrendingUp,
    UserCheck,
    Users,
    UserX,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Users,
    UserCheck,
    UserX,
    FileText,
    Calendar,
    ClipboardList,
    Clock,
    Timer,
    AlertTriangle,
    TrendingUp,
    Target,
};

const colorMap: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
    green: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        icon: 'text-emerald-500',
    },
    red: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' },
    amber: {
        bg: 'bg-amber-50',
        text: 'text-amber-600',
        icon: 'text-amber-500',
    },
    purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        icon: 'text-purple-500',
    },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600', icon: 'text-teal-500' },
    orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        icon: 'text-orange-500',
    },
    indigo: {
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        icon: 'text-indigo-500',
    },
    yellow: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-600',
        icon: 'text-yellow-500',
    },
    emerald: {
        bg: 'bg-emerald-50',
        text: 'text-emerald-600',
        icon: 'text-emerald-500',
    },
};

const prioridadConfig: Record<
    string,
    {
        color: string;
        bg: string;
        icon: React.ComponentType<{ className?: string }>;
    }
> = {
    alta: {
        color: 'text-red-600',
        bg: 'bg-red-50 border-red-200',
        icon: AlertCircle,
    },
    media: {
        color: 'text-amber-600',
        bg: 'bg-amber-50 border-amber-200',
        icon: AlertTriangle,
    },
    baja: {
        color: 'text-blue-600',
        bg: 'bg-blue-50 border-blue-200',
        icon: Info,
    },
};

const actividadIconMap: Record<
    string,
    React.ComponentType<{ className?: string }>
> = {
    horario: CalendarDays,
    marcacion: Clock,
    asistencia: UserCheck,
    jornada: Activity,
};

const actividadColorMap: Record<string, string> = {
    horario: 'bg-blue-100 text-blue-600',
    marcacion: 'bg-amber-100 text-amber-600',
    asistencia: 'bg-emerald-100 text-emerald-600',
    jornada: 'bg-purple-100 text-purple-600',
};

const CustomTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
}) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg border border-border bg-card p-3 shadow-md">
                <p className="mb-1 text-sm font-medium text-foreground">
                    {label}
                </p>
                {payload.map((entry, index) => (
                    <p
                        key={index}
                        className="text-xs"
                        style={{ color: entry.color }}
                    >
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

function Index() {
    const [periodo, setPeriodo] = useState('2026-07');
    const [centroSalud, setCentroSalud] = useState('todos');
    const [unidad, setUnidad] = useState('todas');

    const hoy = new Date();
    const fechaActual = hoy.toLocaleDateString('es-CL', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <>
            <Head title="Dashboard de Asistencia" />

            <div className="animate-fade-in-up space-y-6">
                <Breadcrumbs
                    items={[{ label: 'Asistencia' }, { label: 'Dashboard' }]}
                />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Dashboard de Asistencia
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Resumen ejecutivo del estado de asistencia
                            institucional
                        </p>
                    </div>
                    <BarChart3 className="h-10 w-10 text-muted-foreground/30" />
                </div>

                <Card className="border-border/50">
                    <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                            <div className="flex-1">
                                <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">
                                    Fecha
                                </p>
                                <p className="text-sm font-medium capitalize text-foreground">
                                    {fechaActual}
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                                <div className="w-full sm:w-44">
                                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                                        Período
                                    </p>
                                    <Select
                                        value={periodo}
                                        onValueChange={setPeriodo}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {periodos.map((p) => (
                                                <SelectItem
                                                    key={p.value}
                                                    value={p.value}
                                                >
                                                    {p.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full sm:w-48">
                                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                                        Centro de Salud
                                    </p>
                                    <Select
                                        value={centroSalud}
                                        onValueChange={setCentroSalud}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {centrosSalud.map((c) => (
                                                <SelectItem
                                                    key={c.value}
                                                    value={c.value}
                                                >
                                                    {c.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full sm:w-44">
                                    <p className="mb-1 text-xs font-medium text-muted-foreground">
                                        Unidad
                                    </p>
                                    <Select
                                        value={unidad}
                                        onValueChange={setUnidad}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {unidades.map((u) => (
                                                <SelectItem
                                                    key={u.value}
                                                    value={u.value}
                                                >
                                                    {u.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Actualizar
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
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {indicadores.map((indicador, index) => {
                        const Icon = iconMap[indicador.icono] || TrendingUp;
                        const colors =
                            colorMap[indicador.color] || colorMap.blue;
                        return (
                            <Card
                                key={index}
                                className="relative overflow-hidden border-border/50 transition-shadow hover:shadow-md"
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div
                                            className={cn(
                                                'flex h-10 w-10 items-center justify-center rounded-lg',
                                                colors.bg,
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    'h-5 w-5',
                                                    colors.icon,
                                                )}
                                            />
                                        </div>
                                        <Badge
                                            variant={
                                                indicador.tendencia === 'sube'
                                                    ? 'default'
                                                    : indicador.tendencia ===
                                                        'baja'
                                                      ? 'destructive'
                                                      : 'secondary'
                                            }
                                            className="gap-1 text-xs"
                                        >
                                            {indicador.tendencia === 'sube' && (
                                                <ArrowUpRight className="h-3 w-3" />
                                            )}
                                            {indicador.tendencia === 'baja' && (
                                                <ArrowDownRight className="h-3 w-3" />
                                            )}
                                            {indicador.tendencia ===
                                                'estable' && (
                                                <Minus className="h-3 w-3" />
                                            )}
                                            {indicador.variacion}
                                        </Badge>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-2xl font-bold text-foreground">
                                            {indicador.valor}
                                        </p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {indicador.titulo}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                Evolución Mensual de Atrasos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={evolucionAtrasos}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="hsl(var(--border))"
                                        />
                                        <XAxis
                                            dataKey="mes"
                                            tick={{ fontSize: 12 }}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="actual"
                                            name="Mes Actual"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="anterior"
                                            name="Mes Anterior"
                                            stroke="#94A3B8"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            strokeDasharray="5 5"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Timer className="h-4 w-4 text-indigo-500" />
                                Evolución Mensual de Horas Extraordinarias
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={evolucionHorasExtra}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="hsl(var(--border))"
                                        />
                                        <XAxis
                                            dataKey="mes"
                                            tick={{ fontSize: 12 }}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="actual"
                                            name="Mes Actual"
                                            stroke="#6366F1"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="anterior"
                                            name="Mes Anterior"
                                            stroke="#94A3B8"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            strokeDasharray="5 5"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Target className="h-4 w-4 text-blue-500" />
                                Cumplimiento por Centro de Salud
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={cumplimientoCentros}
                                        barGap={4}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="hsl(var(--border))"
                                        />
                                        <XAxis
                                            dataKey="nombre"
                                            tick={{ fontSize: 11 }}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <YAxis
                                            domain={[70, 100]}
                                            tick={{ fontSize: 12 }}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar
                                            dataKey="actual"
                                            name="Mes Actual"
                                            fill="#3B82F6"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="anterior"
                                            name="Mes Anterior"
                                            fill="#CBD5E1"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <BarChart3 className="h-4 w-4 text-purple-500" />
                                Cumplimiento por Unidad
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={cumplimientoUnidades}
                                        barGap={4}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="hsl(var(--border))"
                                        />
                                        <XAxis
                                            dataKey="nombre"
                                            tick={{ fontSize: 10 }}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <YAxis
                                            domain={[70, 100]}
                                            tick={{ fontSize: 12 }}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar
                                            dataKey="actual"
                                            name="Mes Actual"
                                            fill="#8B5CF6"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="anterior"
                                            name="Mes Anterior"
                                            fill="#CBD5E1"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <UserCheck className="h-4 w-4 text-emerald-500" />
                                Estado Diario de Funcionarios
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={estadoDiario}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="cantidad"
                                        >
                                            {estadoDiario.map(
                                                (entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ),
                                            )}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Activity className="h-4 w-4 text-teal-500" />
                                Tendencia Semanal de Asistencia
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={tendenciaSemanal}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="hsl(var(--border))"
                                        />
                                        <XAxis
                                            dataKey="dia"
                                            tick={{ fontSize: 12 }}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="actual"
                                            name="Esta Semana"
                                            stroke="#14B8A6"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="anterior"
                                            name="Semana Anterior"
                                            stroke="#94A3B8"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            strokeDasharray="5 5"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CalendarDays className="h-4 w-4 text-orange-500" />
                                Comparación Mes Actual vs Anterior
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={comparacionMes} barGap={4}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="hsl(var(--border))"
                                        />
                                        <XAxis
                                            dataKey="categoria"
                                            tick={{ fontSize: 10 }}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar
                                            dataKey="actual"
                                            name="Mes Actual"
                                            fill="#F97316"
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            dataKey="anterior"
                                            name="Mes Anterior"
                                            fill="#CBD5E1"
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <TrendingUp className="h-4 w-4 text-emerald-500" />
                                Ranking Centros - Mejor Cumplimiento
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {rankingCumplimiento.map((centro, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="w-6 text-center text-sm font-bold text-muted-foreground">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <div className="mb-1 flex items-center justify-between">
                                                <span className="text-sm font-medium text-foreground">
                                                    {centro.nombre}
                                                </span>
                                                <span className="text-sm font-semibold text-foreground">
                                                    {centro.valor}%
                                                </span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${centro.valor}%`,
                                                        backgroundColor:
                                                            centro.color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <TrendingDown className="h-4 w-4 text-red-500" />
                                Ranking Centros - Mayor Ausentismo
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {rankingAusentismo.map((centro, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
                                        <span className="w-6 text-center text-sm font-bold text-muted-foreground">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1">
                                            <div className="mb-1 flex items-center justify-between">
                                                <span className="text-sm font-medium text-foreground">
                                                    {centro.nombre}
                                                </span>
                                                <span className="text-sm font-semibold text-foreground">
                                                    {centro.valor}%
                                                </span>
                                            </div>
                                            <div className="h-2 overflow-hidden rounded-full bg-muted">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${centro.valor * 5}%`,
                                                        backgroundColor:
                                                            centro.color,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Card className="border-border/50 lg:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                Panel de Alertas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {alertas.map((alerta) => {
                                    const config =
                                        prioridadConfig[alerta.prioridad];
                                    const AlertIcon = config.icon;
                                    return (
                                        <div
                                            key={alerta.id}
                                            className={cn(
                                                'flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50',
                                                config.bg,
                                            )}
                                        >
                                            <AlertIcon
                                                className={cn(
                                                    'mt-0.5 h-4 w-4 shrink-0',
                                                    config.color,
                                                )}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-foreground">
                                                        {alerta.titulo}
                                                    </span>
                                                    {alerta.cantidad && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {alerta.cantidad}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="mt-0.5 text-xs text-muted-foreground">
                                                    {alerta.descripcion}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    alerta.prioridad === 'alta'
                                                        ? 'destructive'
                                                        : alerta.prioridad ===
                                                            'media'
                                                          ? 'default'
                                                          : 'secondary'
                                                }
                                                className="shrink-0 text-xs"
                                            >
                                                {alerta.prioridad}
                                            </Badge>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Clock className="h-4 w-4 text-blue-500" />
                                Actividad Reciente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {actividadReciente.map((actividad) => {
                                    const Icon =
                                        actividadIconMap[actividad.tipo] ||
                                        Activity;
                                    const colorClass =
                                        actividadColorMap[actividad.tipo] ||
                                        'bg-gray-100 text-gray-600';
                                    return (
                                        <div
                                            key={actividad.id}
                                            className="flex items-start gap-3"
                                        >
                                            <div
                                                className={cn(
                                                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                                                    colorClass,
                                                )}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-foreground">
                                                    {actividad.titulo}
                                                </p>
                                                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                    {actividad.descripcion}
                                                </p>
                                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                    <span>
                                                        {actividad.fecha}
                                                    </span>
                                                    <span>•</span>
                                                    <span>
                                                        {actividad.hora}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <h2 className="mb-4 text-lg font-semibold tracking-tight">
                        Resumen Institucional
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {resumenInstitucional.map((item, index) => {
                            const Icon = iconMap[item.icono] || TrendingUp;
                            const colors =
                                colorMap[item.color] || colorMap.blue;
                            return (
                                <Card
                                    key={index}
                                    className="border-border/50 transition-shadow hover:shadow-md"
                                >
                                    <CardContent className="pt-6">
                                        <div
                                            className={cn(
                                                'mb-3 flex h-10 w-10 items-center justify-center rounded-lg',
                                                colors.bg,
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    'h-5 w-5',
                                                    colors.icon,
                                                )}
                                            />
                                        </div>
                                        <p className="text-2xl font-bold text-foreground">
                                            {item.valor}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-muted-foreground">
                                            {item.metrica}
                                        </p>
                                        <div className="mt-2 flex items-center gap-1">
                                            {item.tendencia === 'sube' ? (
                                                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                                            ) : item.tendencia === 'baja' ? (
                                                <ArrowDownRight className="h-3 w-3 text-red-500" />
                                            ) : (
                                                <Minus className="h-3 w-3 text-muted-foreground" />
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {item.variacion}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

Index.layout = (page: ReactNode) => (
    <AppLayout title="Dashboard de Asistencia" children={page} />
);

export default Index;
