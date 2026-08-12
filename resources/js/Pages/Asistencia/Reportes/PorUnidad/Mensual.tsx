import { FormInput } from '@/Components/forms/FormInput';
import { FormSelect } from '@/Components/forms/FormSelect';
import { Breadcrumbs } from '@/Components/shared/Breadcrumbs';
import { PageHeader } from '@/Components/shared/PageHeader';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
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
    funcionariosUnidad,
    lugaresDesempeno,
    obtenerDatosMensual,
    unidadesCasaCentral,
} from '@/lib/asistenciaMockData';
import { cn } from '@/lib/utils';
import type { FuncionarioUnidad } from '@/types/asistencia';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlarmClock,
    CalendarRange,
    ClipboardList,
    Clock,
    Download,
    Eye,
    FileBarChart,
    FileText,
    List,
    PieChart as PieChartIcon,
    RotateCcw,
    Search,
    Target,
    Timer,
    TreePalm,
    TrendingUp,
    UserCheck,
    UserX,
    Users,
    Zap,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
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
import { VerAsistenciaModal } from './VerAsistenciaModal';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Users,
    UserCheck,
    AlarmClock,
    UserX,
    ClipboardList,
    FileText,
    TreePalm,
    Clock,
    Timer,
    Zap,
    Target,
    TrendingUp,
};

const colorMap: Record<string, { bg: string; icon: string }> = {
    blue: { bg: 'bg-blue-50', icon: 'text-blue-500' },
    indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-500' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-500' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-500' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-500' },
    red: { bg: 'bg-red-50', icon: 'text-red-500' },
    teal: { bg: 'bg-teal-50', icon: 'text-teal-500' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-500' },
};

const unidadesOptions = unidadesCasaCentral.map((u) => ({
    value: u.id,
    label: u.nombre,
}));

const lugaresOptions = lugaresDesempeno.map((l) => ({
    value: l.value,
    label: l.label,
}));

const accionesRapidas = [
    {
        icono: FileBarChart,
        titulo: 'Generar informe de unidad',
        descripcion: 'Informe ejecutivo mensual completo',
    },
    {
        icono: ClipboardList,
        titulo: 'Resumen de ausencias',
        descripcion: 'Licencias, vacaciones y permisos',
    },
    {
        icono: CalendarRange,
        titulo: 'Comparar períodos',
        descripcion: 'Analizar dos meses consecutivos',
    },
    {
        icono: Download,
        titulo: 'Exportar asistencia mensual',
        descripcion: 'Descargar cartola de la unidad',
    },
];

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

