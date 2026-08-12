import { FormInput } from '@/Components/forms/FormInput';
import { FormSelect } from '@/Components/forms/FormSelect';
import { Breadcrumbs } from '@/Components/shared/Breadcrumbs';
import { PageHeader } from '@/Components/shared/PageHeader';
import { Badge } from '@/Components/ui/badge';
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
    alertasDia,
    datosDiarioPorUnidad,
    estadosDiarioOptions,
    funcionariosUnidad,
    indicadoresCobertura,
    lugaresDesempeno,
    unidadesCasaCentral,
} from '@/lib/asistenciaMockData';
import { cn } from '@/lib/utils';
import type { EstadoDiarioUnidad, FuncionarioUnidad } from '@/types/asistencia';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    AlarmClock,
    AlertCircle,
    AlertTriangle,
    Building2,
    CalendarDays,
    ClipboardList,
    Download,
    Eye,
    FileText,
    Info,
    List,
    PieChart as PieChartIcon,
    RotateCcw,
    Search,
    TreePalm,
    UserCheck,
    UserX,
    Users,
} from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import { VerAsistenciaModal } from './VerAsistenciaModal';

const estadoDiarioConfig: Record<
    EstadoDiarioUnidad,
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
    ausente: {
        label: 'Ausente',
        badge: 'border-red-200 bg-red-50 text-red-700',
        dot: 'bg-red-500',
    },
    permiso: {
        label: 'Permiso Admin',
        badge: 'border-purple-200 bg-purple-50 text-purple-700',
        dot: 'bg-purple-500',
    },
    licencia: {
        label: 'Licencia Médica',
        badge: 'border-blue-200 bg-blue-50 text-blue-700',
        dot: 'bg-blue-500',
    },
    vacaciones: {
        label: 'Vacaciones',
        badge: 'border-teal-200 bg-teal-50 text-teal-700',
        dot: 'bg-teal-500',
    },
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Users,
    UserCheck,
    AlarmClock,
    UserX,
    ClipboardList,
    FileText,
    TreePalm,
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

const unidadesOptions = unidadesCasaCentral.map((u) => ({
    value: u.id,
    label: u.nombre,
}));

const lugaresOptions = lugaresDesempeno.map((l) => ({
    value: l.value,
    label: l.label,
}));

