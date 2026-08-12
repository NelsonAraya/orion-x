import { FormInput } from '@/Components/forms/FormInput';
import { FormSelect } from '@/Components/forms/FormSelect';
import { Breadcrumbs } from '@/Components/shared/Breadcrumbs';
import { PageHeader } from '@/Components/shared/PageHeader';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import AppLayout from '@/Layouts/AppLayout';
import { funcionarios, horariosLaborales } from '@/lib/asistenciaMockData';
import { cn } from '@/lib/utils';
import type {
    DiaHorario,
    FuncionarioAsistencia,
    HorarioLaboral,
} from '@/types/asistencia';
import { Head } from '@inertiajs/react';
import {
    BriefcaseBusiness,
    Building2,
    CalendarClock,
    CalendarDays,
    Clock,
    Copy,
    Eye,
    GraduationCap,
    Hospital,
    List,
    Pencil,
    Plus,
    RotateCcw,
    Save,
    Search,
    UserCheck,
    UserRound,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

function normalizarRut(texto: string): string {
    return texto.replace(/[.\s-]/g, '').toLowerCase();
}

function formatearHoras(horas: number): string {
    return `${String(horas).replace('.', ',')} h`;
}

const estadoHorarioConfig: Record<
    HorarioLaboral['estado'],
    { badge: string; dot: string }
> = {
    Activo: {
        badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        dot: 'bg-emerald-500',
    },
    Disponible: {
        badge: 'border-blue-200 bg-blue-50 text-blue-700',
        dot: 'bg-blue-500',
    },
};

const DIAS_FIN_SEMANA = ['Sábado', 'Domingo'];

function clonarDias(dias: DiaHorario[]): DiaHorario[] {
    return dias.map((dia) => ({ ...dia }));
}

function crearPlantillaDias(): DiaHorario[] {
    return [
        { dia: 'Lunes', laborable: true, entrada: '08:00', salida: '17:00' },
        { dia: 'Martes', laborable: true, entrada: '08:00', salida: '17:00' },
        {
            dia: 'Miércoles',
            laborable: true,
            entrada: '08:00',
            salida: '17:00',
        },
        { dia: 'Jueves', laborable: true, entrada: '08:00', salida: '17:00' },
        { dia: 'Viernes', laborable: true, entrada: '08:00', salida: '16:00' },
        { dia: 'Sábado', laborable: false, entrada: null, salida: null },
        { dia: 'Domingo', laborable: false, entrada: null, salida: null },
    ];
}

function DistribucionSemanal({ dias }: { dias: DiaHorario[] }) {
    return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {dias.map((dia) => (
                <div
                    key={dia.dia}
                    className="flex items-center justify-between gap-3 rounded-md border border-border/50 bg-background/60 px-3 py-2"
                >
                    <span className="text-sm font-medium capitalize text-foreground">
                        {dia.dia}
                    </span>
                    {dia.laborable ? (
                        <span className="text-sm font-semibold text-foreground">
                            {dia.entrada} - {dia.salida}
                        </span>
                    ) : (
                        <Badge
                            variant="outline"
                            className="shrink-0 border-slate-200 bg-slate-100 text-xs text-slate-500"
                        >
                            Fin de Semana
                        </Badge>
                    )}
                </div>
            ))}
        </div>
    );
}