function Mensual() {
    const { url } = usePage();
    const queryUnidad = new URLSearchParams(url.split('?')[1] ?? '').get(
        'unidad',
    );
    const unidadInicial =
        queryUnidad && unidadesOptions.some((o) => o.value === queryUnidad)
            ? queryUnidad
            : 'informatica';

    const [lugar, setLugar] = useState(
        unidadesCasaCentral.find((u) => u.id === unidadInicial)
            ?.lugarDesempeno ?? 'casa-central',
    );
    const [unidad, setUnidad] = useState(unidadInicial);
    const [desde, setDesde] = useState('2026-08-01');
    const [hasta, setHasta] = useState('2026-08-31');
    const [funcionarioReporte, setFuncionarioReporte] =
        useState<FuncionarioUnidad | null>(null);

    const datos = useMemo(() => obtenerDatosMensual(unidad), [unidad]);

    const detalleFuncionario = (id: number) =>
        datos.detalle.find((d) => d.funcionarioId === id);

    const limpiar = () => {
        setLugar('casa-central');
        setUnidad('informatica');
        setDesde('2026-08-01');
        setHasta('2026-08-31');
    };

    return (
        <>
            <Head title="Reporte por Unidad - Mensual" />

            <div className="animate-fade-in-up space-y-6">
                <Breadcrumbs
                    items={[
                        { label: 'Asistencia', href: '/asistencia/dashboard' },
                        { label: 'Reportes' },
                        {
                            label: 'Por Unidad',
                            href: '/asistencia/reportes/por-unidad',
                        },
                        { label: 'Mensual' },
                    ]}
                />

                <PageHeader
                    title="Reporte por Unidad - Mensual"
                    description="¿Cómo se comportó la unidad durante el mes? Análisis de asistencia y cumplimiento"
                    actions={
                        <Link
                            href="/asistencia/reportes/por-unidad"
                            className="inline-flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent"
                        >
                            <List className="h-4 w-4" />
                            Ver unidades
                        </Link>
                    }
                />

                <Card className="border-border/50">
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="w-full sm:w-48">
                                <FormSelect
                                    label="Lugar de Desempeño"
                                    value={lugar}
                                    onValueChange={setLugar}
                                    options={lugaresOptions}
                                />
                            </div>
                            <div className="w-full sm:w-44">
                                <FormSelect
                                    label="Unidad"
                                    value={unidad}
                                    onValueChange={setUnidad}
                                    options={unidadesOptions}
                                />
                            </div>
                            <div className="w-full sm:w-40">
                                <FormInput
                                    label="Desde"
                                    type="date"
                                    value={desde}
                                    onChange={(e) => setDesde(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-40">
                                <FormInput
                                    label="Hasta"
                                    type="date"
                                    value={hasta}
                                    onChange={(e) => setHasta(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="gap-2"
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
                                    <Download className="h-4 w-4" />
                                    Exportar
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                >
                                    <FileText className="h-4 w-4" />
                                    Generar Informe
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                    {datos.resumen.map((item, index) => {
                        const Icon = iconMap[item.icono] || TrendingUp;
                        const colors = colorMap[item.color] || colorMap.blue;
                        return (
                            <Card
                                key={index}
                                className="border-border/50 transition-shadow hover:shadow-md"
                            >
                                <CardContent className="pt-5">
                                    <div
                                        className={cn(
                                            'mb-3 flex h-9 w-9 items-center justify-center rounded-lg',
                                            colors.bg,
                                        )}
                                    >
                                        <Icon
                                            className={cn(
                                                'h-4.5 w-4.5',
                                                colors.icon,
                                            )}
                                        />
                                    </div>
                                    <p className="text-xl font-bold text-foreground">
                                        {item.valor}
                                    </p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        {item.label}
                                    </p>
                                    {item.detalle && (
                                        <p className="mt-1 text-[10px] text-muted-foreground">
                                            {item.detalle}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <TrendingUp className="h-4 w-4 text-blue-500" />
                                Evolución Diaria de Horas Trabajadas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={datos.evolucionHoras}>
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
                                            dataKey="valor"
                                            name="Horas"
                                            stroke="#3B82F6"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Zap className="h-4 w-4 text-amber-500" />
                                Evolución Diaria de Horas Extra
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={datos.evolucionHorasExtra}>
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
                                            dataKey="valor"
                                            name="Horas"
                                            stroke="#F59E0B"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <AlarmClock className="h-4 w-4 text-orange-500" />
                                Evolución Diaria de Atrasos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={datos.evolucionAtrasos}>
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
                                            dataKey="valor"
                                            name="Minutos"
                                            stroke="#F97316"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <PieChartIcon className="h-4 w-4 text-purple-500" />
                                Distribución de Estados del Período
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={datos.distribucion}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="cantidad"
                                        >
                                            {datos.distribucion.map(
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

                    <Card className="border-border/50 lg:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Target className="h-4 w-4 text-emerald-500" />
                                Comparación Mensual de Cumplimiento
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={datos.comparacion}
                                        barGap={4}
                                    >
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
                                            domain={[70, 100]}
                                            tick={{ fontSize: 12 }}
                                            stroke="hsl(var(--muted-foreground))"
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar
                                            dataKey="actual"
                                            name="Mes Actual"
                                            fill="#10B981"
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

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <Card className="border-border/50 lg:col-span-2">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <ClipboardList className="h-4 w-4 text-indigo-500" />
                                Detalle Mensual por Funcionario
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="whitespace-nowrap">
                                                Funcionario
                                            </TableHead>
                                            <TableHead className="whitespace-nowrap">
                                                Horas Trabajadas
                                            </TableHead>
                                            <TableHead className="whitespace-nowrap">
                                                Horas Extra
                                            </TableHead>
                                            <TableHead className="whitespace-nowrap">
                                                Atrasos (min)
                                            </TableHead>
                                            <TableHead className="whitespace-nowrap">
                                                Ausencias (días)
                                            </TableHead>
                                            <TableHead className="whitespace-nowrap">
                                                Cumplimiento
                                            </TableHead>
                                            <TableHead className="whitespace-nowrap text-right">
                                                Acciones
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {datos.detalle.map((detalle) => {
                                            const funcionario =
                                                funcionariosUnidad.find(
                                                    (f) =>
                                                        f.id ===
                                                        detalle.funcionarioId,
                                                );
                                            return (
                                                <TableRow
                                                    key={detalle.id}
                                                    className="transition-colors hover:bg-muted/50"
                                                >
                                                    <TableCell className="whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                                                                {funcionario?.iniciales ??
                                                                    '—'}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-foreground">
                                                                    {funcionario?.nombre ??
                                                                        '—'}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {funcionario?.cargo ??
                                                                        '—'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap font-medium text-foreground">
                                                        {
                                                            detalle.horasTrabajadas
                                                        }
                                                        h
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        {detalle.horasExtra}
                                                    </TableCell>
                                                    <TableCell
                                                        className={cn(
                                                            'whitespace-nowrap',
                                                            detalle.atrasosMin >
                                                                0 &&
                                                                'font-medium text-amber-600',
                                                        )}
                                                    >
                                                        {detalle.atrasosMin}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        {detalle.ausenciasDias}
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-2 w-20 overflow-hidden rounded-full bg-muted">
                                                                <div
                                                                    className={cn(
                                                                        'h-full rounded-full',
                                                                        detalle.cumplimiento >=
                                                                            90
                                                                            ? 'bg-emerald-500'
                                                                            : detalle.cumplimiento >=
                                                                                85
                                                                              ? 'bg-amber-500'
                                                                              : 'bg-red-500',
                                                                    )}
                                                                    style={{
                                                                        width: `${detalle.cumplimiento}%`,
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className="text-sm font-medium text-foreground">
                                                                {detalle.cumplimiento.toFixed(
                                                                    1,
                                                                )}
                                                                %
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap text-right">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1.5"
                                                            onClick={() =>
                                                                funcionario &&
                                                                setFuncionarioReporte(
                                                                    funcionario,
                                                                )
                                                            }
                                                        >
                                                            <Eye className="h-3.5 w-3.5" />
                                                            Ver asistencia
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <UserCheck className="h-4 w-4 text-blue-500" />
                                Acciones Rápidas
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {accionesRapidas.map((accion, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className="flex w-full items-center gap-3 rounded-lg border border-border/50 p-3 text-left transition-colors hover:border-primary/30 hover:bg-muted/50"
                                    >
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                            <accion.icono className="h-4 w-4 text-primary" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-foreground">
                                                {accion.titulo}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {accion.descripcion}
                                            </p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <VerAsistenciaModal
                    funcionario={funcionarioReporte}
                    detalle={
                        funcionarioReporte
                            ? detalleFuncionario(funcionarioReporte.id)
                            : undefined
                    }
                    open={funcionarioReporte !== null}
                    onClose={() => setFuncionarioReporte(null)}
                />
            </div>
        </>
    );
}

Mensual.layout = (page: ReactNode) => (
    <AppLayout title="Reporte por Unidad - Mensual" children={page} />
);

export default Mensual;
