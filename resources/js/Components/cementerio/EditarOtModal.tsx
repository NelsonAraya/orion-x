import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'
import { FormInput } from '@/Components/forms/FormInput'
import { FormSelect } from '@/Components/forms/FormSelect'
import { useToastContext } from '@/Components/ToastProvider'
import { router } from '@inertiajs/react'
import Swal from 'sweetalert2'
import {
  User,
  Building2,
  Phone,
  MapPin,
  DollarSign,
  Loader,
  Save,
  X,
  FileText,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'

interface EditarOtModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  otNumber: string
}

interface FormData {
  rf_relacion: string
  primer_contacto_nombre: string
  primer_contacto_telefono: string
  primer_contacto_correo: string
  segundo_contacto_nombre: string
  segundo_contacto_telefono: string
  segundo_contacto_correo: string
  sector: string
  tipo_ubicacion: string
  patio: string
  calle: string
  lote: string
  ot_estado_id: string
}

export function EditarOtModal({ open, onOpenChange, otNumber }: EditarOtModalProps) {
  const { addToast } = useToastContext()
  const [data, setData] = useState<any | null>(null)
  const [referencias, setReferencias] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<FormData>({
    rf_relacion: '',
    primer_contacto_nombre: '',
    primer_contacto_telefono: '',
    primer_contacto_correo: '',
    segundo_contacto_nombre: '',
    segundo_contacto_telefono: '',
    segundo_contacto_correo: '',
    sector: '',
    tipo_ubicacion: '',
    patio: '',
    calle: '',
    lote: '',
    ot_estado_id: '',
  })

  const set = (key: keyof FormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (!open || !otNumber) return
    setLoading(true)
    setSaving(false)

    Promise.all([
      fetch(`/cementerio/ot/${otNumber}/detalle`).then((r) => r.json()),
      fetch(`/cementerio/referencias-ot`).then((r) => r.json()),
    ])
      .then(([detalle, refs]) => {
        setData(detalle)
        setReferencias(refs)
        setForm({
          rf_relacion: String(detalle.relacion?.id ?? ''),
          primer_contacto_nombre: detalle.deudor?.contacto?.nombre_contacto1 ?? '',
          primer_contacto_telefono: detalle.deudor?.contacto?.telefono_contacto1 ?? '',
          primer_contacto_correo: detalle.deudor?.contacto?.correo_contacto1 ?? '',
          segundo_contacto_nombre: detalle.deudor?.contacto?.nombre_contacto2 ?? '',
          segundo_contacto_telefono: detalle.deudor?.contacto?.telefono_contacto2 ?? '',
          segundo_contacto_correo: detalle.deudor?.contacto?.correo_contacto2 ?? '',
          sector: String(detalle.ubicacion?.sector?.id ?? ''),
          tipo_ubicacion: String(detalle.ubicacion?.tipo_ubicacion?.id ?? ''),
          patio: detalle.ubicacion?.patio ?? '',
          calle: detalle.ubicacion?.calle ?? '',
          lote: detalle.ubicacion?.lote ?? '',
          ot_estado_id: String(detalle.ot_estado_id ?? ''),
        })
      })
      .catch(() => {
        setData(null)
        addToast({
          title: 'Error',
          description: 'No se pudieron cargar los datos de la OT.',
          variant: 'destructive',
        })
      })
      .finally(() => setLoading(false))
  }, [open, otNumber])

  const confirmarAnulacion = async (): Promise<boolean> => {
    const tienePagadas = data?.tiene_cuotas_pagadas

    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Está seguro?',
      text: tienePagadas
        ? 'Esta OT tiene cuotas pagadas. ¿Está seguro de anular de todas formas? Las cuotas pagadas también serán anuladas.'
        : 'Esta acción cambiará el estado de la OT a Anulada.',
      showCancelButton: true,
      showCloseButton: true,
      allowOutsideClick: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, anular',
      cancelButtonText: 'Cancelar',
      customClass: { container: 'swal-high-z' },
    })

    return result.isConfirmed
  }

  const ejecutarGuardado = (payload: Record<string, any>) => {
    setSaving(true)
    router.put(
      route('cementerio.ot.update', { ot: otNumber }) as string,
      payload,
      {
        preserveScroll: true,
        onSuccess: () => {
          addToast({
            title: 'OT Actualizada',
            description: `OT ${otNumber} actualizada correctamente.`,
            variant: 'default',
          })
          onOpenChange(false)
        },
        onError: (errs) => {
          const messages = Object.values(errs as Record<string, string>).join(', ')
          addToast({
            title: 'Error al guardar',
            description: messages || 'Ocurrió un error al actualizar la OT.',
            variant: 'destructive',
          })
        },
        onFinish: () => setSaving(false),
      },
    )
  }

  const handleGuardar = async () => {
    if (!form.rf_relacion) {
      addToast({ title: 'Error', description: 'Debe seleccionar una relación.', variant: 'destructive' })
      return
    }
    if (!form.primer_contacto_nombre || !form.primer_contacto_telefono || !form.primer_contacto_correo) {
      addToast({ title: 'Error', description: 'Los campos de contacto principal son obligatorios.', variant: 'destructive' })
      return
    }

    const payload = {
      rf_relacion: form.rf_relacion,
      primer_contacto_nombre: form.primer_contacto_nombre,
      primer_contacto_telefono: form.primer_contacto_telefono,
      primer_contacto_correo: form.primer_contacto_correo,
      segundo_contacto_nombre: form.segundo_contacto_nombre || null,
      segundo_contacto_telefono: form.segundo_contacto_telefono || null,
      segundo_contacto_correo: form.segundo_contacto_correo || null,
      sector: form.sector || null,
      tipo_ubicacion: form.tipo_ubicacion || null,
      patio: form.patio || null,
      calle: form.calle || null,
      lote: form.lote || null,
      ot_estado_id: form.ot_estado_id,
    }

    const esAnulacion = form.ot_estado_id === '3'
    const estadoActualEsAnulado = data?.ot_estado_id === 3

    if (esAnulacion && !estadoActualEsAnulado) {
      onOpenChange(false)
      await new Promise((r) => setTimeout(r, 300))
      const confirmed = await confirmarAnulacion()
      if (!confirmed) return
      ejecutarGuardado({ ...payload, confirma_anulacion: true })
    } else {
      ejecutarGuardado(payload)
    }
  }

  const relacionesData = (referencias?.relaciones as { id: number; nombre_relacion: string }[]) ?? []
  const sectoresData = (referencias?.sectores as { id: number; nombre: string }[]) ?? []
  const tiposUbicacionData = (referencias?.tipos_ubicacion as { id: number; nombre: string }[]) ?? []
  const estadosData = (referencias?.estados as { id: number; nombre: string }[]) ?? []

  const relacionesOptions = relacionesData.map((r) => ({
    value: String(r.id),
    label: r.nombre_relacion,
  }))
  const sectoresOptions = sectoresData.map((s) => ({
    value: String(s.id),
    label: s.nombre,
  }))
  const tiposUbicacionOptions = tiposUbicacionData.map((t) => ({
    value: String(t.id),
    label: t.nombre,
  }))
  const estadosOptions = estadosData.map((e) => ({
    value: String(e.id),
    label: e.nombre,
  }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-primary" />
            Editar Orden de Trabajo {otNumber}
          </DialogTitle>
          <DialogDescription>
            Modifica los campos editables de la orden de trabajo.
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
          <div className="space-y-5">
            {/* Estado */}
            <div className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
              <FormSelect
                label="Estado"
                value={form.ot_estado_id}
                onValueChange={(v) => set('ot_estado_id', v)}
                options={estadosOptions}
                placeholder="Seleccionar estado"
              />
            </div>

            {/* Fallecido (read-only) */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                <User className="h-4 w-4" />
                Datos del Fallecido (no editables)
              </div>
              <div className="grid grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">RUT:</span>
                  <p className="font-medium">
                    {data.fallecido?.rut_fallecido ?? data.fallecido?.codigo_nn ?? '—'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nombre:</span>
                  <p className="font-medium">{data.fallecido?.nombre_completo}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Sexo:</span>
                  <p className="font-medium capitalize">
                    {data.fallecido?.sexo?.nombre ?? '—'}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">F. Fallecimiento:</span>
                  <p className="font-medium">{data.fallecido?.fecha_fallecimiento ?? '—'}</p>
                </div>
              </div>
            </div>

            {/* Deudor (read-only) + Relación (editable) */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                <Building2 className="h-4 w-4" />
                Responsable Financiero
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm mb-4">
                <div>
                  <span className="text-muted-foreground">RUT:</span>
                  <p className="font-medium">
                    {data.deudor?.rut}-{data.deudor?.dv}
                  </p>
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
                  <FormSelect
                    label="Relación con el Fallecido"
                    value={form.rf_relacion}
                    onValueChange={(v) => set('rf_relacion', v)}
                    options={relacionesOptions}
                    placeholder="Seleccionar relación"
                  />
                </div>
              </div>
            </div>

            {/* Contactos (editables) */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                <Phone className="h-4 w-4" />
                Contactos
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormInput
                  label="Nombre (Contacto 1)"
                  value={form.primer_contacto_nombre}
                  onChange={(e) => set('primer_contacto_nombre', e.target.value)}
                />
                <FormInput
                  label="Teléfono (Contacto 1)"
                  value={form.primer_contacto_telefono}
                  onChange={(e) => set('primer_contacto_telefono', e.target.value)}
                />
                <FormInput
                  label="Correo (Contacto 1)"
                  value={form.primer_contacto_correo}
                  onChange={(e) => set('primer_contacto_correo', e.target.value)}
                />
                <FormInput
                  label="Nombre (Contacto 2)"
                  value={form.segundo_contacto_nombre}
                  onChange={(e) => set('segundo_contacto_nombre', e.target.value)}
                />
                <FormInput
                  label="Teléfono (Contacto 2)"
                  value={form.segundo_contacto_telefono}
                  onChange={(e) => set('segundo_contacto_telefono', e.target.value)}
                />
                <FormInput
                  label="Correo (Contacto 2)"
                  value={form.segundo_contacto_correo}
                  onChange={(e) => set('segundo_contacto_correo', e.target.value)}
                />
              </div>
            </div>

            {/* Ubicación (editable) */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                <MapPin className="h-4 w-4" />
                Ubicación
              </div>
              <div className="grid grid-cols-5 gap-4">
                <FormSelect
                  label="Sector"
                  value={form.sector}
                  onValueChange={(v) => set('sector', v)}
                  options={sectoresOptions}
                  placeholder="Seleccionar sector..."
                />
                <FormSelect
                  label="Tipo de Ubicación"
                  value={form.tipo_ubicacion}
                  onValueChange={(v) => set('tipo_ubicacion', v)}
                  options={tiposUbicacionOptions}
                  placeholder="Seleccionar tipo..."
                />
                <FormInput
                  label="Patio"
                  value={form.patio}
                  onChange={(e) => set('patio', e.target.value)}
                />
                <FormInput
                  label="Calle"
                  value={form.calle}
                  onChange={(e) => set('calle', e.target.value)}
                />
                <FormInput
                  label="Lote"
                  value={form.lote}
                  onChange={(e) => set('lote', e.target.value)}
                />
              </div>
            </div>

            {/* Información Financiera (read-only) */}
            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
                <DollarSign className="h-4 w-4" />
                Información Financiera (no editable)
              </div>
              <div>
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
                        <TableCell className="font-medium">
                          {data.tipo_financiamiento.nombre}
                        </TableCell>
                        <TableCell className="text-right">—</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(data.tipo_financiamiento.valor_arriendo)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(data.tipo_financiamiento.valor_arriendo)}
                        </TableCell>
                      </TableRow>
                    )}
                    {data.servicios?.map((s: any) => (
                      <TableRow key={s.id}>
                        <TableCell>{s.nombre}</TableCell>
                        <TableCell className="text-right">
                          {s.pivot.cantidad}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(s.pivot.valor_unitario)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(s.pivot.cantidad * s.pivot.valor_unitario)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="border-b my-3" />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Forma de Pago:</span>
                  <p className="font-medium">{data.forma_pago?.nombre ?? '—'}</p>
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

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 mr-1" />
                Cancelar
              </Button>
              <Button onClick={handleGuardar} disabled={saving}>
                <Save className="h-4 w-4 mr-1" />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
