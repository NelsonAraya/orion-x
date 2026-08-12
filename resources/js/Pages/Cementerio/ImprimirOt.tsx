import { useEffect, type ReactNode } from 'react'
import { Head, usePage } from '@inertiajs/react'
import { Badge } from '@/Components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'
import { User, Building2, MapPin, DollarSign, FileText, Phone } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const estadoBadge: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pendiente: 'default',
  'en proceso': 'secondary',
  en_proceso: 'secondary',
  finalizada: 'outline',
  anulada: 'destructive',
}

export default function ImprimirOt() {
  const { ot } = usePage().props as any
  const data = ot

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print()
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <Head title={`OT ${data?.numero_ot ?? ''}`} />

      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-4 flex items-center gap-3 border-b pb-3">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Orden de Trabajo {data?.numero_ot}</h1>
            {/* <Badge variant={estadoBadge[data?.estado?.toLowerCase()] ?? 'outline'} className="mt-1 text-sm">
              {data?.estado}
            </Badge> */}
          </div>
        </div>

        <div className="mb-4 rounded-lg border p-5">
          <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-primary">
            <User className="h-5 w-5" />
            Datos del Fallecido
          </div>
          <div className="grid grid-cols-4 gap-x-6 gap-y-2 text-base">
            <div>
              <span className="text-muted-foreground">RUT:</span>
              <p className="font-medium">{data?.fallecido?.rut_fallecido ?? data?.fallecido?.codigo_nn ?? '—'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Nombre:</span>
              <p className="font-medium">{data?.fallecido?.nombre_completo}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Sexo:</span>
              <p className="font-medium capitalize">{data?.fallecido?.sexo?.nombre ?? '—'}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Fecha de Fallecimiento:</span>
              <p className="font-medium">
                {data?.fallecido?.fecha_fallecimiento
                  ? (() => { const [y, m, d] = data.fallecido.fecha_fallecimiento.split('T')[0].split('-'); return `${d}-${m}-${y}` })()
                  : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4 rounded-lg border p-5">
          <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-secondary">
            <Building2 className="h-5 w-5" />
            Responsable Financiero
          </div>
          <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-base">
            <div>
              <span className="text-muted-foreground">RUT:</span>
              <p className="font-medium">{data?.deudor?.rut}-{data?.deudor?.dv}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Nombre:</span>
              <p className="font-medium">{data?.deudor?.nombre_completo_deudor}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Dirección:</span>
              <p className="font-medium">{data?.deudor?.direccion_deudor}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Teléfono:</span>
              <p className="font-medium">{data?.deudor?.telefono_deudor}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Correo:</span>
              <p className="font-medium">{data?.deudor?.correo_electronico_deudor}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Relación:</span>
              <p className="font-medium">{data?.relacion?.nombre_relacion}</p>
            </div>
          </div>
        </div>

        {(data?.deudor?.contacto?.nombre_contacto1 || data?.deudor?.contacto?.telefono_contacto1 || data?.deudor?.contacto?.correo_contacto1 || data?.deudor?.contacto?.nombre_contacto2 || data?.deudor?.contacto?.telefono_contacto2 || data?.deudor?.contacto?.correo_contacto2) && (
          <div className="mb-4 rounded-lg border p-5">
            <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-secondary">
              <Phone className="h-5 w-5" />
              Contactos
            </div>

                  <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-base">
                    <div>
                      <span className="text-muted-foreground">Nombre:</span>
                      <p className="font-medium">{data?.deudor?.contacto?.nombre_contacto1 ?? '—'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Teléfono:</span>
                      <p className="font-medium">{data?.deudor?.contacto?.telefono_contacto1 ?? '—'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Correo:</span>
                      <p className="font-medium">{data?.deudor?.contacto?.correo_contacto1 ?? '—'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Nombre:</span>
                      <p className="font-medium">{data?.deudor?.contacto?.nombre_contacto2 ?? '—'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Teléfono:</span>
                      <p className="font-medium">{data?.deudor?.contacto?.telefono_contacto2 ?? '—'}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Correo:</span>
                      <p className="font-medium">{data?.deudor?.contacto?.correo_contacto2 ?? '—'}</p>
                    </div>
                  </div>
          </div>
        )}

        {data?.ubicacion && (
          <div className="mb-4 rounded-lg border p-5">
            <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-secondary">
              <MapPin className="h-5 w-5" />
              Ubicación
            </div>
            <div className="grid grid-cols-4 gap-x-6 gap-y-2 text-base">
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

        <div className="rounded-lg border p-5">
          <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-primary">
            <DollarSign className="h-5 w-5" />
            Información Financiera
          </div>

          <div className="mb-3">
            <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-base">Servicio</TableHead>
                      <TableHead className="text-right text-base">Cant.</TableHead>
                      <TableHead className="text-right text-base">Valor Unitario</TableHead>
                      <TableHead className="text-right text-base">Total</TableHead>
                    </TableRow>
                  </TableHeader>
              <TableBody>
                {data?.tipo_financiamiento && (
                  <TableRow>
                    <TableCell className="text-base font-medium">{data.tipo_financiamiento.nombre}</TableCell>
                    <TableCell className="text-right text-base">—</TableCell>
                    <TableCell className="text-right text-base">{formatCurrency(data.tipo_financiamiento.valor_arriendo)}</TableCell>
                    <TableCell className="text-right text-base font-medium">
                      {formatCurrency(data.tipo_financiamiento.valor_arriendo)}
                    </TableCell>
                  </TableRow>
                )}
                {data?.servicios?.map((s: any) => (
                  <TableRow key={s.id}>
                    <TableCell className="text-base">{s.nombre}</TableCell>
                    <TableCell className="text-right text-base">{s.pivot.cantidad}</TableCell>
                    <TableCell className="text-right text-base">{formatCurrency(s.pivot.valor_unitario)}</TableCell>
                    <TableCell className="text-right text-base font-medium">
                      {formatCurrency(s.pivot.cantidad * s.pivot.valor_unitario)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="border-b mb-3" />

          <div className="grid grid-cols-2 gap-3 text-base">
            <div>
              <span className="text-muted-foreground">Forma de Pago:</span>
              <p className="font-medium">{data?.forma_pago?.nombre}</p>
            </div>
            {data?.numero_cuotas && (
              <div>
                <span className="text-muted-foreground">N° Cuotas:</span>
                <p className="font-medium">{data.numero_cuotas}</p>
              </div>
            )}
          </div>
          <div className="ml-auto mt-3 w-full max-w-xs space-y-1.5 text-base">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(data?.subtotal ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">IVA (19%)</span>
              <span>{formatCurrency(data?.iva ?? 0)}</span>
            </div>
            <div className="flex justify-between border-t pt-1.5 text-lg font-bold">
              <span>Total General</span>
              <span className="text-primary">{formatCurrency(data?.total ?? 0)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Documento generado el {new Date().toLocaleDateString('es-CL')}
        </div>
      </div>

      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: legal; margin: 0.75cm; }
          .border, .rounded-lg { border-color: #e2e8f0 !important; }
          .text-primary { color: #2563eb !important; }
        }
        @media screen {
          body { background: #f5f5f5; }
          .mx-auto { background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        }
      `}</style>
    </>
  )
}

ImprimirOt.layout = (page: ReactNode) => page
