import { useEffect, useState, useMemo } from 'react'
import { router } from '@inertiajs/react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/Components/ui/dialog'
import { FormInput } from '@/Components/forms/FormInput'
import { FormSelect } from '@/Components/forms/FormSelect'
import { FormTextarea } from '@/Components/forms/FormTextarea'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Checkbox } from '@/Components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/Components/ui/radio-group'
import { Button } from '@/Components/ui/button'
import { useToastContext } from '@/Components/ToastProvider'
import { nacionalidades } from '@/lib/nacionalidades'
import { Save, FileText } from 'lucide-react'

export interface FallecidoEditData {
  id: number
  rut_fallecido: string | null
  codigo_nn: string | null
  nombres_fallecido: string
  apellido_paterno_fallecido: string
  apellido_materno_fallecido: string | null
  nombre_completo?: string
  fecha_nacimiento_fallecido: string
  fecha_fallecimiento: string
  sexo_id: number
  sexo_nombre?: string
  estado_civil_id: number
  estado_civil_nombre?: string
  nacionalidad_fallecido: string
  lugar_fallecimiento: string
  observaciones: string | null
  carta_defuncion: string | null
  es_nn: boolean
  registrador_id: string | null
}

interface EditarFallecidoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fallecido: FallecidoEditData | null
  sexos: { id: number; slug: string; nombre: string }[]
  estadosCiviles: { id: number; slug: string; nombre: string }[]
  canEditRut?: boolean
  onSuccess?: () => void
}

const requiredFields = [
  'nombres_fallecido', 'apellido_paterno_fallecido', 'fecha_nacimiento_fallecido',
  'fecha_fallecimiento', 'sexo_id', 'estado_civil_id', 'nacionalidad_fallecido',
  'lugar_fallecimiento',
]

