import { useState, useMemo, useRef, type ReactNode } from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Breadcrumbs } from '@/Components/shared/Breadcrumbs'
import { CardSection } from '@/Components/shared/CardSection'
import { FormInput } from '@/Components/forms/FormInput'
import { FormSelect } from '@/Components/forms/FormSelect'
import { FormTextarea } from '@/Components/forms/FormTextarea'
import { ActionButtons } from '@/Components/shared/ActionButtons'
import { useToastContext } from '@/Components/ToastProvider'
import { ConfirmDialog } from '@/Components/ConfirmDialog'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Checkbox } from '@/Components/ui/checkbox'
import {
  User, FileText, Save, RotateCcw, X, Paperclip, AlertTriangle, ChevronLeft, ChevronRight,
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'
import { EditarFallecidoModal } from '@/Components/cementerio/EditarFallecidoModal'
import { Button } from '@/Components/ui/button'
import { nacionalidades } from '@/lib/nacionalidades'

interface FallecidoRow {
  id: number
  rut_fallecido: string | null
  codigo_nn: string | null
  nombres_fallecido: string
  apellido_paterno_fallecido: string
  apellido_materno_fallecido: string | null
  nombre_completo: string
  fecha_nacimiento_fallecido: string
  fecha_fallecimiento: string
  sexo_id: number
  sexo_nombre: string
  estado_civil_id: number
  estado_civil_nombre: string
  nacionalidad_fallecido: string
  lugar_fallecimiento: string
  observaciones: string | null
  carta_defuncion: string | null
  es_nn: boolean
  registrador_id: string | null
}

interface SexoItem {
  id: number
  slug: string
  nombre: string
}

interface EstadoCivilItem {
  id: number
  slug: string
  nombre: string
}

const requiredFields = [
  'nombres_fallecido', 'apellido_paterno_fallecido', 'fecha_nacimiento_fallecido',
  'fecha_fallecimiento', 'sexo_id', 'estado_civil_id', 'nacionalidad_fallecido',
  'lugar_fallecimiento',
]

export default function RegistroFallecido() {
  const page = usePage()
  const fallecidos = (page.props.fallecidos as any) ?? null
  const sexosList = (page.props.sexos as SexoItem[]) ?? []
  const estadosCivilesList = (page.props.estadosCiviles as EstadoCivilItem[]) ?? []
  const { addToast } = useToastContext()

  const moduloPerfiles = (page.props.modulo_perfiles as Record<string, string> | undefined) ?? {}
  const perfil = moduloPerfiles['cementerio-registro-fallecido'] ?? 'superadmin'
  const canCreate = perfil !== 'auditor'
  const canEdit = perfil === 'superadmin' || perfil === 'admin'
  const canEditRut = perfil === 'superadmin'
  const canDelete = perfil === 'superadmin'
  const canViewForm = perfil !== 'auditor'
  const canViewDetail = perfil !== 'auditor'
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    rut_fallecido: '',
    nombres_fallecido: '',
    apellido_paterno_fallecido: '',
    apellido_materno_fallecido: '',
    fecha_nacimiento_fallecido: '',
    fecha_fallecimiento: '',
    sexo_id: '',
    estado_civil_id: '',
    nacionalidad_fallecido: 'Chile',
    lugar_fallecimiento: '',
    observaciones: '',
    es_nn: false,
    registrador_id: '',
    carta_defuncion: null as File | null,
  })

  const sexoOptions = useMemo(
    () => sexosList.map((s) => ({ value: String(s.id), label: s.nombre })),
    [sexosList],
  )
  const estadoCivilOptions = useMemo(
    () => estadosCivilesList.map((e) => ({ value: String(e.id), label: e.nombre })),
    [estadosCivilesList],
  )

  const [showConfirm, setShowConfirm] = useState<'clear' | 'cancel' | null>(null)
  const [dirty, setDirty] = useState(false)
  const [esNn, setEsNn] = useState(false)
  const [editando, setEditando] = useState<FallecidoRow | null>(null)
  const [rutDuplicadoError, setRutDuplicadoError] = useState<string | null>(null)
  const [showConfirmGuardar, setShowConfirmGuardar] = useState(false)

  const handleRutBlur = async () => {
    const rut = form.data.rut_fallecido
    if (!rut || esNn) {
      setRutDuplicadoError(null)
      return
    }

    try {
      const res = await fetch(`/cementerio/verificar-rut?rut=${encodeURIComponent(rut.trim())}`)
      const data = await res.json()
      if (data.exists) {
        setRutDuplicadoError('Ya existe registro de fallecido asociado a este RUT')
      } else {
        setRutDuplicadoError(null)
      }
    } catch {
      setRutDuplicadoError(null)
    }
  }

  const nnDisabled = esNn

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
    if (!esNn && !String((form.data as any).rut_fallecido ?? '').trim()) {
      newErrors.rut_fallecido = 'Este campo es obligatorio'
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
    form.post(route('cementerio.registro-fallecido.store') as string, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        form.reset()
        setEsNn(false)
        setRutDuplicadoError(null)
        setDirty(false)
        addToast({ title: 'Fallecido registrado', description: 'El registro se ha guardado correctamente.', variant: 'default' })
      },
      onError: (errs: Record<string, string>) => {
        addToast({ title: 'Error de validación', description: 'Corrige los campos marcados en rojo.', variant: 'destructive' })
      },
    })
  }

  const handleLimpiar = () => {
    const hasData = Object.entries(form.data).some(([k, v]) => {
      if (k === 'es_nn' || k === 'carta_defuncion') return false
      return String(v ?? '').trim() !== ''
    })
    if (hasData) { setShowConfirm('clear'); return }
    form.reset()
    setEsNn(false)
    setDirty(false)
  }

  const handleCancelar = () => {
    if (dirty) { setShowConfirm('cancel'); return }
    window.history.back()
  }

  const confirmClear = () => {
    form.reset()
    setEsNn(false)
    setRutDuplicadoError(null)
    setDirty(false)
    setShowConfirm(null)
    addToast({ title: 'Formulario limpiado', variant: 'default' })
  }

  const abrirEdicion = (f: FallecidoRow) => {
    setEditando(f)
  }

  const fallecidosList: FallecidoRow[] = fallecidos?.data ?? []

  return (
    <>
      <Head title="Cementerio - Registro de Fallecido" />

      <div className="animate-fade-in-up space-y-6">
        <Breadcrumbs items={[{ label: 'Cementerio' }, { label: 'Registro de Fallecido' }]} />

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Registro de Fallecido</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ingresa los datos del fallecido para registrar en el sistema.
          </p>
        </div>

        {canViewForm && (
          <>
            <CardSection title="Datos del Fallecido" icon={User} iconColor="primary">
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    RUT
                    {!esNn && <span className="text-destructive">*</span>}
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      value={nnDisabled ? '' : form.data.rut_fallecido}
                      onChange={(e) => {
                        set('rut_fallecido', e.target.value)
                        setRutDuplicadoError(null)
                      }}
                      onBlur={handleRutBlur}
                      placeholder="Ej: 12.345.678-9"
                      disabled={nnDisabled}
                      autoComplete="off"
                      className={formErrors.rut_fallecido || rutDuplicadoError ? 'border-destructive' : ''}
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <Checkbox
                        id="es_nn"
                        checked={esNn}
                        onCheckedChange={(checked) => {
                          setEsNn(!!checked)
                          setRutDuplicadoError(null)
                          form.setData('es_nn', !!checked)
                          if (checked) form.setData('rut_fallecido', '')
                        }}
                      />
                      <Label htmlFor="es_nn" className="text-sm whitespace-nowrap cursor-pointer">
                        ¿Es NN (Sin RUT)?
                      </Label>
                    </div>
                  </div>
                  {formErrors.rut_fallecido && (
                    <p className="text-sm text-destructive">{formErrors.rut_fallecido}</p>
                  )}
                  {rutDuplicadoError && (
                    <p className="text-sm text-destructive">{rutDuplicadoError}</p>
                  )}
                  {esNn && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Se generará código NN automáticamente al guardar.
                    </p>
                  )}
                </div>

                <FormInput
                  label="Nombres" required autoComplete="off"
                  value={form.data.nombres_fallecido}
                  onChange={(e) => set('nombres_fallecido', e.target.value)}
                  error={formErrors.nombres_fallecido}
                />
                <FormInput
                  label="Apellido Paterno" required autoComplete="off"
                  value={form.data.apellido_paterno_fallecido}
                  onChange={(e) => set('apellido_paterno_fallecido', e.target.value)}
                  error={formErrors?.apellido_paterno_fallecido}
                />
                <FormInput
                  label="Apellido Materno" autoComplete="off"
                  value={form.data.apellido_materno_fallecido}
                  onChange={(e) => set('apellido_materno_fallecido', e.target.value)}
                />
                <FormInput
                  label="Fecha de Nacimiento" required type="date" autoComplete="off"
                  value={form.data.fecha_nacimiento_fallecido}
                  onChange={(e) => set('fecha_nacimiento_fallecido', e.target.value)}
                  error={formErrors?.fecha_nacimiento_fallecido}
                />
                <FormInput
                  label="Fecha de Fallecimiento" required type="date" autoComplete="off"
                  value={form.data.fecha_fallecimiento}
                  onChange={(e) => set('fecha_fallecimiento', e.target.value)}
                  error={formErrors?.fecha_fallecimiento}
                />
                <FormSelect
                  label="Sexo" required
                  value={String(form.data.sexo_id)}
                  onValueChange={(v) => set('sexo_id', v)}
                  options={sexoOptions}
                  error={formErrors?.sexo_id}
                />
                <FormSelect
                  label="Estado Civil" required
                  value={String(form.data.estado_civil_id)}
                  onValueChange={(v) => set('estado_civil_id', v)}
                  options={estadoCivilOptions}
                  error={formErrors?.estado_civil_id}
                />
                <FormSelect
                  label="Nacionalidad" required
                  value={form.data.nacionalidad_fallecido}
                  onValueChange={(v) => set('nacionalidad_fallecido', v)}
                  options={nacionalidades}
                  error={formErrors?.nacionalidad_fallecido}
                />
                <FormInput
                  label="Lugar de Fallecimiento" required autoComplete="off"
                  value={form.data.lugar_fallecimiento}
                  onChange={(e) => set('lugar_fallecimiento', e.target.value)}
                  error={formErrors?.lugar_fallecimiento}
                />
              </div>
            </CardSection>

            <CardSection title="Información Adicional" icon={FileText} iconColor="secondary">
              <div className="grid gap-5 md:grid-cols-2">
                <FormTextarea
                  label="Observaciones"
                  autoComplete="off"
                  value={form.data.observaciones}
                  onChange={(e) => set('observaciones', e.target.value)}
                  placeholder="Notas adicionales..."
                  rows={3}
                />
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">Adjuntar Certificado de Defunción</Label>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
                    className="group cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-3 transition-all hover:border-primary/50 hover:bg-primary/5"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      autoComplete="off"
                      className="hidden"
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0] ?? null
                        form.setData('carta_defuncion', file)
                      }}
                    />
                    {(form.data.carta_defuncion as unknown as File | null) ? (
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">
                            {((form.data.carta_defuncion as unknown as File)?.name ?? 'Archivo seleccionado')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {((form.data.carta_defuncion as unknown as File)?.size
                              ? ((form.data.carta_defuncion as unknown as File).size / 1024 / 1024).toFixed(1) + ' MB'
                              : '')}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            form.setData('carta_defuncion', null as unknown as File)
                            if (fileInputRef.current) fileInputRef.current.value = ''
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted-foreground/10 text-muted-foreground group-hover:text-primary">
                          <Paperclip className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="text-primary font-medium">Haz clic</span> para seleccionar
                          </p>
                          <p className="text-xs text-muted-foreground">PDF hasta 10 MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {formErrors?.carta_defuncion && (
                    <p className="text-xs text-destructive">{formErrors.carta_defuncion}</p>
                  )}
                </div>
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
          </>
        )}

        {/* Historial Fallecidos */}
        <CardSection title="Historial Fallecidos" icon={FileText} iconColor="primary">
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>RUT / NN</TableHead>
                  <TableHead>Nombre Completo</TableHead>
<TableHead>Fecha Nacimiento</TableHead>
<TableHead>Fecha Fallecimiento</TableHead>
                  <TableHead>Sexo</TableHead>
                  <TableHead>Estado Civil</TableHead>
                  <TableHead>Nacionalidad</TableHead>
                  <TableHead>Lugar Fallecimiento</TableHead>
                  <TableHead>Observaciones</TableHead>
                  <TableHead>Carta Defunción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fallecidosList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                      No hay fallecidos registrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  fallecidosList.map((f) => (
                    <TableRow
                      key={f.id}
                      onClick={canEdit ? () => abrirEdicion(f) : undefined}
                      className={canEdit ? 'cursor-pointer' : ''}
                    >
                      <TableCell className="whitespace-nowrap font-medium">
                        {f.rut_fallecido ?? f.codigo_nn ?? '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">{f.nombre_completo}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {f.fecha_nacimiento_fallecido
                          ? (() => { const [y, m, d] = f.fecha_nacimiento_fallecido.split('-'); return `${d}-${m}-${y}` })()
                          : '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {f.fecha_fallecimiento
                          ? (() => { const [y, m, d] = f.fecha_fallecimiento.split('-'); return `${d}-${m}-${y}` })()
                          : '-'}
                      </TableCell>
                      <TableCell>{f.sexo_nombre}</TableCell>
                      <TableCell>{f.estado_civil_nombre}</TableCell>
                      <TableCell>{f.nacionalidad_fallecido}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{f.lugar_fallecimiento}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{f.observaciones || '-'}</TableCell>
                      <TableCell className="whitespace-nowrap font-mono text-xs">
                        {f.carta_defuncion ?? '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginacion */}
          {fallecidos?.meta?.last_page > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Mostrando {fallecidos?.meta?.from ?? 0} a {fallecidos?.meta?.to ?? 0} de {fallecidos?.meta?.total ?? 0} registros
              </p>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={fallecidos?.meta?.current_page === 1}
                  onClick={() => {
                    const url = new URL(window.location.href)
                    url.searchParams.set('page', String((fallecidos?.meta?.current_page ?? 1) - 1))
                    window.location.href = url.toString()
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: fallecidos?.meta?.last_page ?? 1 }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === fallecidos?.meta?.current_page ? 'default' : 'outline'}
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
                  disabled={fallecidos?.meta?.current_page === fallecidos?.meta?.last_page}
                  onClick={() => {
                    const url = new URL(window.location.href)
                    url.searchParams.set('page', String((fallecidos?.meta?.current_page ?? 1) + 1))
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
              <p className="font-medium break-words">{esNn ? 'NN (Sin RUT)' : (form.data.rut_fallecido || '—')}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Fecha Nacimiento</span>
              <p className="font-medium break-words">{form.data.fecha_nacimiento_fallecido || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Nacionalidad</span>
              <p className="font-medium break-words">{form.data.nacionalidad_fallecido || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Nombres</span>
              <p className="font-medium break-words">{form.data.nombres_fallecido || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Fecha Fallecimiento</span>
              <p className="font-medium break-words">{form.data.fecha_fallecimiento || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Lugar Fallecimiento</span>
              <p className="font-medium break-words">{form.data.lugar_fallecimiento || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Apellido Paterno</span>
              <p className="font-medium break-words">{form.data.apellido_paterno_fallecido || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Sexo</span>
              <p className="font-medium break-words">{sexoOptions.find(o => o.value === form.data.sexo_id)?.label || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Observaciones</span>
              <p className="font-medium break-words">{form.data.observaciones || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Apellido Materno</span>
              <p className="font-medium break-words">{form.data.apellido_materno_fallecido || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Estado Civil</span>
              <p className="font-medium break-words">{estadoCivilOptions.find(o => o.value === form.data.estado_civil_id)?.label || '—'}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Certificado</span>
              <p className="font-medium break-words">{form.data.carta_defuncion?.name || 'No adjuntado'}</p>
            </div>
          </div>
        </div>
      </ConfirmDialog>

      {canEdit && (
        <EditarFallecidoModal
          open={editando !== null}
          onOpenChange={(open) => { if (!open) setEditando(null) }}
          fallecido={editando}
          sexos={sexosList}
          estadosCiviles={estadosCivilesList}
          canEditRut={canEditRut}
          onSuccess={() => setEditando(null)}
        />
      )}
    </>
  )
}

RegistroFallecido.layout = (page: ReactNode) => (
  <AppLayout title="Registro de Fallecido" children={page} />
)
