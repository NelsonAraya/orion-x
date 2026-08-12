import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { CardSection } from '@/Components/shared/CardSection'
import {
  DollarSign,
  Calendar,
  FileText,
  Eye,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Ingreso {
  id: number
  ot_id: string
  fallecido: string
  servicio: string
  cuota: string
  monto: number
  fecha_ultimo_pago: string
  estado: string
}

interface CuotaData {
  id: number
  numero_cuota: number
  total_cuotas: number
  monto: number
  fecha_vencimiento: string
  fecha_pago: string | null
  estado: string
}

interface ModalDetalleIngresoProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ingreso: Ingreso | null
  onVerOt?: (otId: string) => void
}

const estadoBadge: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pagada: 'default',
  pendiente: 'secondary',
  parcial: 'outline',
  anulada: 'destructive',
}

const estadoLabel: Record<string, string> = {
  pagada: 'Pagada',
  pendiente: 'Pendiente',
  parcial: 'Parcial',
  anulada: 'Anulada',
}

export function ModalDetalleIngreso({ open, onOpenChange, ingreso, onVerOt }: ModalDetalleIngresoProps) {
  const [cuotas, setCuotas] = useState<CuotaData[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && ingreso) {
      setLoading(true)
      fetch(`/cementerio/ot/${ingreso.ot_id}/cuotas`)
        .then((res) => res.json())
        .then((data) => {
          setCuotas(Array.isArray(data) ? data : [])
        })
        .catch(() => {
          setCuotas([])
        })
        .finally(() => setLoading(false))
    }
  }, [open, ingreso])

  if (!ingreso) return null

  const totalCuotas = cuotas.length > 0 ? cuotas[0].total_cuotas : 0
  const valorTotalServicio = cuotas.reduce((sum, c) => sum + c.monto, 0)
  const pagadas = cuotas.filter((c) => c.estado === 'pagada').length
  const pendientes = cuotas.filter((c) => c.estado === 'pendiente' || c.estado === 'parcial').length

  const historial = cuotas.map((c) => ({
    cuota: `${c.numero_cuota}/${c.total_cuotas}`,
    fecha: c.fecha_pago ?? '',
    monto: c.monto,
    estado: c.estado,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <DollarSign className="h-5 w-5 text-primary" />
            Detalle de ingreso
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-lg border bg-card p-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <span className="text-xs text-muted-foreground">N° OT</span>
              <p className="mt-0.5 font-medium">{ingreso.ot_id}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Fallecido</span>
              <p className="mt-0.5 font-medium">{ingreso.fallecido}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Servicio</span>
              <p className="mt-0.5 font-medium">{ingreso.servicio}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Estado</span>
              <div className="mt-0.5">
                <Badge variant={estadoBadge[ingreso.estado] || 'outline'}>
                  {estadoLabel[ingreso.estado] || ingreso.estado}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <CardSection title="Información financiera" icon={DollarSign} iconColor="primary">
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <span className="text-xs text-muted-foreground">Valor total servicio</span>
                <p className="mt-0.5 font-medium">{formatCurrency(valorTotalServicio)}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Cantidad de cuotas</span>
                <p className="mt-0.5 font-medium">{totalCuotas}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Cuotas pagadas</span>
                <p className="mt-0.5 font-medium text-emerald-600">{pagadas}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Cuotas pendientes</span>
                <p className="mt-0.5 font-medium text-amber-600">{pendientes}</p>
              </div>
            </div>
          )}
        </CardSection>

        <CardSection title="Historial de pagos" icon={Calendar} iconColor="secondary">
          {loading ? (
            <p className="text-sm text-muted-foreground">Cargando...</p>
          ) : (
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Cuota</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Fecha</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Monto</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {historial.map((pago, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-3 py-2">{pago.cuota}</td>
                      <td className="px-3 py-2">{pago.fecha || '—'}</td>
                      <td className="px-3 py-2">{formatCurrency(pago.monto)}</td>
                      <td className="px-3 py-2">
                        <Badge
                          variant={estadoBadge[pago.estado] || 'secondary'}
                        >
                          {estadoLabel[pago.estado] || pago.estado}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardSection>

        <div className="flex items-center justify-end gap-2 border-t pt-4">
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              onOpenChange(false)
              setTimeout(() => onVerOt?.(ingreso.ot_id), 300)
            }}
          >
            <Eye className="h-3.5 w-3.5" />
            Ver OT
          </Button>
          <Button variant="outline" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Ver factura
          </Button>
          <Button
            className="gap-1.5"
            onClick={() =>
              window.open(`/cementerio/cuotas/${ingreso.id}/comprobante`, '_blank')
            }
          >
            <FileText className="h-3.5 w-3.5" />
            Ver comprobante de ingreso
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