export function EditarFallecidoModal({
  open,
  onOpenChange,
  fallecido,
  sexos,
  estadosCiviles,
  canEditRut = true,
  onSuccess,
}: EditarFallecidoModalProps) {
  const { addToast } = useToastContext()

  const [editForm, setEditForm] = useState<Record<string, any>>({})
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})
  const [editProcessing, setEditProcessing] = useState(false)
  const [editEsNn, setEditEsNn] = useState(false)
  const [editConfirmSinRut, setEditConfirmSinRut] = useState<'si' | 'no' | null>(null)

  const sexoOptions = useMemo(
    () => sexos.map((s) => ({ value: String(s.id), label: s.nombre })),
    [sexos],
  )
  const estadoCivilOptions = useMemo(
    () => estadosCiviles.map((e) => ({ value: String(e.id), label: e.nombre })),
    [estadosCiviles],
  )

  const setEdit = (key: string, value: any) => {
    setEditForm((prev: any) => ({ ...prev, [key]: value }))
    setEditErrors((prev: any) => ({ ...prev, [key]: '' }))
  }

  const guardarEdicion = () => {
    const newErrors: Record<string, string> = {}
    for (const field of requiredFields) {
      if (!String(editForm[field] ?? '').trim()) {
        newErrors[field] = 'Este campo es obligatorio'
      }
    }
    if (!editEsNn && !String(editForm.rut_fallecido ?? '').trim()) {
      newErrors.rut_fallecido = 'Este campo es obligatorio'
    }
    if (editEsNn && editConfirmSinRut !== 'si') {
      newErrors.rut_fallecido = 'Debes confirmar si es NN o ingresar RUT'
    }
    setEditErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setEditProcessing(true)

    const payload: Record<string, any> = {
      nombres_fallecido: editForm.nombres_fallecido,
      apellido_paterno_fallecido: editForm.apellido_paterno_fallecido,
      apellido_materno_fallecido: editForm.apellido_materno_fallecido ?? '',
      fecha_nacimiento_fallecido: editForm.fecha_nacimiento_fallecido,
      fecha_fallecimiento: editForm.fecha_fallecimiento,
      sexo_id: editForm.sexo_id,
      estado_civil_id: editForm.estado_civil_id,
      nacionalidad_fallecido: editForm.nacionalidad_fallecido,
      lugar_fallecimiento: editForm.lugar_fallecimiento,
      observaciones: editForm.observaciones ?? '',
      registrador_id: editForm.registrador_id ?? '',
    }
    payload.rut_fallecido = editEsNn ? '' : editForm.rut_fallecido
    payload.es_nn = editEsNn

    router.put(
      route('cementerio.registro-fallecido.update', fallecido!.id) as string,
      payload,
      {
        preserveScroll: true,
        onSuccess: () => {
          onOpenChange(false)
          setEditProcessing(false)
          setEditEsNn(false)
          setEditConfirmSinRut(null)
          onSuccess?.()
          addToast({
            title: 'Fallecido actualizado',
            description: 'Los cambios se han guardado correctamente.',
            variant: 'default',
          })
        },
        onError: (errs: Record<string, string>) => {
          setEditErrors(errs)
          setEditProcessing(false)
        },
        onFinish: () => setEditProcessing(false),
      },
    )
  }

  useEffect(() => {
    if (open && fallecido) {
      setEditForm({ ...fallecido })
      setEditErrors({})
      setEditEsNn(fallecido.es_nn)
      setEditConfirmSinRut(fallecido.es_nn ? 'si' : null)
    }
  }, [open, fallecido])

  const cerrar = () => {
    if (editProcessing) return
    onOpenChange(false)
    setEditEsNn(false)
    setEditConfirmSinRut(null)
    setEditProcessing(false)
  }

  return (
    <Dialog open={open} onOpenChange={cerrar}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {editForm && Object.keys(editForm).length > 0 && (
          <>
            <DialogHeader>
              <DialogTitle>Editar Fallecido</DialogTitle>
              <DialogDescription>Corrige los datos del fallecido.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-5 py-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  RUT
                  {!editEsNn && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  value={editEsNn && editConfirmSinRut === 'si' ? '' : editForm.rut_fallecido ?? ''}
                  onChange={(e) => setEdit('rut_fallecido', e.target.value)}
                  placeholder="Ej: 12.345.678-9"
                  disabled={!canEditRut || (editEsNn && editConfirmSinRut === 'si')}
                  className={editErrors.rut_fallecido ? 'border-destructive' : ''}
                />
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="edit_es_nn"
                    checked={editEsNn}
                    disabled={!canEditRut}
                    onCheckedChange={(checked) => {
                      if (!canEditRut) return
                      setEditEsNn(!!checked)
                      if (!checked) {
                        setEditConfirmSinRut(null)
                      } else {
                        setEdit('rut_fallecido', '')
                      }
                    }}
                  />
                  <Label htmlFor="edit_es_nn" className="text-sm whitespace-nowrap cursor-pointer">
                    ¿Es NN (Sin RUT)?
                  </Label>
                </div>
                {editErrors.rut_fallecido && (
                  <p className="text-sm text-destructive">{editErrors.rut_fallecido}</p>
                )}
                {editEsNn && (
                  <div className="ml-1 mt-2">
                    <RadioGroup
                      value={editConfirmSinRut ?? ''}
                      onValueChange={(v) => {
                        setEditConfirmSinRut(v as 'si' | 'no')
                        if (v === 'si') setEdit('rut_fallecido', '')
                      }}
                      className="flex gap-6"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="si" id="edit_nn_si" />
                        <Label htmlFor="edit_nn_si" className="cursor-pointer">Sí</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="no" id="edit_nn_no" />
                        <Label htmlFor="edit_nn_no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                    {editConfirmSinRut === 'si' && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Se generará código NN automáticamente al guardar.
                      </p>
                    )}
                  </div>
                )}
              </div>
              <FormInput
                label="Nombres" required
                value={editForm.nombres_fallecido ?? ''}
                onChange={(e) => setEdit('nombres_fallecido', e.target.value)}
                error={editErrors.nombres_fallecido}
              />
              <FormInput
                label="Apellido Paterno" required
                value={editForm.apellido_paterno_fallecido ?? ''}
                onChange={(e) => setEdit('apellido_paterno_fallecido', e.target.value)}
                error={editErrors.apellido_paterno_fallecido}
              />
              <FormInput
                label="Apellido Materno"
                value={editForm.apellido_materno_fallecido ?? ''}
                onChange={(e) => setEdit('apellido_materno_fallecido', e.target.value)}
              />
              <FormInput
                label="Fecha Nacimiento" required type="date"
                value={editForm.fecha_nacimiento_fallecido ?? ''}
                onChange={(e) => setEdit('fecha_nacimiento_fallecido', e.target.value)}
                error={editErrors.fecha_nacimiento_fallecido}
              />
              <FormInput
                label="Fecha Fallecimiento" required type="date"
                value={editForm.fecha_fallecimiento ?? ''}
                onChange={(e) => setEdit('fecha_fallecimiento', e.target.value)}
                error={editErrors.fecha_fallecimiento}
              />
              <FormSelect
                label="Sexo" required
                value={String(editForm.sexo_id ?? '')}
                onValueChange={(v) => setEdit('sexo_id', v)}
                options={sexoOptions}
                error={editErrors.sexo_id}
              />
              <FormSelect
                label="Estado Civil" required
                value={String(editForm.estado_civil_id ?? '')}
                onValueChange={(v) => setEdit('estado_civil_id', v)}
                options={estadoCivilOptions}
                error={editErrors.estado_civil_id}
              />
              <FormSelect
                label="Nacionalidad" required
                value={editForm.nacionalidad_fallecido ?? ''}
                onValueChange={(v) => setEdit('nacionalidad_fallecido', v)}
                options={nacionalidades}
                error={editErrors.nacionalidad_fallecido}
              />
              <FormInput
                label="Lugar Fallecimiento" required
                value={editForm.lugar_fallecimiento ?? ''}
                onChange={(e) => setEdit('lugar_fallecimiento', e.target.value)}
                error={editErrors.lugar_fallecimiento}
              />
              <FormInput
                label="Registrador ID"
                value={editForm.registrador_id ?? ''}
                onChange={(e) => setEdit('registrador_id', e.target.value)}
              />
              <div className="md:col-span-2 lg:col-span-3">
                <FormTextarea
                  label="Observaciones"
                  value={editForm.observaciones ?? ''}
                  onChange={(e) => setEdit('observaciones', e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {fallecido && fallecido.carta_defuncion && (
              <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-4 py-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span className="font-medium">Carta de Defunción:</span>
                <span className="font-mono text-xs">{fallecido.carta_defuncion}</span>
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={editProcessing}>Cancelar</Button>
              </DialogClose>
              <Button onClick={guardarEdicion} className="gap-2" disabled={editProcessing}>
                <Save className="h-4 w-4" />
                {editProcessing ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
