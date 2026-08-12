import { useEffect, type ReactNode } from 'react'
import { Head, usePage } from '@inertiajs/react'
import { FileText, CheckCircle2, User, Building2, DollarSign, Hash } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('T')[0].split('-')
  return `${d}-${m}-${y}`
}

export default function ComprobantePago() {
  const { cuota } = usePage().props as any
  const c = cuota

  useEffect(() => {
    const timer = setTimeout(() => {
      window.print()
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (!c) return null

  const fallecido = c.ot?.fallecido
  const deudor = c.ot?.deudor
  const totalPagadoMixto = c.pagos_mixtos?.reduce((sum: number, pm: any) => sum + (pm.monto || 0), 0) ?? 0
  const vueltoMixto = totalPagadoMixto - c.monto

  return (
    <>
      <Head title={`Comprobante - Cuota ${c.numero_cuota}/${c.total_cuotas}`} />

      <div className="mx-auto max-w-2xl p-6">
        <div className="mb-4 flex items-center gap-3 border-b pb-3">
          <FileText className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Comprobante de Pago</h1>
            <p className="text-sm text-muted-foreground">
              Cuota {c.numero_cuota}/{c.total_cuotas} — {c.ot?.numero_ot}
            </p>
          </div>
        </div>

        <div className="mb-4 rounded-lg border p-5">
          <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
            Datos del Pago
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-base">
            <div>
              <span className="text-muted-foreground">N° Cuota:</span>
              <p className="font-medium">{c.numero_cuota}/{c.total_cuotas}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Estado:</span>
              <p className="font-medium capitalize text-emerald-600">{c.estado}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Monto cuota:</span>
              <p className="text-lg font-bold text-primary">{formatCurrency(c.monto)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Fecha de pago:</span>
              <p className="font-medium">{formatDate(c.fecha_pago)}</p>
            </div>

            {c.pagos_mixtos?.length > 0 ? (
              <div className="col-span-2">
                <span className="text-muted-foreground">Pagos:</span>
                <div className="mt-1 space-y-0.5">
                  {c.pagos_mixtos.map((pm: any) => (
                    <div key={pm.id} className="flex justify-between text-sm">
                      <span>{pm.metodo_pago?.nombre ?? '—'}</span>
                      <span>{formatCurrency(pm.monto)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between border-t pt-0.5 text-sm font-medium">
                    <span>Total pagado</span>
                    <span>{formatCurrency(totalPagadoMixto)}</span>
                  </div>
                  {vueltoMixto > 0 && (
                    <div className="flex justify-between text-sm font-semibold text-emerald-700">
                      <span>Vuelto</span>
                      <span>{formatCurrency(vueltoMixto)}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="col-span-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Método de pago</span>
                  <span className="font-medium">{c.metodo_pago?.nombre ?? '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monto pagado</span>
                  <span className="font-medium">{formatCurrency(c.monto_pagado)}</span>
                </div>
                {c.monto_recibido != null && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monto recibido</span>
                      <span className="font-medium">{formatCurrency(c.monto_recibido)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-0.5 text-sm font-semibold text-emerald-700">
                      <span>Vuelto</span>
                      <span>{formatCurrency(c.monto_recibido - c.monto_pagado)}</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {fallecido && (
          <div className="mb-4 rounded-lg border p-5">
            <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-primary">
              <User className="h-5 w-5" />
              Datos del Fallecido
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-base">
              <div>
                <span className="text-muted-foreground">RUT:</span>
                <p className="font-medium">{fallecido.rut_fallecido ?? fallecido.codigo_nn ?? '—'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Nombre:</span>
                <p className="font-medium">{fallecido.nombre_completo}</p>
              </div>
            </div>
          </div>
        )}

        {deudor && (
          <div className="mb-4 rounded-lg border p-5">
            <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-secondary">
              <Building2 className="h-5 w-5" />
              Responsable Financiero
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-base">
              <div>
                <span className="text-muted-foreground">RUT:</span>
                <p className="font-medium">{deudor.rut}-{deudor.dv}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Nombre:</span>
                <p className="font-medium">{deudor.nombre_completo_deudor}</p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg border p-5">
          <div className="mb-3 flex items-center gap-2 text-[15px] font-semibold text-primary">
            <DollarSign className="h-5 w-5" />
            Resumen de la OT
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-base">
            <div>
              <span className="text-muted-foreground">N° OT:</span>
              <p className="font-medium">{c.ot?.numero_ot}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Total OT:</span>
              <p className="font-medium">{formatCurrency(c.ot?.total ?? 0)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Comprobante generado el {new Date().toLocaleDateString('es-CL')}
        </div>
      </div>

      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: letter; margin: 0.75cm; }
          .border, .rounded-lg { border-color: #e2e8f0 !important; }
          .text-primary { color: #2563eb !important; }
          .text-emerald-600 { color: #059669 !important; }
        }
        @media screen {
          body { background: #f5f5f5; }
          .mx-auto { background: white; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        }
      `}</style>
    </>
  )
}

ComprobantePago.layout = (page: ReactNode) => page
