import { Button } from '@/Components/ui/button';
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
import { funcionariosUnidad } from '@/lib/asistenciaMockData';
import type { UnidadAsistencia } from '@/types/asistencia';
import { Link } from '@inertiajs/react';
import { CalendarDays, CalendarRange, Users } from 'lucide-react';

interface IntegrantesModalProps {
    unidad: UnidadAsistencia | null;
    open: boolean;
    onClose: () => void;
}

export function IntegrantesModal({
    unidad,
    open,
    onClose,
}: IntegrantesModalProps) {
    const integrantes = unidad
        ? funcionariosUnidad.filter((f) => f.unidad === unidad.nombre)
        : [];

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Integrantes de {unidad?.nombre ?? ''}
                    </DialogTitle>
                    <DialogDescription>
                        {integrantes.length} funcionarios asignados a la unidad
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="whitespace-nowrap">
                                    RUT
                                </TableHead>
                                <TableHead className="whitespace-nowrap">
                                    Nombre
                                </TableHead>
                                <TableHead className="whitespace-nowrap">
                                    Cargo
                                </TableHead>
                                <TableHead className="whitespace-nowrap text-right">
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {integrantes.map((funcionario) => (
                                <TableRow
                                    key={funcionario.id}
                                    className="transition-colors hover:bg-muted/50"
                                >
                                    <TableCell className="whitespace-nowrap font-medium text-foreground">
                                        {funcionario.rut}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                                                {funcionario.iniciales}
                                            </div>
                                            <span className="text-foreground">
                                                {funcionario.nombre}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-muted-foreground">
                                        {funcionario.cargo}
                                    </TableCell>
                                    <TableCell className="whitespace-nowrap text-right">
                                        <div className="flex flex-wrap justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-36 gap-1.5 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                                                asChild
                                            >
                                                <Link
                                                    href={`/asistencia/reportes/por-unidad/diario?unidad=${unidad?.id}`}
                                                >
                                                    <CalendarDays className="h-3.5 w-3.5" />
                                                    Reporte Diario
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-36 gap-1.5 border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800"
                                                asChild
                                            >
                                                <Link
                                                    href={`/asistencia/reportes/por-unidad/mensual?unidad=${unidad?.id}`}
                                                >
                                                    <CalendarRange className="h-3.5 w-3.5" />
                                                    Reporte Mensual
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter className="sm:justify-end">
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
