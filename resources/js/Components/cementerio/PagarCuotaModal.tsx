import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/Components/ui/dialog'
import { FormSelect } from '@/Components/forms/FormSelect'
import { FormInput } from '@/Components/forms/FormInput'
import { Button } from '@/Components/ui/button'
import { CheckCircle2, Loader, DollarSign, Calendar, Hash, Banknote, Plus, X, AlertTriangle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface PagarCuotaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cuota: any
  formasPago: { id: number; nombre: string }[]
  onPagoExitoso: (updatedCuota: any) => void
}

function formatDate(dateStr: string) {
  if (!dateStr) return '—'
  const [y, m, d] = dateStr.split('T')[0].split('-')
  return `${d}-${m}-${y}`
}

export function PagarCuotaModal({ open, onOpenChange, cuota, formasPago, onPagoExitoso }: PagarCuotaModalProps) {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [metodoPagoId, setMetodoPagoId] = useState('')
  const [montoRecibido, setMontoRecibido] = useState('')
  const [pagosMixtos, setPagosMixtos] = useState<{ metodo_pago_id: string; monto: string }[]>([])
  const [loading, setLoading] = useState(false)
  const [pagoCompletado, setPagoCompletado] = useState(false)
  const [error, setError] = useState('')

  const metodoEfectivoId = useMemo(() => {
    const ef = formasPago.find((fp) => fp.nombre.toLowerCase() === 'efectivo')
    return ef ? String(ef.id) : null
  }, [formasPago])

  const metodoPagoMixtoId = useMemo(() => {
    const mx = formasPago.find((fp) => fp.nombre.toLowerCase() === 'pago mixto')
    return mx ? String(mx.id) : null
  }, [formasPago])

  if (!cuota) return null

  const formasPagoOptions = formasPago.map((fp) => ({
    value: String(fp.id),
    label: fp.nombre,
  }))

  const formasPagoOptionsSinMixto = formasPago
    .filter((fp) => fp.nombre.toLowerCase() !== 'pago mixto')
    .map((fp) => ({ value: String(fp.id), label: fp.nombre }))

  const esEfectivo = metodoPagoId === metodoEfectivoId
  const esMixto = metodoPagoId === metodoPagoMixtoId

  const montoRecibidoNum = Number(montoRecibido) || 0
  const vuelto = montoRecibidoNum - cuota.monto
  const montoSuficiente = !esEfectivo || montoRecibidoNum >= cuota.monto

  const totalMixto = pagosMixtos.reduce((sum, p) => sum + (Number(p.monto) || 0), 0)
  const vueltoMixto = totalMixto - cuota.monto
  const montoSuficienteMixto = totalMixto >= cuota.monto
  const todosCompletos = pagosMixtos.length > 0 && pagosMixtos.every((p) => p.metodo_pago_id && Number(p.monto) > 0)

  const handleGenerarPago = async () => {
    if (!metodoPagoId) return

    if (esMixto && (!todosCompletos || !montoSuficienteMixto)) return
    if (!esMixto && !montoSuficiente) return

    setLoading(true)
    try {
      const body: any = {
        fecha: new Date().toISOString().split('T')[0],
      }

      if (esMixto) {
        body.pagos_mixtos = pagosMixtos.map((p) => ({
          metodo_pago_id: Number(p.metodo_pago_id),
          monto: Number(p.monto),
        }))
      } else {
        body.monto = cuota.monto
        body.metodo_pago_id = Number(metodoPagoId)
        if (esEfectivo && montoRecibidoNum > cuota.monto) {
          body.monto_recibido = montoRecibidoNum
        }
      }

      const { data: updated } = await (window as any).axios.put(`/cementerio/cuotas/${cuota.id}/pagar`, body)
      setPagoCompletado(true)
      setStep('success')
      onPagoExitoso(updated)
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || 'Error al procesar el pago. Intenta nuevamente.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      setStep('form')
      setMetodoPagoId('')
      setMontoRecibido('')
      setPagosMixtos([])
      setPagoCompletado(false)
      setError('')
    }, 200)
  }

  const agregarFilaMixto = () => {
    setPagosMixtos((prev) => [...prev, { metodo_pago_id: '', monto: '' }])
  }

  const eliminarFilaMixto = (index: number) => {
    setPagosMixtos((prev) => prev.filter((_, i) => i !== index))
  }

  const actualizarFilaMixto = (index: number, field: 'metodo_pago_id' | 'monto', value: string) => {
    setPagosMixtos((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)))
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {step === 'form' ? (
              <DollarSign className="h-5 w-5 text-primary" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            )}
            {step === 'form' ? 'Pagar Cuota' : 'Pago Exitoso'}
          </DialogTitle>
          <DialogDescription>
            {step === 'form'
              ? `Complete los datos para pagar la cuota ${cuota.numero_cuota}/${cuota.total_cuotas}.`
              : `La cuota ${cuota.numero_cuota}/${cuota.total_cuotas} ha sido registrada como pagada.`}
          </DialogDescription>
        </DialogHeader>

        {step === 'form' ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5" />
                  Cuota
                </span>
                <span className="font-medium">{cuota.numero_cuota}/{cuota.total_cuotas}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />
                  Monto
                </span>
                <span className="text-base font-bold text-primary">{formatCurrency(cuota.monto)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Vencimiento
                </span>
                <span className="font-medium">{formatDate(cuota.fecha_vencimiento)}</span>
              </div>
            </div>

            <FormSelect
              label="Método de Pago"
              value={metodoPagoId}
              onValueChange={(v) => { setMetodoPagoId(v); setMontoRecibido(''); setPagosMixtos([]); setError('') }}
              options={formasPagoOptions}
              placeholder="Seleccionar método..."
            />

            {esEfectivo && (
              <div className="space-y-2">
                <FormInput
                  label="Monto con que paga"
                  type="number"
                  min={cuota.monto}
                  value={montoRecibido}
                  onChange={(e) => setMontoRecibido(e.target.value)}
                />
                {montoRecibidoNum > 0 && vuelto > 0 && (
                  <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm">
                    <Banknote className="h-4 w-4 text-emerald-600" />
                    <span className="text-emerald-800">
                      El vuelto es de: <strong>{formatCurrency(vuelto)}</strong>
                    </span>
                  </div>
                )}
                {montoRecibidoNum > 0 && vuelto < 0 && (
                  <p className="text-xs text-destructive">
                    El monto debe ser mayor o igual a {formatCurrency(cuota.monto)}.
                  </p>
                )}
              </div>
            )}

            {esMixto && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Distribuir pago</p>
                {pagosMixtos.map((pago, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <div className="flex-1">
                      <FormSelect
                        label="Método"
                        value={pago.metodo_pago_id}
                        onValueChange={(v) => actualizarFilaMixto(index, 'metodo_pago_id', v)}
                        options={formasPagoOptionsSinMixto}
                        placeholder="Seleccionar..."
                      />
                    </div>
                    <div className="w-28">
                      <FormInput
                        label="Monto"
                        type="number"
                        min={1}
                        value={pago.monto}
                        onChange={(e) => actualizarFilaMixto(index, 'monto', e.target.value)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-6 h-9 w-9 shrink-0"
                      onClick={() => eliminarFilaMixto(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button variant="outline" size="sm" className="gap-1" onClick={agregarFilaMixto}>
                  <Plus className="h-3.5 w-3.5" />
                  Agregar pago
                </Button>

                {pagosMixtos.length > 0 && (
                  <div className="rounded-md border bg-muted/30 p-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total ingresado</span>
                      <span className={totalMixto >= cuota.monto ? 'font-medium' : 'font-medium text-destructive'}>
                        {formatCurrency(totalMixto)}
                      </span>
                    </div>
                    {totalMixto >= cuota.monto && vueltoMixto > 0 && (
                      <div className="flex items-center gap-2 text-emerald-700">
                        <Banknote className="h-4 w-4" />
                        <span>
                          El vuelto es de: <strong>{formatCurrency(vueltoMixto)}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <Button
              className="w-full gap-2"
              disabled={
                !metodoPagoId || loading ||
                (esMixto ? !todosCompletos || !montoSuficienteMixto : !montoSuficiente)
              }
              onClick={handleGenerarPago}
            >
              {loading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Generar Pago
            </Button>

            {error && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2 py-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-600" />
              <p className="text-center text-lg font-semibold">Pago generado con éxito</p>
              <p className="text-center text-sm text-muted-foreground">
                Cuota {cuota.numero_cuota}/{cuota.total_cuotas} — {formatCurrency(cuota.monto)}
              </p>
            </div>

            <Button variant="outline" className="w-full" onClick={handleClose}>
              Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
