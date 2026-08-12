import { Badge } from '@/Components/ui/badge';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/Components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { generarMiniCartola } from '@/lib/asistenciaMockData';
import { cn } from '@/lib/utils';
import type {
    DetalleMensualFuncionario,
    FuncionarioUnidad,
} from '@/types/asistencia';
import { AlarmClock, Building2, Clock, TrendingUp, Zap } from 'lucide-react';

interface VerAsistenciaModalProps {
    funcionario: FuncionarioUnidad | null;
    detalle?: DetalleMensualFuncionario;
    open: boolean;
    onClose: () => void;
}

const estadoBadge: Record<string, string> = {
    Presente: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    Atraso: 'border-amber-200 bg-amber-50 text-amber-700',
    'Horas Extra': 'border-blue-200 bg-blue-50 text-blue-700',
    Permiso: 'border-purple-200 bg-purple-50 text-purple-700',
    Licencia: 'border-red-200 bg-red-50 text-red-700',
};

export function VerAsistenciaModal({
    funcionario,
    detalle,
    open,
    onClose,
}: VerAsistenciaModalProps) {
    if (!funcionario) return null;

    const miniCartola = generarMiniCartola(funcionario.id);

    const indicadores = [
        {
            label: 'Horas Trabajadas',
            valor: detalle ? `${detalle.horasTrabajadas}h` : '—',
            icono: Clock,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
        },
        {
            label: 'Horas Extra',
            valor: detalle ? detalle.horasExtra : '—',
            icono: Zap,
            color: 'text-amber-500',
            bg: 'bg-amber-50',
        },
        {
            label: 'Atrasos',
            valor: detalle ? `${detalle.atrasosMin} min` : '—',
            icono: AlarmClock,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
        },
        {
            label: 'Cumplimiento',
            valor: detalle ? `${detalle.cumplimiento.toFixed(1)}%` : '—',
            icono: TrendingUp,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
        },
    ];

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Reporte por Funcionario
                    </DialogTitle>
                    <DialogDescription>
                        Vista simulada del reporte individual de asistencia
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                        {funcionario.iniciales}
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-foreground">
                                {funcionario.nombre}
                            </h3>
                            <Badge
                                variant="outline"
                                className="border-emerald-200 bg-emerald-50 text-xs text-emerald-700"
                            >
                                Activo
                            </Badge>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            RUT {funcionario.rut} · {funcionario.cargo}
                        </p>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <Building2 className="h-3.5 w-3.5" />
                            {funcionario.unidad} · {funcionario.lugarDesempeno}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {indicadores.map((item, index) => (
                        <div
                            key={index}
                            className="rounded-lg border border-border/50 bg-muted/30 p-3"
                        >
                            <div
                                className={cn(
                                    'mb-2 flex h-8 w-8 items-center justify-center rounded-lg',
                                    item.bg,
                                )}
                            >
                                <item.icono
                                    className={cn('h-4 w-4', item.color)}
                                />
                            </div>
                            <p className="text-base font-bold text-foreground">
                                {item.valor}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {item.label}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="overflow-hidden rounded-lg border border-border/50">
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
                                    Estado
                                </TableHead>
                                <TableHead className="whitespace-nowrap">
                                    Observación
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {miniCartola.map((registro, index) => (
                                <TableRow key={index}>
                                    <TableCell className="whitespace-nowrap font-medium text-foreground">
                                        {registro.fecha}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap capitalize">
                                        {registro.dia}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {registro.entrada ?? '—'}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {registro.salida ?? '—'}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                'border text-xs',
                                                estadoBadge[registro.estado] ??
                                                    'border-slate-200 bg-slate-100 text-slate-500',
                                            )}
                                        >
                                            {registro.estado}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-muted-foreground">
                                        {registro.observacion}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter className="sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                        Vista de simulación · La navegación real se integrará
                        con el Reporte por Funcionario
                    </p>
                    <DialogClose asChild>
                        <button className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
                            Cerrar
                        </button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
