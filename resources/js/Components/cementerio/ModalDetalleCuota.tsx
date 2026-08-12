import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog'
import { Badge } from '@/Components/ui/badge'
import { CardSection } from '@/Components/shared/CardSection'
import {
  CalendarClock,
  Calendar,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { mockDetalleCuotas } from '@/lib/mockData'

interface CuotaVencer {
  id: number
  fallecido: string
  ot_id: string
  servicio: string
  cuota: string
  fecha_vencimiento: string
  dias_restantes: number
  estado: string
}

interface ModalDetalleCuotaProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cuota: CuotaVencer | null
}

export function ModalDetalleCuota({ open, onOpenChange, cuota }: ModalDetalleCuotaProps) {
  if (!cuota) return null

  const detalle = mockDetalleCuotas[cuota.id]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarClock className="h-5 w-5 text-primary" />
            Detalle de cuota
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-lg border bg-card p-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <span className="text-xs text-muted-foreground">Fallecido</span>
              <p className="mt-0.5 font-medium">{detalle.fallecido}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">N° OT</span>
              <p className="mt-0.5 font-medium">{detalle.ot_id}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Tipo servicio</span>
              <p className="mt-0.5 font-medium">{detalle.tipo_servicio}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Fecha inicio contrato</span>
              <p className="mt-0.5 font-medium">{detalle.fecha_inicio_contrato}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Cantidad de cuotas</span>
              <p className="mt-0.5 font-medium">{detalle.cantidad_cuotas}</p>
            </div>
          </div>
        </div>

        <CardSection title="Próximas cuotas" icon={CalendarClock} iconColor="primary">
          <div className="space-y-2">
            {detalle.proximas.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cuota {p.cuota}</p>
                    <p className="text-xs text-muted-foreground">Vence: {p.fecha_vencimiento}</p>
                  </div>
                </div>
                <p className="text-sm font-medium">{formatCurrency(p.monto)}</p>
              </div>
            ))}
          </div>
        </CardSection>

        <CardSection title="Historial de pagos" icon={Calendar} iconColor="secondary">
          <div className="space-y-2">
            {detalle.historial.map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full',
                      h.estado === 'Pagada' ? 'bg-emerald-50' : 'bg-muted'
                    )}
                  >
                    {h.estado === 'Pagada' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">Cuota {h.cuota}</p>
                    <p className="text-xs text-muted-foreground">
                      {h.estado === 'Pagada' ? 'Pagada - ' + h.fecha : 'Pendiente'}
                    </p>
                  </div>
                </div>
                <Badge variant={h.estado === 'Pagada' ? 'default' : 'secondary'}>
                  {h.estado}
                </Badge>
              </div>
            ))}
          </div>
        </CardSection>
      </DialogContent>
    </Dialog>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ')
}
