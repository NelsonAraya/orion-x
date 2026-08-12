import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/Components/ui/dialog'
import { Badge } from '@/Components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'
import { User, FileText, Building2, Wrench, MapPin, DollarSign, Paperclip } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ModalOTProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  otId: string
}

interface OtShape {
  id: string
  estado: string
  fallecido: { nombre: string; rut: string; fecha_fallecimiento: string }
  solicitante: { nombre: string; rut: string; direccion: string; telefono: string; email: string; relacion: string }
  responsable_financiero: { tipo: string; rut: string; nombre: string; direccion: string; telefono: string; correo: string }
  servicios: { servicio: string; cantidad: number; valor_unitario: number }[]
  ubicacion: { sector: string; patio: string; tipo: string; codigo: string }
  financiero: { subtotal: number; descuento: number; iva: number; total: number }
  documentos: { nombre: string; fecha: string }[]
}

const estadoBadge: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Ingresada: 'default',
  Finalizada: 'outline',
  Anulada: 'destructive',
}

function mapOtData(raw: any): OtShape {
  const f = raw.fallecido ?? {}
  const d = raw.deudor ?? {}
  const r = raw.relacion ?? {}
  const u = raw.ubicacion ?? {}
  const s = raw.servicios ?? []

  return {
    id: raw.numero_ot ?? '—',
    estado: raw.estado?.nombre ?? 'Ingresada',
    fallecido: {
      nombre: f.nombre_completo ?? '—',
      rut: f.rut_fallecido ?? '—',
      fecha_fallecimiento: f.fecha_fallecimiento ?? '—',
    },
    solicitante: {
      nombre: d.nombre_completo_deudor ?? '—',
      rut: d.dv ? `${d.rut}-${d.dv}` : (d.rut?.toString() ?? '—'),
      direccion: d.direccion_deudor ?? '—',
      telefono: d.telefono_deudor ?? '—',
      email: d.correo_electronico_deudor ?? '—',
      relacion: r.nombre ?? '—',
    },
    responsable_financiero: {
      tipo: 'Particular',
      rut: d.dv ? `${d.rut}-${d.dv}` : (d.rut?.toString() ?? '—'),
      nombre: d.nombre_completo_deudor ?? '—',
      direccion: d.direccion_deudor ?? '—',
      telefono: d.telefono_deudor ?? '—',
      correo: d.correo_electronico_deudor ?? '—',
    },
    servicios: s.map((sv: any) => ({
      servicio: sv.nombre ?? '—',
      cantidad: sv.pivot?.cantidad ?? 1,
      valor_unitario: sv.pivot?.valor_unitario ?? 0,
    })),
    ubicacion: {
      sector: u.sector?.nombre ?? '—',
      patio: u.patio ?? '—',
      tipo: u.tipo_ubicacion?.nombre ?? '—',
      codigo: u.codigo ?? '—',
    },
    financiero: {
      subtotal: raw.subtotal ?? 0,
      descuento: 0,
      iva: raw.iva ?? 0,
      total: raw.total ?? 0,
    },
    documentos: [],
  }
}

