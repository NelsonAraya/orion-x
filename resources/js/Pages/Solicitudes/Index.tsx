import { useState, type ReactNode } from 'react'
import { Head, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/Components/ui/dialog'
import { Label } from '@/Components/ui/label'
import { ConfirmDialog } from '@/Components/ConfirmDialog'
import { useToastContext } from '@/Components/ToastProvider'
import { ClipboardList, Calendar, CheckCircle, XCircle } from 'lucide-react'

interface PermisoItem {
  id: number
  solicitud: string
  empleado: string
  tipo: string
  detalle: string
  motivo: string
  created_at: string
}

interface VacacionItem {
  id: number
  solicitud: string
  empleado: string
  fecha_inicio: string
  fecha_termino: string
  dias: number
  motivo: string
  created_at: string
}

export default function SolicitudesIndex({
  pendientes_permisos,
  pendientes_vacaciones,
}: {
  pendientes_permisos: PermisoItem[]
  pendientes_vacaciones: VacacionItem[]
}) {
  const { addToast } = useToastContext()

  const [aceptarPermisoId, setAceptarPermisoId] = useState<number | null>(null)
  const [aceptarVacacionId, setAceptarVacacionId] = useState<number | null>(null)

  const [rechazoDialog, setRechazoDialog] = useState<{
    open: boolean
    type: 'permiso' | 'vacacion'
    id: number
    observacion: string
  }>({ open: false, type: 'permiso', id: 0, observacion: '' })

  const handleAceptarPermiso = () => {
    if (!aceptarPermisoId) return
    const id = aceptarPermisoId
    setAceptarPermisoId(null)
    router.patch(route('solicitudes.permisos.aceptar', id), {}, {
      preserveScroll: true,
      onSuccess: () => addToast({ title: 'Aceptado', description: 'Permiso aceptado correctamente.' }),
    })
  }

  const handleAceptarVacacion = () => {
    if (!aceptarVacacionId) return
    const id = aceptarVacacionId
    setAceptarVacacionId(null)
    router.patch(route('solicitudes.vacaciones.aceptar', id), {}, {
      preserveScroll: true,
      onSuccess: () => addToast({ title: 'Aceptada', description: 'Vacaciones aceptadas correctamente.' }),
    })
  }

  const handleRechazar = () => {
    const { type, id, observacion } = rechazoDialog
    if (observacion.trim().length < 5) return

    setRechazoDialog({ ...rechazoDialog, open: false })

    if (type === 'permiso') {
      router.patch(route('solicitudes.permisos.rechazar', id), {
        observacion_rechazo: observacion,
      }, {
        preserveScroll: true,
        onSuccess: () => addToast({ title: 'Rechazado', description: 'Permiso rechazado correctamente.' }),
        onError: () => setRechazoDialog(prev => ({ ...prev, open: true })),
      })
    } else {
      router.patch(route('solicitudes.vacaciones.rechazar', id), {
        observacion_rechazo: observacion,
      }, {
        preserveScroll: true,
        onSuccess: () => addToast({ title: 'Rechazada', description: 'Vacaciones rechazadas correctamente.' }),
        onError: () => setRechazoDialog(prev => ({ ...prev, open: true })),
      })
    }
  }

  return (
    <>
      <Head title="Solicitudes" />

      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            <ClipboardList className="h-6 w-6 text-primary" />
            Solicitudes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Revisa y gestiona las solicitudes pendientes de permisos y vacaciones.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Permisos Pendientes</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {pendientes_permisos.length} solicitude(s) por revisar.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {pendientes_permisos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle className="h-10 w-10 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">No hay permisos pendientes.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Solicitud</TableHead>
                      <TableHead>Funcionario</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Detalle</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead className="text-center">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendientes_permisos.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.solicitud}</TableCell>
                        <TableCell>{p.empleado}</TableCell>
                        <TableCell>{p.tipo}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.detalle}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={p.motivo}>{p.motivo}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
                              onClick={() => setAceptarPermisoId(p.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aceptar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                              onClick={() => setRechazoDialog({ open: true, type: 'permiso', id: p.id, observacion: '' })}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                <Calendar className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <CardTitle className="text-base">Vacaciones Pendientes</CardTitle>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {pendientes_vacaciones.length} solicitude(s) por revisar.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {pendientes_vacaciones.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Calendar className="h-10 w-10 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">No hay vacaciones pendientes.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Solicitud</TableHead>
                      <TableHead>Funcionario</TableHead>
                      <TableHead>Fechas</TableHead>
                      <TableHead className="text-center">Días</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead className="text-center">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendientes_vacaciones.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">{v.solicitud}</TableCell>
                        <TableCell>{v.empleado}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{v.fecha_inicio} → {v.fecha_termino}</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {v.dias}
                          </span>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate" title={v.motivo}>{v.motivo}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-300 hover:bg-green-50 hover:text-green-700"
                              onClick={() => setAceptarVacacionId(v.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Aceptar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                              onClick={() => setRechazoDialog({ open: true, type: 'vacacion', id: v.id, observacion: '' })}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Rechazar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={aceptarPermisoId !== null}
        title="¿Aceptar permiso?"
        message="El permiso será marcado como aceptado y se notificará al empleado."
        confirmText="Sí, aceptar"
        cancelText="Cancelar"
        confirmColor="#16a34a"
        icon={<CheckCircle className="h-6 w-6 text-green-600" />}
        onConfirm={handleAceptarPermiso}
        onCancel={() => setAceptarPermisoId(null)}
      />

      <ConfirmDialog
        open={aceptarVacacionId !== null}
        title="¿Aceptar vacaciones?"
        message="La solicitud será marcada como aceptada y se notificará al empleado."
        confirmText="Sí, aceptar"
        cancelText="Cancelar"
        confirmColor="#16a34a"
        icon={<CheckCircle className="h-6 w-6 text-green-600" />}
        onConfirm={handleAceptarVacacion}
        onCancel={() => setAceptarVacacionId(null)}
      />

      <Dialog open={rechazoDialog.open} onOpenChange={(open) => setRechazoDialog({ ...rechazoDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rechazar {rechazoDialog.type === 'permiso' ? 'Permiso' : 'Solicitud de Vacaciones'}</DialogTitle>
            <DialogDescription>Indica el motivo del rechazo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="rechazo_observacion">
                Observación <span className="text-destructive">*</span>
              </Label>
              <textarea
                id="rechazo_observacion"
                placeholder="Describe el motivo del rechazo"
                value={rechazoDialog.observacion}
                onChange={(e) => setRechazoDialog({ ...rechazoDialog, observacion: e.target.value })}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              {rechazoDialog.observacion.trim().length > 0 && rechazoDialog.observacion.trim().length < 5 && (
                <p className="text-xs text-destructive">Debe tener al menos 5 caracteres.</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setRechazoDialog({ ...rechazoDialog, open: false })}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={rechazoDialog.observacion.trim().length < 5}
              onClick={handleRechazar}
            >
              Rechazar {rechazoDialog.type === 'permiso' ? 'Permiso' : 'Solicitud'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

SolicitudesIndex.layout = (page: ReactNode) => <AppLayout title="Solicitudes" children={page} />
