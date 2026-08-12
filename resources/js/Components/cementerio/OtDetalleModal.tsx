import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/Components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Badge } from '@/Components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'
import { CardSection } from '@/Components/shared/CardSection'
import { Button } from '@/Components/ui/button'
import { useToastContext } from '@/Components/ToastProvider'
import {
  Phone,
  User,
  Building2,
  MapPin,
  DollarSign,
  Loader,
  FileText,
  CalendarClock,
  CheckCircle2,
  Clock,
  Printer,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Swal from 'sweetalert2'
import { PagarCuotaModal } from './PagarCuotaModal'

interface OtDetalleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  otNumber: string
  canManage?: boolean
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('T')[0].split('-')
  return `${d}-${m}-${y}`
}

export function OtDetalleModal({ open, onOpenChange, otNumber, canManage = true }: OtDetalleModalProps) {
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [cuotas, setCuotas] = useState<any[] | null>(null)
  const [cuotasLoading, setCuotasLoading] = useState(false)
  const [pagarCuota, setPagarCuota] = useState<any | null>(null)
  const [formasPago, setFormasPago] = useState<{ id: number; nombre: string }[]>([])
  const [tab, setTab] = useState('detalle')
  const { addToast } = useToastContext()

  useEffect(() => {
    if (!open || !otNumber) return
    setTab('detalle')
    setLoading(true)
    setCuotas(null)
    fetch(`/cementerio/ot/${otNumber}/detalle`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
    fetch(`/cementerio/formas-pago`)
      .then((res) => res.json())
      .then(setFormasPago)
      .catch(() => setFormasPago([]))
  }, [open, otNumber])

  useEffect(() => {
    if (!open || !otNumber || tab !== 'pagos' || cuotas !== null) return
    setCuotasLoading(true)
    fetch(`/cementerio/ot/${otNumber}/cuotas`)
      .then((res) => res.json())
      .then(setCuotas)
      .catch(() => setCuotas([]))
      .finally(() => setCuotasLoading(false))
  }, [open, otNumber, tab, cuotas])

  const handlePagoExitoso = (updatedCuota: any) => {
    setCuotas((prev) => {
      if (!prev) return prev
      return prev.map((c) => (c.id === updatedCuota.id ? updatedCuota : c))
    })
    addToast({ title: 'Cuota pagada', description: `Cuota ${updatedCuota.numero_cuota}/${updatedCuota.total_cuotas} registrada como pagada.`, variant: 'default' })

    if (updatedCuota.ot_finalizada) {
      setPagarCuota(null)
      onOpenChange(false)
      Swal.fire({
        icon: 'success',
        title: 'OT Finalizada',
        text: `Todas las cuotas de la OT N°${updatedCuota.numero_ot} han sido pagadas!`,
        showCloseButton: true,
        allowOutsideClick: true,
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#2563eb',
        customClass: { container: 'swal-high-z' },
      })
    }
  }

  const estadoBadge: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    Ingresada: 'default',
    Finalizada: 'outline',
    Anulada: 'destructive',
  }

  const cuotaEstadoBadge: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    pendiente: 'default',
    parcial: 'secondary',
    pagada: 'outline',
    anulada: 'destructive',
  }

  const pendientes = cuotas?.filter((c) => c.estado === 'pendiente' || c.estado === 'parcial') ?? []
  const pagadas = cuotas?.filter((c) => c.estado === 'pagada') ?? []
  const tieneCuotas = cuotas !== null && cuotas.length > 0
  const tipoServicio = data?.tipo_financiamiento?.nombre ?? '—'
  const serviciosStr = data?.servicios?.map((s: any) => s.nombre).join(', ') ?? '—'
  const fallecidoNombre = data?.fallecido?.nombre_completo ?? '—'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Orden de Trabajo {otNumber}
          </DialogTitle>
          <DialogDescription>
            Detalle completo de la orden de trabajo.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && !data && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No se pudieron cargar los datos de la OT.
          </p>
        )}

        {!loading && data && (
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="detalle">Detalle OT</TabsTrigger>
              {canManage && <TabsTrigger value="pagos">Pagos Cuota</TabsTrigger>}
            </TabsList>

            <TabsContent value="detalle" className="space-y-5 mt-4">
              <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
                <span className="text-sm font-medium">Estado</span>
                <div className="flex items-center gap-2">
                  <Badge variant={estadoBadge[data.estado?.nombre] ?? 'outline'} className="text-xs">
                    {data.estado?.nombre ?? '—'}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!canManage}
                    onClick={() => window.open(`/cementerio/ot/${otNumber}/imprimir`, '_blank')}
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                  <User className="h-4 w-4" />
                  Datos del Fallecido
                </div>
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">RUT:</span>
                    <p className="font-medium">{data.fallecido?.rut_fallecido ?? data.fallecido?.codigo_nn ?? '—'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nombre:</span>
                    <p className="font-medium">{data.fallecido?.nombre_completo}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sexo:</span>
                    <p className="font-medium capitalize">{data.fallecido?.sexo?.nombre ?? '—'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fecha de Fallecimiento:</span>
                    <p className="font-medium">
                      {data.fallecido?.fecha_fallecimiento ? formatDate(data.fallecido.fecha_fallecimiento) : '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                  <Building2 className="h-4 w-4" />
                  Responsable Financiero
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">RUT:</span>
                    <p className="font-medium">{data.deudor?.rut}-{data.deudor?.dv}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nombre:</span>
                    <p className="font-medium">{data.deudor?.nombre_completo_deudor}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Dirección:</span>
                    <p className="font-medium">{data.deudor?.direccion_deudor}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Teléfono:</span>
                    <p className="font-medium">{data.deudor?.telefono_deudor}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Correo:</span>
                    <p className="font-medium">{data.deudor?.correo_electronico_deudor}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Relación:</span>
                    <p className="font-medium">{data.relacion?.nombre_relacion}</p>
                  </div>
                </div>
              </div>

              {(data.deudor?.contacto?.nombre_contacto1 || data.deudor?.contacto?.telefono_contacto1 || data.deudor?.contacto?.correo_contacto1 || data.deudor?.contacto?.nombre_contacto2 || data.deudor?.contacto?.telefono_contacto2 || data.deudor?.contacto?.correo_contacto2) && (
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                    <Phone className="h-4 w-4" />
                    Contactos
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nombre:</span>
                      <p className="font-medium">{data.deudor?.contacto?.nombre_contacto1 ?? '—'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Teléfono:</span>
                      <p className="font-medium">{data.deudor?.contacto?.telefono_contacto1 ?? '—'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Correo:</span>
                      <p className="font-medium">{data.deudor?.contacto?.correo_contacto1 ?? '—'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Nombre:</span>
                      <p className="font-medium">{data.deudor?.contacto?.nombre_contacto2 ?? '—'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Teléfono:</span>
                      <p className="font-medium">{data.deudor?.contacto?.telefono_contacto2 ?? '—'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Correo:</span>
                      <p className="font-medium">{data.deudor?.contacto?.correo_contacto2 ?? '—'}</p>
                    </div>
                  </div>
                </div>
              )}

              {data.ubicacion && (
                <div className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                    <MapPin className="h-4 w-4" />
                    Ubicación
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Sector:</span>
                      <p className="font-medium">{data.ubicacion?.sector?.nombre}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tipo:</span>
                      <p className="font-medium">{data.ubicacion?.tipo_ubicacion?.nombre}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Patio:</span>
                      <p className="font-medium">{data.ubicacion?.patio}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Código:</span>
                      <p className="font-medium">{data.ubicacion?.codigo}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-lg border p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                  <DollarSign className="h-4 w-4" />
                  Información Financiera
                </div>

                <div className="mb-4">
                  <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Servicio</TableHead>
                          <TableHead className="text-right">Cant.</TableHead>
                          <TableHead className="text-right">Valor Unitario</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                    <TableBody>
                      {data.tipo_financiamiento && (
                        <TableRow>
                          <TableCell className="font-medium">{data.tipo_financiamiento.nombre}</TableCell>
                          <TableCell className="text-right">—</TableCell>
                          <TableCell className="text-right">{formatCurrency(data.tipo_financiamiento.valor_arriendo)}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(data.tipo_financiamiento.valor_arriendo)}
                          </TableCell>
                        </TableRow>
                      )}
                      {data.servicios?.map((s: any) => (
                        <TableRow key={s.id}>
                          <TableCell>{s.nombre}</TableCell>
                          <TableCell className="text-right">{s.pivot.cantidad}</TableCell>
                          <TableCell className="text-right">{formatCurrency(s.pivot.valor_unitario)}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(s.pivot.cantidad * s.pivot.valor_unitario)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="border-b mb-3" />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Forma de Pago:</span>
                    <p className="font-medium">{data.forma_pago?.nombre}</p>
                  </div>
                  {data.numero_cuotas && (
                    <div>
                      <span className="text-muted-foreground">N° Cuotas:</span>
                      <p className="font-medium">{data.numero_cuotas}</p>
                    </div>
                  )}
                </div>
                <div className="ml-auto mt-3 w-full max-w-xs space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(data.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IVA (19%)</span>
                    <span>{formatCurrency(data.iva)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-1.5 text-base font-semibold">
                    <span>Total General</span>
                    <span className="text-primary">{formatCurrency(data.total)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="pagos" className="space-y-5 mt-4">
              {cuotasLoading && (
                <div className="flex items-center justify-center py-12">
                  <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              )}

              {!cuotasLoading && !tieneCuotas && (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  Esta orden de trabajo no tiene cuotas asociadas.
                </p>
              )}

              {!cuotasLoading && tieneCuotas && (
                <>
                  <div className="rounded-lg border bg-card p-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <div className="md:col-span-2">
                        <span className="text-xs text-muted-foreground">Fallecido</span>
                        <p className="mt-0.5 font-medium">{fallecidoNombre}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">N° OT</span>
                        <p className="mt-0.5 font-medium">{otNumber}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Tipo servicio</span>
                        <p className="mt-0.5 font-medium">{tipoServicio}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Servicios</span>
                        <p className="mt-0.5 font-medium">{serviciosStr}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Cantidad de cuotas</span>
                        <p className="mt-0.5 font-medium">{cuotas.length}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Total</span>
                        <p className="mt-0.5 font-medium">{formatCurrency(data?.total ?? 0)}</p>
                      </div>
                    </div>
                  </div>

                  <CardSection title="Cuotas pendientes" icon={CalendarClock} iconColor="primary">
                    {pendientes.length === 0 ? (
                      <p className="py-3 text-sm text-muted-foreground">
                        No hay cuotas pendientes.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {pendientes.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                <Clock className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Cuota {c.numero_cuota}/{c.total_cuotas}</p>
                                <p className="text-xs text-muted-foreground">Vence: {c.fecha_vencimiento}</p>
                                {c.estado === 'parcial' && (
                                  <p className="text-xs text-amber-600">Pagado: {formatCurrency(c.monto_pagado)} / {formatCurrency(c.monto)}</p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{formatCurrency(c.monto)}</p>
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => setPagarCuota(c)}
                              >
                                Pagar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardSection>

                  <CardSection title="Historial de pagos" icon={CalendarClock} iconColor="secondary">
                    {pagadas.length === 0 ? (
                      <p className="py-3 text-sm text-muted-foreground">
                        No hay pagos registrados.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {pagadas.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Cuota {c.numero_cuota}/{c.total_cuotas}</p>
                                <p className="text-xs text-muted-foreground">
                                  Pagada - {c.fecha_pago}{c.metodo_pago ? ` (${c.metodo_pago.nombre})` : ''}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge variant="outline">Pagada</Badge>
                              {canManage && (
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7"
                                onClick={() => window.open(`/cementerio/cuotas/${c.id}/comprobante`, '_blank')}
                              >
                                <Printer className="h-3.5 w-3.5" />
                              </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardSection>
                </>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>

      <PagarCuotaModal
        open={pagarCuota !== null}
        onOpenChange={(o) => { if (!o) setPagarCuota(null) }}
        cuota={pagarCuota}
        formasPago={formasPago}
        onPagoExitoso={handlePagoExitoso}
      />
    </Dialog>
  )
}
