import { useState, useMemo, type ReactNode } from 'react'
import { Head, router, useForm, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Breadcrumbs } from '@/Components/shared/Breadcrumbs'
import { CardSection } from '@/Components/shared/CardSection'
import { FormInput } from '@/Components/forms/FormInput'
import { ActionButtons } from '@/Components/shared/ActionButtons'
import { useToastContext } from '@/Components/ToastProvider'
import { ConfirmDialog } from '@/Components/ConfirmDialog'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import {
  User, Save, RotateCcw, X, Pencil, AlertTriangle,
  ChevronLeft, ChevronRight,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/Components/ui/dialog'
import { Button } from '@/Components/ui/button'

interface DeudorRow {
  rut: number
  dv: string
  nombre_completo_deudor: string
  direccion_deudor: string
  telefono_deudor: string
  correo_electronico_deudor: string
  registrador_id: string | null
  contacto?: {
    nombre_contacto1?: string
    telefono_contacto1?: string
    correo_contacto1?: string
    nombre_contacto2?: string
    telefono_contacto2?: string
    correo_contacto2?: string
  } | null
}

const requiredFields = [
  'nombre_completo_deudor', 'direccion_deudor',
  'telefono_deudor', 'correo_electronico_deudor',
]

export default function HistorialDeudores() {
  const page = usePage()
  const deudores = (page.props.deudores as any) ?? null
  const { addToast } = useToastContext()

  const moduloPerfiles = (page.props.modulo_perfiles as Record<string, string> | undefined) ?? {}
  const perfil = moduloPerfiles['cementerio-historial-deudores'] ?? 'superadmin'
  const canCreate = perfil !== 'auditor'
  const canEdit = perfil === 'superadmin' || perfil === 'admin'
  const canEditRut = perfil === 'superadmin'
  const canViewForm = perfil !== 'auditor'

  const form = useForm({
    rut: '',
    nombre_completo_deudor: '',
    direccion_deudor: '',
    telefono_deudor: '',
    correo_electronico_deudor: '',
    registrador_id: '',
  })

  const [showConfirm, setShowConfirm] = useState<'clear' | 'cancel' | null>(null)
  const [showConfirmGuardar, setShowConfirmGuardar] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [editando, setEditando] = useState<DeudorRow | null>(null)
  const [editForm, setEditForm] = useState<Record<string, any>>({})
  const [editErrors, setEditErrors] = useState<Record<string, string>>({})
  const [editProcessing, setEditProcessing] = useState(false)

  const formErrors: Record<string, string> = (form.errors ?? {}) as any

  const set = (key: string, value: any) => {
    ;(form.setData as any)(key, value)
    setDirty(true)
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    for (const field of requiredFields) {
      if (!String((form.data as any)[field] ?? '').trim()) {
        newErrors[field] = 'Este campo es obligatorio'
      }
    }
    if (!String(form.data.rut ?? '').trim()) {
      newErrors.rut = 'Este campo es obligatorio'
    }
    return Object.keys(newErrors).length === 0
  }

  const handleGuardar = () => {
    if (!validate()) {
      addToast({ title: 'Error de validación', description: 'Corrige los campos marcados en rojo.', variant: 'destructive' })
      return
    }
    setShowConfirmGuardar(true)
  }

  const confirmGuardar = () => {
    setShowConfirmGuardar(false)
    form.post(route('cementerio.historial-deudores.store') as string, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        form.reset()
        setDirty(false)
        addToast({ title: 'Deudor registrado', description: 'El deudor se ha guardado correctamente.', variant: 'default' })
      },
      onError: () => {
        addToast({ title: 'Error de validación', description: 'Corrige los campos marcados en rojo.', variant: 'destructive' })
      },
    })
  }

  const handleLimpiar = () => {
    const hasData = Object.entries(form.data).some(([k, v]) => {
      return String(v ?? '').trim() !== ''
    })
    if (hasData) { setShowConfirm('clear'); return }
    form.reset()
    setDirty(false)
  }

  const handleCancelar = () => {
    if (dirty) { setShowConfirm('cancel'); return }
    window.history.back()
  }

  const confirmClear = () => {
    form.reset()
    setDirty(false)
    setShowConfirm(null)
    addToast({ title: 'Formulario limpiado', variant: 'default' })
  }

  // Edit modal
  const abrirEdicion = (d: DeudorRow) => {
    setEditando(d)
    setEditForm({
      ...d,
      rut: `${d.rut}-${d.dv}`,
      ...(d.contacto ? {
        nombre_contacto1: d.contacto.nombre_contacto1 ?? '',
        telefono_contacto1: d.contacto.telefono_contacto1 ?? '',
        correo_contacto1: d.contacto.correo_contacto1 ?? '',
        nombre_contacto2: d.contacto.nombre_contacto2 ?? '',
        telefono_contacto2: d.contacto.telefono_contacto2 ?? '',
        correo_contacto2: d.contacto.correo_contacto2 ?? '',
      } : {
        nombre_contacto1: '',
        telefono_contacto1: '',
        correo_contacto1: '',
        nombre_contacto2: '',
        telefono_contacto2: '',
        correo_contacto2: '',
      }),
    })
    setEditErrors({})
  }

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
    if (!String(editForm.rut ?? '').trim()) {
      newErrors.rut = 'Este campo es obligatorio'
    }
    setEditErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setEditProcessing(true)
    router.put(
      (route('cementerio.historial-deudores.update', editando!.rut) as string),
      {
        rut: editForm.rut,
        nombre_completo_deudor: editForm.nombre_completo_deudor,
        direccion_deudor: editForm.direccion_deudor,
        telefono_deudor: editForm.telefono_deudor,
        correo_electronico_deudor: editForm.correo_electronico_deudor,
        registrador_id: editForm.registrador_id ?? '',
        primer_contacto_nombre: editForm.nombre_contacto1 ?? '',
        primer_contacto_telefono: editForm.telefono_contacto1 ?? '',
        primer_contacto_correo: editForm.correo_contacto1 ?? '',
        segundo_contacto_nombre: editForm.nombre_contacto2 ?? '',
        segundo_contacto_telefono: editForm.telefono_contacto2 ?? '',
        segundo_contacto_correo: editForm.correo_contacto2 ?? '',
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setEditando(null)
          setEditProcessing(false)
          addToast({ title: 'Deudor actualizado', description: 'Los cambios se han guardado correctamente.', variant: 'default' })
        },
        onError: (errs: Record<string, string>) => {
          setEditErrors(errs)
          setEditProcessing(false)
        },
        onFinish: () => setEditProcessing(false),
      },
    )
  }

  const deudoresList: DeudorRow[] = deudores?.data ?? []

  return (
    <>
      <Head title="Cementerio - Historial Deudores" />

      <div className="animate-fade-in-up space-y-6">
        <Breadcrumbs items={[{ label: 'Cementerio' }, { label: 'Historial Deudores' }]} />

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Historial Deudores</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Administración de deudores y responsables financieros
          </p>
        </div>

        {canViewForm && (
        <>
        <CardSection title="Datos del Deudor" icon={User} iconColor="primary">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <FormInput
                label="RUT"
                required
                autoComplete="off"
                value={form.data.rut}
                onChange={(e) => set('rut', e.target.value)}
                placeholder="EJ: 12345678-9"
                error={formErrors.rut}
              />
              <p className="text-xs text-muted-foreground">Sin Puntos y con Guion</p>
            </div>
            <FormInput
              label="Nombre Completo" required
              autoComplete="off"
              value={form.data.nombre_completo_deudor}
              onChange={(e) => set('nombre_completo_deudor', e.target.value)}
              error={formErrors.nombre_completo_deudor}
            />
            <FormInput
              label="Dirección" required
              autoComplete="off"
              value={form.data.direccion_deudor}
              onChange={(e) => set('direccion_deudor', e.target.value)}
              error={formErrors.direccion_deudor}
            />
            <FormInput
              label="Teléfono" required
              autoComplete="off"
              value={form.data.telefono_deudor}
              onChange={(e) => set('telefono_deudor', e.target.value)}
              placeholder="Ej: +56912345678"
              error={formErrors.telefono_deudor}
            />
              <FormInput
                label="Correo Electrónico" required
                autoComplete="off"
                value={form.data.correo_electronico_deudor}
                onChange={(e) => set('correo_electronico_deudor', e.target.value)}
                placeholder="correo@ejemplo.cl"
                error={formErrors.correo_electronico_deudor}
              />
            </div>
        </CardSection>

        {canCreate && (
          <ActionButtons
            className="gap-4"
            primary={{
              label: 'Guardar',
              icon: Save,
              onClick: handleGuardar,
              disabled: form.processing,
            }}
            secondary={[
              { label: 'Limpiar', icon: RotateCcw, variant: 'outline', onClick: handleLimpiar },
              { label: 'Cancelar', icon: X, variant: 'ghost', onClick: handleCancelar },
            ]}
          />
        )}
        </>)}
        {/* Historial Deudores */}
        <CardSection title="Historial Deudores" icon={User} iconColor="primary">
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RUT</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Correo Electrónico</TableHead>
                  <TableHead>Registrador ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deudoresList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No hay deudores registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  deudoresList.map((d) => (
                    <TableRow
                      key={d.rut}
                      onClick={canEdit ? () => abrirEdicion(d) : undefined}
                      className={canEdit ? 'cursor-pointer' : ''}
                    >
                      <TableCell className="whitespace-nowrap font-medium">{d.rut}-{d.dv}</TableCell>
                      <TableCell className="whitespace-nowrap">{d.nombre_completo_deudor}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{d.direccion_deudor}</TableCell>
                      <TableCell className="whitespace-nowrap">{d.telefono_deudor}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{d.correo_electronico_deudor}</TableCell>
                      <TableCell>{d.registrador_id ?? '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {deudores?.meta?.last_page > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {deudores?.meta?.from ?? 0} a {deudores?.meta?.to ?? 0} de {deudores?.meta?.total ?? 0} registros
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={deudores?.meta?.current_page === 1}
                  onClick={() => {
                    const url = new URL(window.location.href)
                    url.searchParams.set('page', String((deudores?.meta?.current_page ?? 1) - 1))
                    window.location.href = url.toString()
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: deudores?.meta?.last_page ?? 1 }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === deudores?.meta?.current_page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      const url = new URL(window.location.href)
                      url.searchParams.set('page', String(page))
                      window.location.href = url.toString()
                    }}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={deudores?.meta?.current_page === deudores?.meta?.last_page}
                  onClick={() => {
                    const url = new URL(window.location.href)
                    url.searchParams.set('page', String((deudores?.meta?.current_page ?? 1) + 1))
                    window.location.href = url.toString()
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardSection>
      </div>

      <ConfirmDialog
        open={showConfirm === 'clear'}
        title="¿Limpiar formulario?"
        message="Se perderán todos los datos ingresados."
        confirmText="Sí, limpiar"
        onConfirm={confirmClear}
        onCancel={() => setShowConfirm(null)}
      />
      <ConfirmDialog
        open={showConfirm === 'cancel'}
        title="¿Descartar cambios?"
        message="Los datos ingresados no se guardarán."
        confirmText="Sí, descartar"
        onConfirm={() => window.history.back()}
        onCancel={() => setShowConfirm(null)}
      />

      <ConfirmDialog
        open={showConfirmGuardar}
        title="¿Está seguro que desea guardar estos datos?"
        confirmText="Guardar"
        cancelText="Cancelar"
        icon={<AlertTriangle className="h-6 w-6 text-amber-500" />}
        className="max-w-xl"
        onConfirm={confirmGuardar}
        onCancel={() => setShowConfirmGuardar(false)}
      >
        <div className="mt-2 text-sm text-left max-h-60 overflow-y-auto">
          <div className="grid grid-cols-3 gap-x-6 gap-y-2">
            <div>
              <span className="text-xs text-muted-foreground">RUT</span>
              <p className="font-medium break-words">{form.data.rut || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Nombre Completo</span>
              <p className="font-medium break-words">{form.data.nombre_completo_deudor || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Dirección</span>
              <p className="font-medium break-words">{form.data.direccion_deudor || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Teléfono</span>
              <p className="font-medium break-words">{form.data.telefono_deudor || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Correo Electrónico</span>
              <p className="font-medium break-words">{form.data.correo_electronico_deudor || '—'}</p>
            </div>
          </div>
        </div>
      </ConfirmDialog>

      {/* Edit Modal */}
      {canEdit && (
      <Dialog open={editando !== null} onOpenChange={(open) => {
        if (!open) {
          setEditando(null)
          setEditProcessing(false)
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Deudor</DialogTitle>
            <DialogDescription>Corrige los datos del deudor.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1">
              <FormInput
                label="RUT"
                required
                value={editForm.rut ?? ''}
                onChange={(e) => setEdit('rut', e.target.value)}
                placeholder="EJ: 12345678-9"
                error={editErrors.rut}
                disabled={!canEditRut}
              />
              <p className="text-xs text-muted-foreground">Sin Puntos y con Guion</p>
            </div>
            <FormInput
              label="Nombre Completo" required
              value={editForm.nombre_completo_deudor ?? ''}
              onChange={(e) => setEdit('nombre_completo_deudor', e.target.value)}
              error={editErrors.nombre_completo_deudor}
            />
            <FormInput
              label="Dirección" required
              value={editForm.direccion_deudor ?? ''}
              onChange={(e) => setEdit('direccion_deudor', e.target.value)}
              error={editErrors.direccion_deudor}
            />
            <FormInput
              label="Teléfono" required
              value={editForm.telefono_deudor ?? ''}
              onChange={(e) => setEdit('telefono_deudor', e.target.value)}
              error={editErrors.telefono_deudor}
            />
              <FormInput
                label="Correo Electrónico" required
                value={editForm.correo_electronico_deudor ?? ''}
                onChange={(e) => setEdit('correo_electronico_deudor', e.target.value)}
                error={editErrors.correo_electronico_deudor}
              />
            </div>

          <div className="border-t pt-5">
            <p className="mb-3 text-sm font-semibold">Contacto 1</p>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <FormInput
                label="Nombre Contacto"
                value={editForm.nombre_contacto1 ?? ''}
                onChange={(e) => setEdit('nombre_contacto1', e.target.value)}
              />
              <FormInput
                label="Teléfono Contacto"
                value={editForm.telefono_contacto1 ?? ''}
                onChange={(e) => setEdit('telefono_contacto1', e.target.value)}
              />
              <FormInput
                label="Correo Contacto"
                type="email"
                value={editForm.correo_contacto1 ?? ''}
                onChange={(e) => setEdit('correo_contacto1', e.target.value)}
              />
            </div>
          </div>

          <div className="border-t pt-5">
            <p className="mb-3 text-sm font-semibold">Contacto 2</p>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <FormInput
                label="Nombre Contacto"
                value={editForm.nombre_contacto2 ?? ''}
                onChange={(e) => setEdit('nombre_contacto2', e.target.value)}
              />
              <FormInput
                label="Teléfono Contacto"
                value={editForm.telefono_contacto2 ?? ''}
                onChange={(e) => setEdit('telefono_contacto2', e.target.value)}
              />
              <FormInput
                label="Correo Contacto"
                type="email"
                value={editForm.correo_contacto2 ?? ''}
                onChange={(e) => setEdit('correo_contacto2', e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={guardarEdicion} className="gap-2" disabled={editProcessing}>
              <Save className="h-4 w-4" />
              {editProcessing ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      )}
    </>
  )
}

HistorialDeudores.layout = (page: ReactNode) => (
  <AppLayout title="Historial Deudores" children={page} />
)
