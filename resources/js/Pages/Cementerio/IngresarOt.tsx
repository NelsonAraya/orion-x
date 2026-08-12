import { useState, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Head, Link, router, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Breadcrumbs } from '@/Components/shared/Breadcrumbs'
import { CardSection } from '@/Components/shared/CardSection'
import { FormInput } from '@/Components/forms/FormInput'
import { FormSelect } from '@/Components/forms/FormSelect'
import { Label } from '@/Components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select'
import { ActionButtons } from '@/Components/shared/ActionButtons'
import { useToastContext } from '@/Components/ToastProvider'
import Swal from 'sweetalert2'
import { ConfirmDialog } from '@/Components/ConfirmDialog'
import { OtDetalleModal } from '@/Components/cementerio/OtDetalleModal'

import { Button } from '@/Components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'
import {
  User,
  Building2,
  Wrench,
  MapPin,
  DollarSign,
  Search,
  Minus,
  Plus,
  Save,
  X,
  Loader,
  Info,
  Phone,
  Paperclip,
  FileText,
  AlertTriangle,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface ServicioItem {
  id: number
  nombre: string
  valor_servicio: number
}

interface FormData {
  // Seccion 1: Fallecido
  fallecido_search: string
  fallecido_seleccionado: string
  fallecido_id: number | null
  // Seccion 2: Responsable Financiero
  rf_rut: string
  rf_direccion: string
  rf_relacion: string
  rf_nombre: string
  rf_telefono: string
  rf_correo: string
  primer_contacto_nombre: string
  primer_contacto_telefono: string
  primer_contacto_correo: string
  segundo_contacto_nombre: string
  segundo_contacto_telefono: string
  segundo_contacto_correo: string
  // Documentos adjuntos
  documento_adjunto: File | null
  documento_deudor: File | null
  // Seccion 4: Servicio
  tipo_financiamiento: string
  servicios: { id: number; cantidad: number }[]
  // Seccion 3: Ubicacion
  sector: string
  tipo_ubicacion: string
  patio: string
  calle: string
  lote: string
  numero_cuotas: string
}

const initialForm: FormData = {
  fallecido_search: '',
  fallecido_seleccionado: '',
  fallecido_id: null,
  rf_rut: '',
  rf_direccion: '',
  rf_relacion: '',
  rf_nombre: '',
  rf_telefono: '',
  rf_correo: '',
  primer_contacto_nombre: '',
  primer_contacto_telefono: '',
  primer_contacto_correo: '',
  segundo_contacto_nombre: '',
  segundo_contacto_telefono: '',
  segundo_contacto_correo: '',
  tipo_financiamiento: '',
  servicios: [],
  documento_adjunto: null,
  documento_deudor: null,
  sector: '',
  tipo_ubicacion: '',
  patio: '',
  calle: '',
  lote: '',
  numero_cuotas: '',
}

const requiredFields: (keyof FormData)[] = [
  'fallecido_seleccionado',
  'rf_rut',
  'rf_nombre',
  'rf_direccion',
  'rf_telefono',
  'rf_correo',
  'rf_relacion',
  'primer_contacto_nombre',
  'primer_contacto_telefono',
  'primer_contacto_correo',
  'tipo_financiamiento',
]

export default function IngresarOt() {
  const page = usePage()
  const relacionesData = (page.props.relaciones as { id: number; nombre_relacion: string }[]) ?? []
  const financiamientosData = (page.props.financiamientos as { id: number; nombre: string; valor_arriendo: number }[]) ?? []
  const serviciosData = (page.props.servicios as ServicioItem[]) ?? []
  const sectoresData = (page.props.sectores as { id: number; nombre: string }[]) ?? []
  const tiposUbicacionData = (page.props.tipos_ubicacion as { id: number; nombre: string }[]) ?? []
  const [form, setForm] = useState<FormData>({ ...initialForm })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showConfirm, setShowConfirm] = useState<'cancel' | null>(null)
  const [showConfirmGuardar, setShowConfirmGuardar] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [selectedFallecidoData, setSelectedFallecidoData] = useState<any | null>(null)
  const [deudorSearchResults, setDeudorSearchResults] = useState<any[]>([])
  const [deudorSearching, setDeudorSearching] = useState(false)
  const [deudorSeleccionado, setDeudorSeleccionado] = useState<any | null>(null)
  const [createdOtNumber, setCreatedOtNumber] = useState('')
  const [otModalOpen, setOtModalOpen] = useState(false)
  const { addToast } = useToastContext()
  const moduloPerfiles = (page.props.modulo_perfiles as Record<string, string> | undefined) ?? {}
  const perfil = moduloPerfiles['cementerio-ingresar-ot'] ?? 'superadmin'
  const canCreate = perfil !== 'auditor'
  const fileInputRef = useRef<HTMLInputElement>(null)
  const deudorFileInputRef = useRef<HTMLInputElement>(null)

  const relacionesOptions = useMemo(
    () => relacionesData.map((r) => ({ value: String(r.id), label: r.nombre_relacion })),
    [relacionesData],
  )

  const sectoresOptions = useMemo(
    () => sectoresData.map((s) => ({ value: String(s.id), label: s.nombre })),
    [sectoresData],
  )

  const tiposUbicacionOptions = useMemo(
    () => tiposUbicacionData.map((t) => ({ value: String(t.id), label: t.nombre })),
    [tiposUbicacionData],
  )

  const [searchResults, setSearchResults] = useState<any[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const q = form.fallecido_search.trim()
    if (!q) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/cementerio/buscar-fallecidos?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setSearchResults(data)
      } catch {
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [form.fallecido_search])

  useEffect(() => {
    const q = form.rf_rut.trim()
    if (!q || deudorSeleccionado) {
      setDeudorSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setDeudorSearching(true)
      try {
        const res = await fetch(`/cementerio/buscar-deudores?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        setDeudorSearchResults(data)
      } catch {
        setDeudorSearchResults([])
      } finally {
        setDeudorSearching(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [form.rf_rut, deudorSeleccionado])

  const selectDeudor = (d: any) => {
    setForm((prev) => ({
      ...prev,
      rf_rut: `${d.rut}-${d.dv}`,
      rf_direccion: d.direccion_deudor,
      rf_nombre: d.nombre_completo_deudor,
      rf_telefono: d.telefono_deudor,
      rf_correo: d.correo_electronico_deudor,
      primer_contacto_nombre: d.contacto?.nombre_contacto1 ?? '',
      primer_contacto_telefono: d.contacto?.telefono_contacto1 ?? '',
      primer_contacto_correo: d.contacto?.correo_contacto1 ?? '',
      segundo_contacto_nombre: d.contacto?.nombre_contacto2 ?? '',
      segundo_contacto_telefono: d.contacto?.telefono_contacto2 ?? '',
      segundo_contacto_correo: d.contacto?.correo_contacto2 ?? '',
    }))
    setDeudorSeleccionado(d)
    setDeudorSearchResults([])
    setDirty(true)
  }

  const limpiarDeudor = () => {
    setForm((prev) => ({
      ...prev,
      rf_rut: '',
      rf_direccion: '',
      rf_nombre: '',
      rf_telefono: '',
      rf_correo: '',
      primer_contacto_nombre: '',
      primer_contacto_telefono: '',
      primer_contacto_correo: '',
      segundo_contacto_nombre: '',
      segundo_contacto_telefono: '',
      segundo_contacto_correo: '',
      documento_deudor: null,
    }))
    setDeudorSeleccionado(null)
  }

  const set = (key: keyof FormData, value: string | number | File | null) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
    if (errors[key as string]) {
      setErrors((prev) => ({ ...prev, [key as string]: '' }))
    }
  }

  const getCantidad = (id: number): number =>
    form.servicios.find((s) => s.id === id)?.cantidad ?? 0

  const setCantidad = (id: number, cantidad: number) => {
    setForm((prev) => {
      if (cantidad <= 0) {
        return { ...prev, servicios: prev.servicios.filter((s) => s.id !== id) }
      }
      const exists = prev.servicios.find((s) => s.id === id)
      if (exists) {
        return {
          ...prev,
          servicios: prev.servicios.map((s) => (s.id === id ? { ...s, cantidad } : s)),
        }
      }
      return { ...prev, servicios: [...prev.servicios, { id, cantidad }] }
    })
    setDirty(true)
    if (errors.servicios) {
      setErrors((prev) => ({ ...prev, servicios: '' }))
    }
  }

  const incCantidad = (id: number) => setCantidad(id, getCantidad(id) + 1)
  const decCantidad = (id: number) => {
    const current = getCantidad(id)
    if (current > 0) setCantidad(id, current - 1)
  }

  const selectFallecido = (f: any) => {
    set('fallecido_seleccionado', f.nombre_completo)
    set('fallecido_id', f.id)
    set('fallecido_search', '')
    setSearchResults([])
    fetch(`/cementerio/fallecido/${f.id}/detalle`)
      .then((res) => res.json())
      .then((data) => setSelectedFallecidoData(data))
      .catch(() => setSelectedFallecidoData(null))
  }

  const serviciosSeleccionados = serviciosData
    .map((s) => ({
      ...s,
      cantidad: form.servicios.find((sv) => sv.id === s.id)?.cantidad ?? 0,
    }))
    .filter((s) => s.cantidad > 0)
  const financiamientoSeleccionado = financiamientosData.find((f) => String(f.id) === form.tipo_financiamiento)

  const valorArriendo = financiamientoSeleccionado?.valor_arriendo ?? 0
  const subtotalServicios = serviciosSeleccionados.reduce((sum, s) => sum + s.valor_servicio * s.cantidad, 0)
  const subtotal = valorArriendo + subtotalServicios
  const iva = Math.round(subtotal * 0.19)
  const totalGeneral = subtotal + iva

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    for (const field of requiredFields) {
      if (!String(form[field] ?? '').trim()) {
        newErrors[field] = 'Este campo es obligatorio'
      }
    }
    if (form.servicios.length === 0) {
      newErrors.servicios = 'Debes seleccionar al menos un servicio'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleGuardar = () => {
    if (!validate()) {
      addToast({
        title: 'Error de validación',
        description: 'Corrige los campos marcados en rojo.',
        variant: 'destructive',
      })
      return
    }
    setShowConfirmGuardar(true)
  }

  const confirmGuardar = () => {
    setShowConfirmGuardar(false)
    router.post(route('cementerio.ingresar-ot.store') as string, {
      fallecido_id: form.fallecido_id,
      rf_rut: form.rf_rut,
      rf_direccion: form.rf_direccion,
      rf_nombre: form.rf_nombre,
      rf_telefono: form.rf_telefono,
      rf_correo: form.rf_correo,
      rf_relacion: form.rf_relacion,
      primer_contacto_nombre: form.primer_contacto_nombre,
      primer_contacto_telefono: form.primer_contacto_telefono,
      primer_contacto_correo: form.primer_contacto_correo,
      segundo_contacto_nombre: form.segundo_contacto_nombre,
      segundo_contacto_telefono: form.segundo_contacto_telefono,
      segundo_contacto_correo: form.segundo_contacto_correo,
      tipo_financiamiento: form.tipo_financiamiento,
      servicios: form.servicios,
      sector: form.sector || null,
      tipo_ubicacion: form.tipo_ubicacion || null,
      patio: form.patio || null,
      calle: form.calle || null,
      lote: form.lote || null,
      numero_cuotas: form.numero_cuotas || null,
      documento_adjunto: form.documento_adjunto,
      documento_deudor: form.documento_deudor,
    }, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: (visit: any) => {
        const flashSuccess = (visit.props as any)?.flash?.success as string | undefined
        const otNumber = flashSuccess?.replace(' creada correctamente.', '') ?? ''

        setForm({ ...initialForm })
        setDirty(false)
        setSelectedFallecidoData(null)
        setDeudorSeleccionado(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
        if (deudorFileInputRef.current) deudorFileInputRef.current.value = ''

        Swal.fire({
          icon: 'success',
          title: '¡OT Creada!',
          html: `
            <div style="margin:16px 0">
              <p style="color:#6b7280;margin-bottom:12px">La orden de trabajo ha sido registrada exitosamente.</p>
              <div style="background:#f0f5ff;border-radius:12px;padding:20px;display:inline-block;width:100%;box-sizing:border-box">
                <p style="font-size:13px;color:#6b7280;margin-bottom:4px">N° de Orden</p>
                <p style="font-size:40px;font-weight:700;color:#2563eb;letter-spacing:2px;margin:0">${otNumber}</p>
              </div>
            </div>
          `,
          showConfirmButton: true,
          confirmButtonText: 'Cerrar',
          showDenyButton: true,
          denyButtonText: 'Ver OT',
          showCancelButton: true,
          cancelButtonText: 'Imprimir',
          confirmButtonColor: '#2563eb',
          denyButtonColor: '#059669',
          cancelButtonColor: '#6b7280',
          buttonsStyling: true,
          reverseButtons: false,
          customClass: {
            popup: 'rounded-xl',
            confirmButton: 'rounded-lg px-6',
            denyButton: 'rounded-lg px-6',
            cancelButton: 'rounded-lg px-6',
          },
        }).then((result) => {
          if (result.isDenied) {
            setCreatedOtNumber(otNumber)
            setOtModalOpen(true)
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            window.open(route('cementerio.ot.imprimir', { ot: otNumber }) as string, '_blank')
          }
        })
      },
      onError: (errs) => {
        if (errs.duplicate_ot) {
          Swal.fire({
            icon: 'warning',
            title: 'Orden de Trabajo En Proceso',
            html: errs.duplicate_ot.replace(/(N°)(OT-\d+)/, '$1<strong>$2</strong>'),
            confirmButtonText: 'Cerrar',
          })
          return
        }
        setErrors(errs as Record<string, string>)
        addToast({
          title: 'Error de validación',
          description: 'Corrige los campos marcados en rojo.',
          variant: 'destructive',
        })
      },
    })
  }

  const handleCancelar = () => {
    if (dirty) {
      setShowConfirm('cancel')
      return
    }
    window.history.back()
  }

  const seccionDelay = (i: number) => ({
    style: { animationDelay: `${i * 0.1}s` },
  })

  return (
    <>
      <Head title="Cementerio - Ingresar OT" />

      <div className="animate-fade-in-up space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Cementerio' },
            { label: 'Orden de Trabajo' },
            { label: 'Ingresar OT' },
          ]}
        />

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Ingresar Orden de Trabajo
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Completa los datos para generar una nueva orden de trabajo.
          </p>
        </div>

        {/* Seccion 1: Fallecido */}
        <div
          className={`animate-fade-in-up ${selectedFallecidoData ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : ''}`}
          {...seccionDelay(0)}
        >
          <CardSection title="Fallecido" icon={User} iconColor="primary">
            <div className="space-y-4">
              <div className="relative">
                <FormInput
                  label="Buscar Fallecido"
                  value={form.fallecido_search}
                  onChange={(e) => set('fallecido_search', e.target.value)}
                  placeholder="Buscar por RUT o nombre..."
                />
                <Search className="absolute right-3 top-9 h-4 w-4 text-muted-foreground" />
              </div>

              {form.fallecido_search.trim() && searching && (
                <div className="flex items-center gap-2 rounded-md border p-3 text-sm text-muted-foreground">
                  <Loader className="h-4 w-4 animate-spin" />
                  Buscando...
                </div>
              )}

              {form.fallecido_search.trim() && !searching && searchResults.length > 0 && (
                <div className="space-y-2 rounded-md border p-3">
                  {searchResults.map((f: any) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => selectFallecido(f)}
                      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                    >
                      <span className="font-medium text-muted-foreground">
                        {f.identificador}
                      </span>
                      <span>
                        {f.nombre_completo}
                      </span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {f.fecha_fallecimiento}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {form.fallecido_search.trim() && !searching && searchResults.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No se encontraron fallecidos con ese RUT o nombre.
                </p>
              )}

              {form.fallecido_seleccionado && (
                <div className="flex items-center justify-between rounded-md border border-primary/20 bg-primary/5 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <span className="font-medium">
                      {form.fallecido_seleccionado}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      set('fallecido_seleccionado', '')
                      set('fallecido_id', null)
                      setSelectedFallecidoData(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="flex justify-center">
                <Link href="/cementerio/registro-fallecido">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Fallecido
                  </Button>
                </Link>
              </div>

              {(errors.fallecido_seleccionado || errors.fallecido_id) && (
                <p className="text-xs text-destructive">
                  {errors.fallecido_seleccionado ?? errors.fallecido_id}
                </p>
              )}
            </div>
          </CardSection>

          {selectedFallecidoData && (
            <CardSection title="Datos del Fallecido" icon={Info} iconColor="primary">
              <div className="grid gap-x-8 gap-y-2 md:grid-cols-2">
                <div className="flex gap-2 text-sm">
                  <span className="font-medium text-muted-foreground shrink-0">Identificador:</span>
                  <span>{selectedFallecidoData.identificador}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="font-medium text-muted-foreground shrink-0">Nombre Completo:</span>
                  <span>{selectedFallecidoData.nombre_completo}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="font-medium text-muted-foreground shrink-0">Fecha Nac.:</span>
                  <span>{selectedFallecidoData.fecha_nacimiento_fallecido}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="font-medium text-muted-foreground shrink-0">Fecha Fallecimiento:</span>
                  <span>{selectedFallecidoData.fecha_fallecimiento}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="font-medium text-muted-foreground shrink-0">Sexo:</span>
                  <span className="capitalize">{selectedFallecidoData.sexo_nombre}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="font-medium text-muted-foreground shrink-0">Estado Civil:</span>
                  <span className="capitalize">{selectedFallecidoData.estado_civil_nombre}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="font-medium text-muted-foreground shrink-0">Nacionalidad:</span>
                  <span>{selectedFallecidoData.nacionalidad_fallecido}</span>
                </div>
                <div className="flex gap-2 text-sm">
                  <span className="font-medium text-muted-foreground shrink-0">Lugar Fallecimiento:</span>
                  <span>{selectedFallecidoData.lugar_fallecimiento}</span>
                </div>
                {selectedFallecidoData.observaciones && (
                  <div className="flex gap-2 text-sm md:col-span-2">
                    <span className="font-medium text-muted-foreground shrink-0">Observaciones:</span>
                    <span>{selectedFallecidoData.observaciones}</span>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="mb-2 text-sm font-medium">Documento Adjunto</p>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => fileInputRef.current?.click()}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click() }}
                    className="group cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-5 transition-all hover:border-primary/50 hover:bg-primary/5"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      autoComplete="off"
                      className="hidden"
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0] ?? null
                        set('documento_adjunto', file)
                      }}
                    />
                    {form.documento_adjunto ? (
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">{form.documento_adjunto.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(form.documento_adjunto.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            set('documento_adjunto', null)
                            if (fileInputRef.current) fileInputRef.current.value = ''
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted-foreground/10 text-muted-foreground group-hover:text-primary">
                          <Paperclip className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            <span className="text-primary">Haz clic</span> para seleccionar un archivo
                          </p>
                          <p className="text-xs text-muted-foreground">PDF hasta 20 MB</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" className="mt-1 gap-2">
                          <Paperclip className="h-4 w-4" />
                          Seleccionar archivo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardSection>
          )}
        </div>

        {/* Seccion 2: Responsable Financiero */}
        <div className="animate-fade-in-up" {...seccionDelay(2)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardSection
              title="Responsable Financiero"
              icon={Building2}
              iconColor="secondary"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <FormInput
                    label="RUT"
                    required
                    autoComplete="off"
                    value={form.rf_rut}
                    onChange={(e) => {
                      if (deudorSeleccionado) limpiarDeudor()
                      set('rf_rut', e.target.value)
                    }}
                    placeholder="EJ: 12345678-9"
                    error={errors.rf_rut}
                  />
                  <p className="text-xs text-muted-foreground">Sin Puntos y con Guion</p>

                  {form.rf_rut.trim() && deudorSearching && (
                    <div className="flex items-center gap-2 rounded-md border p-3 text-sm text-muted-foreground">
                      <Loader className="h-4 w-4 animate-spin" />
                      Buscando deudor...
                    </div>
                  )}

                  {form.rf_rut.trim() && !deudorSearching && deudorSearchResults.length > 0 && !deudorSeleccionado && (
                    <div className="space-y-2 rounded-md border p-3">
                      {deudorSearchResults.map((d: any) => (
                        <button
                          key={d.rut}
                          type="button"
                          onClick={() => selectDeudor(d)}
                          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                        >
                          <span className="font-medium text-muted-foreground">{d.rut}-{d.dv}</span>
                          <span>{d.nombre_completo_deudor}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {form.rf_rut.trim() && !deudorSearching && deudorSearchResults.length === 0 && !deudorSeleccionado && (
                    <p className="text-sm text-muted-foreground">
                      No se encontró deudor. Completa los datos manualmente.
                    </p>
                  )}
                </div>
                <FormInput
                  label="Nombre"
                  required
                  autoComplete="off"
                  value={form.rf_nombre}
                  onChange={(e) => set('rf_nombre', e.target.value)}
                  error={errors.rf_nombre}
                />
                <FormInput
                  label="Dirección"
                  required
                  autoComplete="off"
                  value={form.rf_direccion}
                  onChange={(e) => set('rf_direccion', e.target.value)}
                  error={errors.rf_direccion}
                />
                <FormInput
                  label="Teléfono"
                  required
                  autoComplete="off"
                  value={form.rf_telefono}
                  onChange={(e) => set('rf_telefono', e.target.value)}
                  error={errors.rf_telefono}
                />
                <FormInput
                  label="Correo"
                  required
                  type="email"
                  autoComplete="off"
                  value={form.rf_correo}
                  onChange={(e) => set('rf_correo', e.target.value)}
                  error={errors.rf_correo}
                />
                <FormSelect
                  label="Relación con el Fallecido"
                  required
                  value={form.rf_relacion}
                  onValueChange={(v) => set('rf_relacion', v)}
                  options={relacionesOptions}
                  error={errors.rf_relacion}
                />

                <div>
                  <p className="mb-2 text-sm font-medium">Carnet (fotocopia ambas caras)</p>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => deudorFileInputRef.current?.click()}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') deudorFileInputRef.current?.click() }}
                    className="group cursor-pointer rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-3 transition-all hover:border-primary/50 hover:bg-primary/5"
                  >
                    <input
                      ref={deudorFileInputRef}
                      type="file"
                      accept=".pdf"
                      autoComplete="off"
                      className="hidden"
                      onChange={(e) => {
                        const file = (e.target as HTMLInputElement).files?.[0] ?? null
                        set('documento_deudor', file)
                      }}
                    />
                    {form.documento_deudor ? (
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">{form.documento_deudor.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(form.documento_deudor.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            set('documento_deudor', null)
                            if (deudorFileInputRef.current) deudorFileInputRef.current.value = ''
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
                          <p className="text-xs text-muted-foreground">PDF hasta 20 MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {deudorSeleccionado && (
                  <div className="flex items-center justify-between rounded-md border border-primary/20 bg-primary/5 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-primary" />
                      <span className="font-medium">
                        {deudorSeleccionado.nombre_completo_deudor}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={limpiarDeudor}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardSection>

              <div className="flex flex-col h-full justify-between gap-4">
              <CardSection title="Contacto" icon={Phone} iconColor="secondary">
                <div className="space-y-4">
                  <FormInput
                    label="Nombre"
                    required
                    autoComplete="off"
                    value={form.primer_contacto_nombre}
                    onChange={(e) => set('primer_contacto_nombre', e.target.value)}
                    error={errors.primer_contacto_nombre}
                  />
                  <FormInput
                    label="Teléfono"
                    required
                    autoComplete="off"
                    value={form.primer_contacto_telefono}
                    onChange={(e) => set('primer_contacto_telefono', e.target.value)}
                    error={errors.primer_contacto_telefono}
                  />
                  <FormInput
                    label="Correo"
                    required
                    type="email"
                    autoComplete="off"
                    value={form.primer_contacto_correo}
                    onChange={(e) => set('primer_contacto_correo', e.target.value)}
                    error={errors.primer_contacto_correo}
                  />
                </div>
              </CardSection>

              <CardSection title="Contacto" icon={Phone} iconColor="secondary">
                <div className="space-y-4">
                  <FormInput
                    label="Nombre"
                    autoComplete="off"
                    value={form.segundo_contacto_nombre}
                    onChange={(e) => set('segundo_contacto_nombre', e.target.value)}
                    error={errors.segundo_contacto_nombre}
                  />
                  <FormInput
                    label="Teléfono"
                    autoComplete="off"
                    value={form.segundo_contacto_telefono}
                    onChange={(e) => set('segundo_contacto_telefono', e.target.value)}
                    error={errors.segundo_contacto_telefono}
                  />
                  <FormInput
                    label="Correo"
                    type="email"
                    autoComplete="off"
                    value={form.segundo_contacto_correo}
                    onChange={(e) => set('segundo_contacto_correo', e.target.value)}
                    error={errors.segundo_contacto_correo}
                  />
                </div>
              </CardSection>
            </div>
          </div>
        </div>

        {/* Seccion 3: Ubicacion */}
        <div className="animate-fade-in-up" {...seccionDelay(3)}>
          <CardSection title="Ubicación" icon={MapPin} iconColor="secondary">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
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
                autoComplete="off"
                value={form.patio}
                onChange={(e) => set('patio', e.target.value)}
              />
              <FormInput
                label="Calle"
                autoComplete="off"
                value={form.calle}
                onChange={(e) => set('calle', e.target.value)}
              />
              <FormInput
                label="Lote"
                autoComplete="off"
                value={form.lote}
                onChange={(e) => set('lote', e.target.value)}
              />
            </div>
          </CardSection>
        </div>

        {/* Seccion 4: Servicio */}
        <div className="animate-fade-in-up" {...seccionDelay(4)}>
          <CardSection title="Servicio Solicitado" icon={Wrench} iconColor="primary">
            <div className="space-y-6">
              <div className="md:w-1/2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Tipo Financiamiento <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.tipo_financiamiento}
                    onValueChange={(v) => set('tipo_financiamiento', v)}
                  >
                    <SelectTrigger
                      className={errors.tipo_financiamiento ? 'border-destructive focus-visible:ring-destructive' : ''}
                    >
                      <SelectValue placeholder="Seleccionar tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {financiamientosData.map((f) => (
                        <SelectItem key={f.id} value={String(f.id)}>
                          <span className="flex w-full items-center justify-between gap-4">
                            <span>{f.nombre}</span>
                            {f.valor_arriendo > 0 && (
                              <span className="text-muted-foreground tabular-nums">
                                {formatCurrency(f.valor_arriendo)}
                              </span>
                            )}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.tipo_financiamiento && (
                    <p className="text-xs text-destructive">{errors.tipo_financiamiento}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium">
                  Servicios <span className="text-destructive">*</span>
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {serviciosData.map((servicio) => {
                    const cantidad = getCantidad(servicio.id)
                    const selected = cantidad > 0
                    return (
                      <div
                        key={servicio.id}
                        className={`flex items-center gap-2 rounded-md border p-3 text-sm transition-colors ${
                          selected
                            ? 'border-primary bg-primary/5'
                            : 'hover:bg-accent'
                        }`}
                      >
                        <span className="flex-1 font-medium">{servicio.nombre}</span>
                        <span className="text-muted-foreground">
                          {formatCurrency(servicio.valor_servicio)}
                        </span>
                        <div className="ml-2 flex items-center gap-1">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); decCantidad(servicio.id) }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium tabular-nums">
                            {cantidad}
                          </span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); incCantidad(servicio.id) }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {errors.servicios && (
                  <p className="mt-2 text-xs text-destructive">
                    {errors.servicios}
                  </p>
                )}
              </div>
            </div>
          </CardSection>
        </div>

        {/* Seccion 5: Informacion Financiera */}
        <div className="animate-fade-in-up" {...seccionDelay(5)}>
          <CardSection
            title="Información Financiera"
            icon={DollarSign}
            iconColor="primary"
          >
            <div className="space-y-6">
              <div className="rounded-md border">
                <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Concepto</TableHead>
                          <TableHead className="text-right">Cant.</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                  <TableBody>
                      {!form.tipo_financiamiento && serviciosSeleccionados.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            className="py-8 text-center text-sm text-muted-foreground"
                          >
                            Selecciona un tipo de financiamiento y al menos un servicio para ver el resumen financiero.
                          </TableCell>
                        </TableRow>
                      ) : (
                        <>
                          {valorArriendo > 0 && (
                            <TableRow key="financiamiento" className="bg-muted/30">
                              <TableCell className="font-medium">
                                {financiamientoSeleccionado?.nombre}
                              </TableCell>
                              <TableCell className="text-right">—</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(valorArriendo)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(valorArriendo)}
                              </TableCell>
                            </TableRow>
                          )}
                          {serviciosSeleccionados.map((s) => (
                            <TableRow key={s.id}>
                              <TableCell>{s.nombre}</TableCell>
                              <TableCell className="text-right">{s.cantidad}</TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(s.valor_servicio)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(s.valor_servicio * s.cantidad)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      )}
                  </TableBody>
                </Table>
              </div>

              <div className="max-w-xs">
                <FormInput
                  label="Número de Cuotas"
                  type="number"
                  min={1}
                  value={form.numero_cuotas}
                  onChange={(e) => set('numero_cuotas', e.target.value)}
                  error={errors.numero_cuotas}
                />
              </div>

              <div className="ml-auto w-full max-w-xs space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IVA (19%)</span>
                  <span>{formatCurrency(iva)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <span>Total General</span>
                  <span className="text-primary">
                    {formatCurrency(totalGeneral)}
                  </span>
                </div>
              </div>
            </div>
          </CardSection>
        </div>

        <ActionButtons
          primary={{
            label: 'Guardar OT',
            icon: Save,
            onClick: handleGuardar,
            disabled: !canCreate,
          }}
          secondary={[
            {
              label: 'Cancelar',
              icon: X,
              variant: 'ghost',
              onClick: handleCancelar,
            },
          ]}
        />
      </div>

      <OtDetalleModal
        open={otModalOpen}
        onOpenChange={setOtModalOpen}
        otNumber={createdOtNumber}
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
        title="¿Está seguro que todos los datos están correctos?"
        message="Por favor, revise que todos los datos estén ingresados correctamente"
        confirmText="Guardar"
        cancelText="Cancelar"
        icon={<AlertTriangle className="h-6 w-6 text-amber-500" />}
        onConfirm={confirmGuardar}
        onCancel={() => setShowConfirmGuardar(false)}
      />
    </>
  )
}

IngresarOt.layout = (page: ReactNode) => (
  <AppLayout title="Ingresar OT" children={page} />
)