function Diario() {
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
    const [fecha, setFecha] = useState('2026-08-04');
    const [estadoFiltro, setEstadoFiltro] = useState('todos');
    const [buscar, setBuscar] = useState(Boolean(queryUnidad));
    const [funcionarioReporte, setFuncionarioReporte] =
        useState<FuncionarioUnidad | null>(null);

    const unidadesDelLugar = useMemo(
        () =>
            unidadesCasaCentral
                .filter((u) => u.lugarDesempeno === lugar)
                .map((u) => ({ value: u.id, label: u.nombre })),
        [lugar],
    );

    const cambiarLugar = (value: string) => {
        const primera = unidadesCasaCentral.find(
            (u) => u.lugarDesempeno === value,
        );
        setLugar(value);
        if (primera) setUnidad(primera.id);
        setBuscar(false);
    };

    const datos = datosDiarioPorUnidad[unidad];

    const registrosVisibles = useMemo(
        () =>
            estadoFiltro === 'todos'
                ? datos.registros
                : datos.registros.filter((r) => r.estado === estadoFiltro),
        [datos, estadoFiltro],
    );

    const pieData = useMemo(() => {
        const estados: EstadoDiarioUnidad[] = [
            'presente',
            'atraso',
            'ausente',
            'permiso',
            'licencia',
            'vacaciones',
        ];
        const colores: Record<EstadoDiarioUnidad, string> = {
            presente: '#10B981',
            atraso: '#F59E0B',
            ausente: '#EF4444',
            permiso: '#8B5CF6',
            licencia: '#3B82F6',
            vacaciones: '#14B8A6',
        };
        return estados
            .map((estado) => ({
                name: estadoDiarioConfig[estado].label,
                value: datos.registros.filter((r) => r.estado === estado)
                    .length,
                color: colores[estado],
            }))
            .filter((e) => e.value > 0);
    }, [datos]);

    const buscarFuncionario = (id: number) =>
        funcionariosUnidad.find((f) => f.id === id) ?? null;

    const limpiar = () => {
        setLugar('casa-central');
        setUnidad('informatica');
        setFecha('2026-08-04');
        setEstadoFiltro('todos');
        setBuscar(false);
    };

    return (
        <>
            <Head title="Reporte por Unidad - Diario" />

            <div className="animate-fade-in-up space-y-6">
                <Breadcrumbs
                    items={[
                        { label: 'Asistencia', href: '/asistencia/dashboard' },
                        { label: 'Reportes' },
                        {
                            label: 'Por Unidad',
                            href: '/asistencia/reportes/por-unidad',
                        },
                        { label: 'Diario' },
                    ]}
                />

                <PageHeader
                    title="Reporte por Unidad - Diario"
                    description="¿Quién está disponible hoy? Gestión operativa de la unidad"
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
                                    onValueChange={cambiarLugar}
                                    options={lugaresOptions}
                                />
                            </div>
                            <div className="w-full sm:w-44">
                                <FormSelect
                                    label="Unidad"
                                    value={unidad}
                                    onValueChange={(value) => {
                                        setUnidad(value);
                                        setBuscar(false);
                                    }}
                                    options={unidadesDelLugar}
                                    disabled={unidadesDelLugar.length === 0}
                                />
                            </div>
                            <div className="w-full sm:w-40">
                                <FormInput
                                    label="Fecha"
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                />
                            </div>
                            <div className="w-full sm:w-48">
                                <FormSelect
                                    label="Estado"
                                    value={estadoFiltro}
                                    onValueChange={setEstadoFiltro}
                                    options={estadosDiarioOptions}
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="gap-2"
                                    onClick={() => setBuscar(true)}
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

                {!buscar ? (
                    <Card className="border-border/50">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <Search className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                Seleccione un lugar de desempeño
                            </h3>
                            <p className="max-w-md text-center text-sm text-muted-foreground">
                                Elija un lugar y una unidad en los filtros y
                                presione Buscar para ver las tarjetas y el
                                detalle diario de la unidad.
                            </p>
                        </CardContent>
                    </Card>
                ) : unidadesDelLugar.length === 0 ? (
                    <Card className="border-border/50">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                                <Building2 className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                Sin unidades en este lugar
                            </h3>
                            <p className="max-w-md text-center text-sm text-muted-foreground">
                                {lugaresDesempeno.find((l) => l.value === lugar)
                                    ?.label ?? 'Este lugar'}{' '}
                                aún no tiene unidades registradas. Seleccione
                                otro lugar de desempeño para continuar.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
                            {datos.resumen.map((item, index) => {
                                const Icon = iconMap[item.icono] || Users;
                                const colors =
                                    colorMap[item.color] || colorMap.blue;
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
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            <Card className="border-border/50 lg:col-span-2">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        <CalendarDays className="h-4 w-4 text-blue-500" />
                                        Detalle Diario de la Unidad
                                    </CardTitle>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2">
                                        {Object.values(estadoDiarioConfig).map(
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
                                                        Funcionario
                                                    </TableHead>
                                                    <TableHead className="whitespace-nowrap">
                                                        Cargo
                                                    </TableHead>
                                                    <TableHead className="whitespace-nowrap">
                                                        Horario Asignado
                                                    </TableHead>
                                                    <TableHead className="whitespace-nowrap">
                                                        Entrada
                                                    </TableHead>
                                                    <TableHead className="whitespace-nowrap">
                                                        Atraso
                                                    </TableHead>
                                                    <TableHead className="whitespace-nowrap">
                                                        Salida
                                                    </TableHead>
                                                    <TableHead className="whitespace-nowrap">
                                                        Estado
                                                    </TableHead>
                                                    <TableHead className="whitespace-nowrap">
                                                        Observación
                                                    </TableHead>
                                                    <TableHead className="whitespace-nowrap text-right">
                                                        Acciones
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {registrosVisibles.map(
                                                    (registro) => {
                                                        const funcionario =
                                                            buscarFuncionario(
                                                                registro.funcionarioId,
                                                            );
                                                        const config =
                                                            estadoDiarioConfig[
                                                                registro.estado
                                                            ];
                                                        return (
                                                            <TableRow
                                                                key={
                                                                    registro.id
                                                                }
                                                                className="transition-colors hover:bg-muted/50"
                                                            >
                                                                <TableCell className="whitespace-nowrap">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                                                                            {funcionario?.iniciales ??
                                                                                '—'}
                                                                        </div>
                                                                        <span className="font-medium text-foreground">
                                                                            {funcionario?.nombre ??
                                                                                '—'}
                                                                        </span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="whitespace-nowrap text-muted-foreground">
                                                                    {funcionario?.cargo ??
                                                                        '—'}
                                                                </TableCell>
                                                                <TableCell className="whitespace-nowrap">
                                                                    {
                                                                        registro.horarioAsignado
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="whitespace-nowrap">
                                                                    {registro.entrada ??
                                                                        '—'}
                                                                </TableCell>
                                                                <TableCell
                                                                    className={cn(
                                                                        'whitespace-nowrap',
                                                                        registro.atrasoMin >
                                                                            0 &&
                                                                            'font-medium text-amber-600',
                                                                    )}
                                                                >
                                                                    {registro.atrasoMin >
                                                                    0
                                                                        ? `${registro.atrasoMin} min`
                                                                        : '—'}
                                                                </TableCell>
                                                                <TableCell className="whitespace-nowrap">
                                                                    {registro.salida ??
                                                                        '—'}
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
                                                                <TableCell className="whitespace-nowrap text-muted-foreground">
                                                                    {
                                                                        registro.observacion
                                                                    }
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
                                                                        Ver
                                                                        asistencia
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    },
                                                )}
                                                {registrosVisibles.length ===
                                                    0 && (
                                                    <TableRow>
                                                        <TableCell
                                                            colSpan={9}
                                                            className="py-10 text-center text-sm text-muted-foreground"
                                                        >
                                                            No hay funcionarios
                                                            con el estado
                                                            seleccionado
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-4">
                                <Card className="border-border/50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <PieChartIcon className="h-4 w-4 text-purple-500" />
                                            Distribución de Estados
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="h-56">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <PieChart>
                                                    <Pie
                                                        data={pieData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={45}
                                                        outerRadius={75}
                                                        paddingAngle={2}
                                                        dataKey="value"
                                                    >
                                                        {pieData.map(
                                                            (entry, index) => (
                                                                <Cell
                                                                    key={`cell-${index}`}
                                                                    fill={
                                                                        entry.color
                                                                    }
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
                                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                                            Alertas del Día
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {alertasDia.map((alerta) => {
                                                const config =
                                                    prioridadConfig[
                                                        alerta.prioridad
                                                    ];
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
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">
                                                                {alerta.titulo}
                                                            </p>
                                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                                {
                                                                    alerta.descripcion
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-border/50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            <UserCheck className="h-4 w-4 text-emerald-500" />
                                            Cobertura de la Unidad
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {indicadoresCobertura.map(
                                                (item, index) => {
                                                    const colors =
                                                        colorMap[item.color] ||
                                                        colorMap.blue;
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="flex items-center justify-between gap-3 rounded-lg border border-border/50 p-3"
                                                        >
                                                            <div>
                                                                <p className="text-sm font-medium text-foreground">
                                                                    {item.label}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {
                                                                        item.detalle
                                                                    }
                                                                </p>
                                                            </div>
                                                            <span
                                                                className={cn(
                                                                    'shrink-0 rounded-md px-2 py-1 text-sm font-bold',
                                                                    colors.bg,
                                                                    colors.icon,
                                                                )}
                                                            >
                                                                {item.valor}
                                                            </span>
                                                        </div>
                                                    );
                                                },
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </>
                )}

                <VerAsistenciaModal
                    funcionario={funcionarioReporte}
                    open={funcionarioReporte !== null}
                    onClose={() => setFuncionarioReporte(null)}
                />
            </div>
        </>
    );
}

Diario.layout = (page: ReactNode) => (
    <AppLayout title="Reporte por Unidad - Diario" children={page} />
);

export default Diario;