export function ModalOT({ open, onOpenChange, otId }: ModalOTProps) {
  const [ot, setOt] = useState<OtShape | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (open && otId) {
      setLoading(true)
      setError(false)
      fetch(`/cementerio/ot/${otId}/detalle`)
        .then((res) => {
          if (!res.ok) throw new Error('Not found')
          return res.json()
        })
        .then((data) => setOt(mapOtData(data)))
        .catch(() => setError(true))
        .finally(() => setLoading(false))
    }
  }, [open, otId])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Orden de Trabajo {otId}
          </DialogTitle>
          <DialogDescription>
            Detalle completo de la orden de trabajo.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <p className="py-8 text-center text-sm text-muted-foreground">Cargando...</p>
        )}

        {error && (
          <p className="py-8 text-center text-sm text-destructive">
            No se pudo cargar la orden de trabajo.
          </p>
        )}

        {!loading && !error && ot && (
          <div className="space-y-5">
            {/* Estado */}
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
              <span className="text-sm font-medium">Estado</span>
              <Badge variant={estadoBadge[ot.estado] ?? 'outline'} className="text-xs">
                {ot.estado}
              </Badge>
            </div>

            {/* Datos del Fallecido */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                <User className="h-4 w-4" />
                Datos del Fallecido
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Nombre:</span>
                  <p className="font-medium">{ot.fallecido.nombre}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">RUT:</span>
                  <p className="font-medium">{ot.fallecido.rut}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">F. Fallecimiento:</span>
                  <p className="font-medium">{ot.fallecido.fecha_fallecimiento}</p>
                </div>
              </div>
            </div>

            {/* Datos del Solicitante */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                <User className="h-4 w-4" />
                Datos del Solicitante
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Nombre:</span>
                  <p className="font-medium">{ot.solicitante.nombre}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">RUT:</span>
                  <p className="font-medium">{ot.solicitante.rut}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Direcci�n:</span>
                  <p className="font-medium">{ot.solicitante.direccion}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tel�fono:</span>
                  <p className="font-medium">{ot.solicitante.telefono}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{ot.solicitante.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Relaci�n:</span>
                  <p className="font-medium">{ot.solicitante.relacion}</p>
                </div>
              </div>
            </div>

            {/* Datos del Responsable Financiero */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                <Building2 className="h-4 w-4" />
                Responsable Financiero
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Tipo:</span>
                  <p className="font-medium">{ot.responsable_financiero.tipo}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">RUT:</span>
                  <p className="font-medium">{ot.responsable_financiero.rut}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nombre/Raz�n Social:</span>
                  <p className="font-medium">{ot.responsable_financiero.nombre}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Direcci�n:</span>
                  <p className="font-medium">{ot.responsable_financiero.direccion}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tel�fono:</span>
                  <p className="font-medium">{ot.responsable_financiero.telefono}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Correo:</span>
                  <p className="font-medium">{ot.responsable_financiero.correo}</p>
                </div>
              </div>
            </div>

            {/* Servicios Realizados */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                <Wrench className="h-4 w-4" />
                Servicios Realizados
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead className="text-right">Cantidad</TableHead>
                    <TableHead className="text-right">Valor Unitario</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ot.servicios.map((s, i) => (
                    <TableRow key={i}>
                      <TableCell>{s.servicio}</TableCell>
                      <TableCell className="text-right">{s.cantidad}</TableCell>
                      <TableCell className="text-right">{formatCurrency(s.valor_unitario)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(s.cantidad * s.valor_unitario)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Ubicaci�n */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                <MapPin className="h-4 w-4" />
                Ubicaci�n
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Sector:</span>
                  <p className="font-medium">{ot.ubicacion.sector}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Patio:</span>
                  <p className="font-medium">{ot.ubicacion.patio}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tipo:</span>
                  <p className="font-medium">{ot.ubicacion.tipo}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">C�digo:</span>
                  <p className="font-medium">{ot.ubicacion.codigo}</p>
                </div>
              </div>
            </div>

            {/* Informaci�n Financiera */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                <DollarSign className="h-4 w-4" />
                Informaci�n Financiera
              </div>
              <div className="ml-auto w-full max-w-xs space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(ot.financiero.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Descuento</span>
                  <span>{formatCurrency(ot.financiero.descuento)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">IVA (19%)</span>
                  <span>{formatCurrency(ot.financiero.iva)}</span>
                </div>
                <div className="flex justify-between border-t pt-1.5 text-base font-semibold">
                  <span>Total General</span>
                  <span className="text-primary">{formatCurrency(ot.financiero.total)}</span>
                </div>
              </div>
            </div>

            {/* Documentos Asociados */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                <Paperclip className="h-4 w-4" />
                Documentos Asociados
              </div>
              {ot.documentos.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay documentos asociados.</p>
              ) : (
                <div className="space-y-2">
                  {ot.documentos.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-md border bg-muted/20 px-3 py-2 text-sm"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="flex-1 font-medium">{doc.nombre}</span>
                      <span className="text-xs text-muted-foreground">{doc.fecha}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
