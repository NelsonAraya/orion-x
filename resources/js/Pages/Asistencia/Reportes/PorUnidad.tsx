import { FormSelect } from '@/Components/forms/FormSelect';
import { Breadcrumbs } from '@/Components/shared/Breadcrumbs';
import { PageHeader } from '@/Components/shared/PageHeader';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import AppLayout from '@/Layouts/AppLayout';
import {
    lugaresDesempeno,
    unidadesCasaCentral,
} from '@/lib/asistenciaMockData';
import { cn } from '@/lib/utils';
import type { UnidadAsistencia } from '@/types/asistencia';
import { Head } from '@inertiajs/react';
import {
    Building2,
    List,
    Search,
    Target,
    UserCheck,
    Users,
    UserX,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { IntegrantesModal } from './PorUnidad/IntegrantesModal';

const lugaresOptions = lugaresDesempeno.map((l) => ({
    value: l.value,
    label: l.label,
}));

const colorVariants: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-500',
    emerald: 'bg-emerald-50 text-emerald-500',
    red: 'bg-red-50 text-red-500',
};

function cumplimientoColor(valor: number) {
    if (valor >= 90) return 'bg-emerald-500';
    if (valor >= 85) return 'bg-amber-500';
    return 'bg-red-500';
}

function UnidadCard({
    unidad,
    onVerIntegrantes,
}: {
    unidad: UnidadAsistencia;
    onVerIntegrantes: (unidad: UnidadAsistencia) => void;
}) {
    const lugarLabel =
        lugaresDesempeno.find((l) => l.value === unidad.lugarDesempeno)
            ?.label ?? 'Unidad';

    return (
        <Card className="flex flex-col border-border/50 transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div
                            className={cn(
                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                                colorVariants.blue,
                            )}
                        >
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div>
                            <CardTitle className="text-base">
                                {unidad.nombre}
                            </CardTitle>
                            <p className="text-xs text-muted-foreground">
                                Unidad de {lugarLabel}
                            </p>
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className="shrink-0 border-blue-200 bg-blue-50 text-xs text-blue-700"
                    >
                        Dotación {unidad.dotacion}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4 pt-0">
                <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-lg border border-border/50 p-2 text-center">
                        <UserCheck className="mx-auto mb-1 h-4 w-4 text-emerald-500" />
                        <p className="text-sm font-bold text-foreground">
                            {unidad.presentes}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Presentes
                        </p>
                    </div>
                    <div className="rounded-lg border border-border/50 p-2 text-center">
                        <UserX className="mx-auto mb-1 h-4 w-4 text-red-500" />
                        <p className="text-sm font-bold text-foreground">
                            {unidad.ausentes}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Ausentes
                        </p>
                    </div>
                    <div className="rounded-lg border border-border/50 p-2 text-center">
                        <Target className="mx-auto mb-1 h-4 w-4 text-blue-500" />
                        <p className="text-sm font-bold text-foreground">
                            {unidad.cumplimiento.toFixed(1)}%
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                            Cumplimiento
                        </p>
                    </div>
                </div>

                <div>
                    <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                            Cumplimiento del mes
                        </span>
                        <span className="font-medium text-foreground">
                            {unidad.cumplimiento.toFixed(1)}%
                        </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                            className={cn(
                                'h-full rounded-full transition-all',
                                cumplimientoColor(unidad.cumplimiento),
                            )}
                            style={{ width: `${unidad.cumplimiento}%` }}
                        />
                    </div>
                </div>

                <div className="mt-auto pt-1">
                    <Button
                        variant="default"
                        className="w-full gap-1.5"
                        onClick={() => onVerIntegrantes(unidad)}
                    >
                        <Users className="h-4 w-4" />
                        Ver integrantes
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function PorUnidad() {
    const [lugar, setLugar] = useState('casa-central');
    const [buscar, setBuscar] = useState(false);
    const [unidadModal, setUnidadModal] = useState<UnidadAsistencia | null>(
        null,
    );

    const unidadesVisibles = unidadesCasaCentral.filter(
        (u) => u.lugarDesempeno === lugar,
    );

    return (
        <>
            <Head title="Reporte por Unidad" />

            <div className="animate-fade-in-up space-y-6">
                <Breadcrumbs
                    items={[
                        { label: 'Asistencia', href: '/asistencia/dashboard' },
                        { label: 'Reportes' },
                        { label: 'Por Unidad' },
                    ]}
                />

                <PageHeader
                    title="Reporte por Unidad"
                    description="Consulte las unidades por lugar de desempeño y acceda a sus integrantes"
                    actions={
                        <List className="h-10 w-10 text-muted-foreground/30" />
                    }
                />

                <Card className="border-border/50">
                    <CardContent className="pt-6">
                        <div className="flex flex-wrap items-end gap-3">
                            <div className="w-full sm:w-56">
                                <FormSelect
                                    label="Lugar de Desempeño"
                                    value={lugar}
                                    onValueChange={(value) => {
                                        setLugar(value);
                                        setBuscar(false);
                                    }}
                                    options={lugaresOptions}
                                />
                            </div>
                            <Button
                                variant="default"
                                size="sm"
                                className="gap-2"
                                onClick={() => setBuscar(true)}
                            >
                                <Search className="h-4 w-4" />
                                Buscar
                            </Button>
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
                                Elija un lugar en el filtro y presione Buscar
                                para ver las unidades asociadas.
                            </p>
                        </CardContent>
                    </Card>
                ) : unidadesVisibles.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {unidadesVisibles.map((unidad) => (
                            <UnidadCard
                                key={unidad.id}
                                unidad={unidad}
                                onVerIntegrantes={setUnidadModal}
                            />
                        ))}
                    </div>
                ) : (
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
                                aún no tiene unidades registradas. Por ahora
                                solo Casa Central y DAS cuentan con unidades.
                            </p>
                        </CardContent>
                    </Card>
                )}

                <IntegrantesModal
                    unidad={unidadModal}
                    open={unidadModal !== null}
                    onClose={() => setUnidadModal(null)}
                />
            </div>
        </>
    );
}

PorUnidad.layout = (page: ReactNode) => (
    <AppLayout title="Reporte por Unidad" children={page} />
);

export default PorUnidad;