function Horarios() {
    const [busquedaRut, setBusquedaRut] = useState('');
    const [sugerenciasAbiertas, setSugerenciasAbiertas] = useState(false);
    const [funcionarioSeleccionado, setFuncionarioSeleccionado] =
        useState<FuncionarioAsistencia | null>(null);
    const buscarRef = useRef<HTMLDivElement>(null);

    const [tabActivo, setTabActivo] = useState('disponibles');
    const [formAbierto, setFormAbierto] = useState(false);
    const [formHorario, setFormHorario] = useState<HorarioLaboral | null>(null);
    const [diasFormulario, setDiasFormulario] = useState<DiaHorario[]>([]);
    const [detalleHorario, setDetalleHorario] = useState<HorarioLaboral | null>(
        null,
    );

    const sugerencias = funcionarios.filter(
        (f) =>
            normalizarRut(f.rut).startsWith(
                normalizarRut(busquedaRut.trim()),
            ) ||
            f.nombre.toLowerCase().includes(busquedaRut.trim().toLowerCase()),
    );

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

    const limpiar = () => {
        setFuncionarioSeleccionado(null);
        setBusquedaRut('');
        setSugerenciasAbiertas(false);
        setTabActivo('disponibles');
        setFormAbierto(false);
        setFormHorario(null);
    };

    const abrirFormulario = (horario: HorarioLaboral | null) => {
        if (horario) {
            setFormHorario(horario);
            setDiasFormulario(clonarDias(horario.dias));
        } else {
            setFormHorario(null);
            setDiasFormulario(crearPlantillaDias());
        }
        setTabActivo('editar');
        setFormAbierto(true);
    };

    const nuevoHorario = () => abrirFormulario(null);

    const duplicarHorario = (horario: HorarioLaboral) => {
        abrirFormulario({
            ...horario,
            nombre: `${horario.nombre} (Copia)`,
            estado: 'Disponible',
        });
    };

    const toggleLaborable = (index: number) => {
        setDiasFormulario((prev) =>
            prev.map((dia, i) => {
                if (i !== index) return dia;
                const laborable = !dia.laborable;
                return {
                    ...dia,
                    laborable,
                    entrada: laborable ? (dia.entrada ?? '08:00') : null,
                    salida: laborable ? (dia.salida ?? '17:00') : null,
                };
            }),
        );
    };

    const actualizarEntrada = (index: number, valor: string) => {
        setDiasFormulario((prev) =>
            prev.map((dia, i) =>
                i === index ? { ...dia, entrada: valor } : dia,
            ),
        );
    };

    const actualizarSalida = (index: number, valor: string) => {
        setDiasFormulario((prev) =>
            prev.map((dia, i) =>
                i === index ? { ...dia, salida: valor } : dia,
            ),
        );
    };

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
                  icono: CalendarDays,
                  label: 'Jornada',
                  valor: funcionarioSeleccionado.jornada,
              },
              {
                  icono: UserCheck,
                  label: 'Estado',
                  valor: funcionarioSeleccionado.estado,
              },
          ]
        : [];

    return (
        <>
            <Head title="Gestión de Horarios" />

            <div className="animate-fade-in-up space-y-6">
                <Breadcrumbs
                    items={[
                        { label: 'Asistencia', href: '/asistencia/dashboard' },
                        { label: 'Horarios' },
                    ]}
                />

                <PageHeader
                    title="Gestión de Horarios"
                    description="Administración de horarios laborales y jornadas de trabajo"
                    actions={
                        <Clock className="h-10 w-10 text-muted-foreground/30" />
                    }
                />

                <Card className="border-border/50">
                    <CardContent className="pt-6">
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
                                    onFocus={() => setSugerenciasAbiertas(true)}
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
                                                No se encontraron funcionarios
                                                con ese RUT o nombre
                                            </p>
                                        )}
                                    </div>
                                )}

                            {funcionarioSeleccionado && (
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <UserCheck className="h-5 w-5 text-emerald-600" />
                                        <div>
                                            <p className="text-sm font-medium text-emerald-900">
                                                {funcionarioSeleccionado.nombre}
                                            </p>
                                            <p className="text-xs text-emerald-700">
                                                RUT{' '}
                                                {funcionarioSeleccionado.rut}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                        onClick={limpiar}
                                    >
                                        <RotateCcw className="h-4 w-4" />
                                        Limpiar
                                    </Button>
                                </div>
                            )}
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

                                    <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                            <CardContent className="pt-6">
                                <Tabs
                                    value={tabActivo}
                                    onValueChange={setTabActivo}
                                    className="space-y-4"
                                >
                                    <TabsList>
                                        <TabsTrigger
                                            value="editar"
                                            className="gap-2"
                                        >
                                            <Pencil className="h-4 w-4" />
                                            Editar Horario
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="disponibles"
                                            className="gap-2"
                                        >
                                            <List className="h-4 w-4" />
                                            Horarios Disponibles
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent
                                        value="editar"
                                        className="space-y-6"
                                    >
                                        {formAbierto ? (
                                            <>
                                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                                    <div className="w-full">
                                                        <FormInput
                                                            label="Nombre del horario"
                                                            value={
                                                                formHorario?.nombre ??
                                                                ''
                                                            }
                                                            placeholder="Ej: Horario CESFAM"
                                                            onChange={() => {}}
                                                        />
                                                    </div>
                                                    <div className="w-full sm:col-span-2">
                                                        <FormInput
                                                            label="Descripción"
                                                            value={
                                                                formHorario?.descripcion ??
                                                                ''
                                                            }
                                                            placeholder="Descripción de la jornada"
                                                            onChange={() => {}}
                                                        />
                                                    </div>
                                                    <div className="w-full">
                                                        <FormSelect
                                                            label="Estado"
                                                            value={
                                                                formHorario?.estado ??
                                                                'Disponible'
                                                            }
                                                            onValueChange={() => {}}
                                                            options={[
                                                                {
                                                                    value: 'Activo',
                                                                    label: 'Activo',
                                                                },
                                                                {
                                                                    value: 'Disponible',
                                                                    label: 'Disponible',
                                                                },
                                                            ]}
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <h4 className="mb-2 text-sm font-semibold text-foreground">
                                                        Distribución Semanal
                                                    </h4>
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead className="whitespace-nowrap">
                                                                        Día
                                                                    </TableHead>
                                                                    <TableHead className="whitespace-nowrap">
                                                                        Laborable
                                                                    </TableHead>
                                                                    <TableHead className="whitespace-nowrap">
                                                                        Hora
                                                                        Entrada
                                                                    </TableHead>
                                                                    <TableHead className="whitespace-nowrap">
                                                                        Hora
                                                                        Salida
                                                                    </TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {diasFormulario.map(
                                                                    (
                                                                        dia,
                                                                        index,
                                                                    ) => (
                                                                        <TableRow
                                                                            key={
                                                                                dia.dia
                                                                            }
                                                                            className={cn(
                                                                                'transition-colors',
                                                                                !dia.laborable &&
                                                                                    'bg-muted/40 hover:bg-muted/50',
                                                                            )}
                                                                        >
                                                                            <TableCell className="whitespace-nowrap">
                                                                                <div className="flex items-center gap-2">
                                                                                    <span
                                                                                        className={cn(
                                                                                            'text-sm font-medium capitalize',
                                                                                            !dia.laborable &&
                                                                                                'text-muted-foreground',
                                                                                        )}
                                                                                    >
                                                                                        {
                                                                                            dia.dia
                                                                                        }
                                                                                    </span>
                                                                                    {!dia.laborable && (
                                                                                        <Badge
                                                                                            variant="outline"
                                                                                            className="shrink-0 border-slate-200 bg-slate-100 text-xs text-slate-500"
                                                                                        >
                                                                                            {DIAS_FIN_SEMANA.includes(
                                                                                                dia.dia,
                                                                                            )
                                                                                                ? 'Fin de Semana'
                                                                                                : 'No Laborable'}
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell className="whitespace-nowrap">
                                                                                <button
                                                                                    type="button"
                                                                                    role="switch"
                                                                                    aria-checked={
                                                                                        dia.laborable
                                                                                    }
                                                                                    onClick={() =>
                                                                                        toggleLaborable(
                                                                                            index,
                                                                                        )
                                                                                    }
                                                                                    className={cn(
                                                                                        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                                                                        dia.laborable
                                                                                            ? 'bg-primary'
                                                                                            : 'bg-input',
                                                                                    )}
                                                                                >
                                                                                    <span
                                                                                        className={cn(
                                                                                            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform',
                                                                                            dia.laborable
                                                                                                ? 'translate-x-5'
                                                                                                : 'translate-x-0',
                                                                                        )}
                                                                                    />
                                                                                </button>
                                                                            </TableCell>
                                                                            <TableCell className="whitespace-nowrap">
                                                                                <Input
                                                                                    type="time"
                                                                                    value={
                                                                                        dia.entrada ??
                                                                                        ''
                                                                                    }
                                                                                    disabled={
                                                                                        !dia.laborable
                                                                                    }
                                                                                    className="w-32"
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        actualizarEntrada(
                                                                                            index,
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </TableCell>
                                                                            <TableCell className="whitespace-nowrap">
                                                                                <Input
                                                                                    type="time"
                                                                                    value={
                                                                                        dia.salida ??
                                                                                        ''
                                                                                    }
                                                                                    disabled={
                                                                                        !dia.laborable
                                                                                    }
                                                                                    className="w-32"
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        actualizarSalida(
                                                                                            index,
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    ),
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Button
                                                        variant="default"
                                                        className="gap-2"
                                                    >
                                                        <Save className="h-4 w-4" />
                                                        Guardar
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        className="gap-2"
                                                        onClick={() =>
                                                            setTabActivo(
                                                                'disponibles',
                                                            )
                                                        }
                                                    >
                                                        <X className="h-4 w-4" />
                                                        Cancelar
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-12">
                                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                                                    <CalendarClock className="h-7 w-7 text-muted-foreground" />
                                                </div>
                                                <h4 className="mb-1 text-base font-semibold text-foreground">
                                                    Sin horario en edición
                                                </h4>
                                                <p className="max-w-md text-center text-sm text-muted-foreground">
                                                    Presione "Editar",
                                                    "Duplicar" o "Nuevo Horario"
                                                    para cargar un horario en
                                                    este formulario.
                                                </p>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent
                                        value="disponibles"
                                        className="space-y-4"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div>
                                                <h3 className="text-base font-semibold text-foreground">
                                                    Horarios Disponibles
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Consulte los horarios
                                                    existentes y administre las
                                                    jornadas de trabajo.
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                                onClick={nuevoHorario}
                                            >
                                                <Plus className="h-4 w-4" />
                                                Nuevo Horario
                                            </Button>
                                        </div>

                                        <div className="overflow-x-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="whitespace-nowrap">
                                                            Nombre
                                                        </TableHead>
                                                        <TableHead className="whitespace-nowrap">
                                                            Jornada
                                                        </TableHead>
                                                        <TableHead className="whitespace-nowrap">
                                                            Horas Semanales
                                                        </TableHead>
                                                        <TableHead className="whitespace-nowrap">
                                                            Estado
                                                        </TableHead>
                                                        <TableHead className="whitespace-nowrap">
                                                            Acciones
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {horariosLaborales.map(
                                                        (horario) => {
                                                            const config =
                                                                estadoHorarioConfig[
                                                                    horario
                                                                        .estado
                                                                ];
                                                            return (
                                                                <TableRow
                                                                    key={
                                                                        horario.id
                                                                    }
                                                                    className="transition-colors"
                                                                >
                                                                    <TableCell className="whitespace-nowrap font-medium text-foreground">
                                                                        {
                                                                            horario.nombre
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell className="whitespace-nowrap">
                                                                        {
                                                                            horario.jornada
                                                                        }
                                                                    </TableCell>
                                                                    <TableCell className="whitespace-nowrap">
                                                                        {formatearHoras(
                                                                            horario.horasSemanales,
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
                                                                                horario.estado
                                                                            }
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell className="whitespace-nowrap">
                                                                        <div className="flex flex-wrap items-center gap-2">
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="gap-1.5"
                                                                                onClick={() =>
                                                                                    setDetalleHorario(
                                                                                        horario,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Eye className="h-3.5 w-3.5" />
                                                                                Visualizar
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="gap-1.5"
                                                                                onClick={() =>
                                                                                    abrirFormulario(
                                                                                        horario,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Pencil className="h-3.5 w-3.5" />
                                                                                Editar
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="gap-1.5"
                                                                                onClick={() =>
                                                                                    duplicarHorario(
                                                                                        horario,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Copy className="h-3.5 w-3.5" />
                                                                                Duplicar
                                                                            </Button>
                                                                        </div>
                                                                    </TableCell>
                                                                </TableRow>
                                                            );
                                                        },
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </>
                )}

                <Dialog
                    open={detalleHorario !== null}
                    onOpenChange={(open) => !open && setDetalleHorario(null)}
                >
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <CalendarClock className="h-5 w-5 text-primary" />
                                {detalleHorario?.nombre}
                            </DialogTitle>
                            <DialogDescription>
                                Detalle del horario y distribución semanal.
                            </DialogDescription>
                        </DialogHeader>

                        {detalleHorario && (
                            <div className="space-y-5">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Tipo de Jornada
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                            {detalleHorario.jornada}
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Horas Semanales
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                            {formatearHoras(
                                                detalleHorario.horasSemanales,
                                            )}
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Días Laborales
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-emerald-700">
                                            {detalleHorario.diasLaborales} días
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Días de Descanso
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-slate-600">
                                            {detalleHorario.diasDescanso} días
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Estado
                                        </p>
                                        <p className="mt-1">
                                            <Badge
                                                variant="outline"
                                                className={cn(
                                                    'border text-xs',
                                                    estadoHorarioConfig[
                                                        detalleHorario.estado
                                                    ].badge,
                                                )}
                                            >
                                                {detalleHorario.estado}
                                            </Badge>
                                        </p>
                                    </div>
                                    <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Fecha de Asignación
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-foreground">
                                            {detalleHorario.fechaAsignacion}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                                        Distribución Semanal
                                    </p>
                                    <DistribucionSemanal
                                        dias={detalleHorario.dias}
                                    />
                                </div>
                            </div>
                        )}

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDetalleHorario(null)}
                            >
                                Cerrar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

Horarios.layout = (page: ReactNode) => (
    <AppLayout title="Gestión de Horarios" children={page} />
);

export default Horarios;
