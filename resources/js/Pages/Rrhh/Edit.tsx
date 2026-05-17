import { type ReactNode, useState } from 'react'
import { Head, Link, useForm, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/Components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/Components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Badge } from '@/Components/ui/badge'
import {
  ArrowLeft,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Building2,
  Plus,
  Trash2,
  FileText,
  AlertTriangle,
  ClipboardList,
  Shield,
  Award,
} from 'lucide-react'
import { useToastContext } from '@/Components/ToastProvider'
import { ConfirmDialog } from '@/Components/ConfirmDialog'
import { cn } from '@/lib/utils'
import type { CatalogItem } from '@/types'

interface OrdenItem {
  id: number
  ott_display: string
  tipo_orden: string | null
  tipo_contrato: string | null
  fecha_inicio: string
  fecha_termino: string | null
  jornada_horas: number | null
  centro_costo: string | null
  nivel: string | null
  afp: string | null
  prevision: string | null
  estado: string | null
  creado_por: string | null
  created_at: string
}

interface PermisoItem {
  id: number
  permiso_display: string
  tipo_permiso: string | null
  fecha_inicio: string
  fecha_termino: string | null
  jornada: string | null
  bloques_consumidos: number | null
  detalle: string
  dias_solicitados: number
  detalles: Array<{ fecha: string; jornada: string; bloques: number }>
  motivo: string
  estado: string | null
  fecha_gestion: string | null
  gestionado_por: string | null
  observacion_rechazo: string | null
  creado_por: string | null
  created_at: string
}

interface VacacionItem {
  id: number
  fecha_inicio: string
  fecha_termino: string
  dias_solicitados: number
  periodos: Array<{ periodo_numero: number; dias_consumidos: number }>
  motivo: string
  estado: string | null
  fecha_gestion: string | null
  gestionado_por: string | null
  observacion_rechazo: string | null
  observacion_anulacion: string | null
  creado_por: string | null
  created_at: string
}

interface PeriodoVacacion {
  numero: number
  inicio: string
  fin: string
  anio: number
  dias_correspondientes: number
  dias_usados: number
}

interface UserData {
  id: number
  rut_formateado: string
  nombres: string
  apellido_paterno: string
  apellido_materno: string | null
  email: string
  sexo_id: number | null
  nacionalidad_id: number | null
  profesion_id: number | null
  prevision_id: number | null
  afp_id: number | null
  estado_id: number | null
  fecha_nacimiento: string | null
  telefono: string | null
  direccion: string | null
  fecha_ingreso: string | null
}

interface Props {
  user: UserData
  ordenes: OrdenItem[]
  lista_permisos: PermisoItem[]
  sexos: CatalogItem[]
  nacionalidades: CatalogItem[]
  profesiones: CatalogItem[]
  previsiones: CatalogItem[]
  afps: CatalogItem[]
  estados: CatalogItem[]
  tipos_orden: CatalogItem[]
  tipos_contrato: CatalogItem[]
  centros_costo: CatalogItem[]
  estados_ott: CatalogItem[]
  tipos_permiso: CatalogItem[]
  estados_permiso: CatalogItem[]
  bloques_anuales: { usados: number; total: number }
  vacaciones: VacacionItem[]
  periodos_vacaciones: PeriodoVacacion[]
  permisos_sistema: Array<{ id: number; nombre: string; slug: string; descripcion: string }>
  user_permisos: string[]
}

export default function Edit({
  user,
  ordenes,
  lista_permisos,
  sexos,
  nacionalidades,
  profesiones,
  previsiones,
  afps,
  estados,
  tipos_orden,
  tipos_contrato,
  centros_costo,
  tipos_permiso,
  bloques_anuales,
  vacaciones,
  periodos_vacaciones,
  permisos_sistema = [],
  user_permisos = [],
}: Props) {
  const [activeTab, setActiveTab] = useState('datos-personales')
  const [ottModalOpen, setOttModalOpen] = useState(false)
  const [permisoModalOpen, setPermisoModalOpen] = useState(false)
  const [vacacionModalOpen, setVacacionModalOpen] = useState(false)
  const [rechazoVacacionDialog, setRechazoVacacionDialog] = useState<{ open: boolean; vacacionId: number; observacion: string }>({ open: false, vacacionId: 0, observacion: '' })
  const [anularVacacionDialog, setAnularVacacionDialog] = useState<{ open: boolean; vacacionId: number; observacion: string }>({ open: false, vacacionId: 0, observacion: '' })
  const [confirmAction, setConfirmAction] = useState<{ type: 'update' } | { type: 'create-ott' } | { type: 'delete-ott'; ordenId: number } | { type: 'create-permiso' } | { type: 'delete-permiso'; permisoId: number } | { type: 'aceptar-permiso'; permisoId: number } | { type: 'create-vacacion' } | { type: 'delete-vacacion'; vacacionId: number } | { type: 'aceptar-vacacion'; vacacionId: number } | { type: 'create-vacacion-historico' } | { type: 'update-permisos-sistema' } | null>(null)
  const [rechazoDialog, setRechazoDialog] = useState<{ open: boolean; permisoId: number; observacion: string }>({ open: false, permisoId: 0, observacion: '' })
  const { addToast } = useToastContext()

  const { data, setData, patch, processing, errors } = useForm({
    nombres: user.nombres,
    apellido_paterno: user.apellido_paterno,
    apellido_materno: user.apellido_materno ?? '',
    email: user.email,
    sexo_id: String(user.sexo_id ?? ''),
    nacionalidad_id: String(user.nacionalidad_id ?? ''),
    profesion_id: String(user.profesion_id ?? ''),
    prevision_id: String(user.prevision_id ?? ''),
    afp_id: String(user.afp_id ?? ''),
    estado_id: String(user.estado_id ?? ''),
    fecha_nacimiento: user.fecha_nacimiento ?? '',
    telefono: user.telefono ?? '',
    direccion: user.direccion ?? '',
    fecha_ingreso: user.fecha_ingreso ?? '',
  })

  const ottForm = useForm({
    tipo_orden_id: '',
    tipo_contrato_id: '',
    afp_id: '',
    prevision_id: '',
    fecha_inicio: '',
    fecha_termino: '',
    jornada_horas: '',
    centro_costo_id: '',
    nivel: '',
  })

  const permisoForm = useForm({
    tipo_permiso_id: '',
    fecha_inicio: '',
    fecha_termino: '',
    jornada: '',
    motivo: '',
    detalles: [] as Array<{ fecha: string; jornada: string }>,
  })

  const vacacionForm = useForm({
    fecha_inicio: '',
    fecha_termino: '',
    motivo: '',
  })

  const [vacacionHistoricoModalOpen, setVacacionHistoricoModalOpen] = useState(false)
  const vacacionHistoricoForm = useForm({
    dias: '',
  })

  const [userPermisosEdit, setUserPermisosEdit] = useState<string[]>([...user_permisos])
  const permisosSistemaForm = useForm({
    permisos: user_permisos,
  })

  const handleConfirm = () => {
    if (!confirmAction) return
    switch (confirmAction.type) {
      case 'update':
        patch(route('rrhh.update', user.id), {
          onSuccess: () => addToast({ title: 'Guardado', description: 'Datos actualizados correctamente.' }),
        })
        break
      case 'create-ott':
        ottForm.post(route('rrhh.ordenes.store', user.id), {
          onSuccess: () => {
            ottForm.reset()
            addToast({ title: 'Creada', description: 'Orden de trabajo creada correctamente.' })
          },
          onError: () => setOttModalOpen(true),
        })
        break
      case 'delete-ott':
        router.delete(route('rrhh.ordenes.destroy', confirmAction.ordenId), {
          preserveScroll: true,
          onSuccess: () => addToast({ title: 'Eliminada', description: 'Orden de trabajo eliminada correctamente.' }),
        })
        break
      case 'create-permiso':
        permisoForm.post(route('rrhh.permisos.store', user.id), {
          onSuccess: () => {
            permisoForm.reset()
            addToast({ title: 'Creado', description: 'Permiso creado correctamente.' })
          },
          onError: () => setPermisoModalOpen(true),
        })
        break
      case 'delete-permiso':
        router.delete(route('rrhh.permisos.destroy', confirmAction.permisoId), {
          preserveScroll: true,
          onSuccess: () => addToast({ title: 'Eliminado', description: 'Permiso eliminado correctamente.' }),
        })
        break
      case 'aceptar-permiso':
        router.patch(route('rrhh.permisos.aceptar', confirmAction.permisoId), {}, {
          preserveScroll: true,
          onSuccess: () => addToast({ title: 'Aceptado', description: 'Permiso aceptado correctamente.' }),
        })
        break
      case 'create-vacacion':
        vacacionForm.post(route('rrhh.vacaciones.store', user.id), {
          onSuccess: () => {
            vacacionForm.reset()
            addToast({ title: 'Creada', description: 'Solicitud de vacaciones creada correctamente.' })
          },
          onError: () => setVacacionModalOpen(true),
        })
        break
      case 'create-vacacion-historico':
        vacacionHistoricoForm.post(route('rrhh.vacaciones.historico', user.id), {
          onSuccess: () => {
            vacacionHistoricoForm.reset()
            addToast({ title: 'Registradas', description: 'Vacaciones históricas registradas correctamente.' })
          },
          onError: () => setVacacionHistoricoModalOpen(true),
        })
        break
      case 'delete-vacacion':
        router.delete(route('rrhh.vacaciones.destroy', confirmAction.vacacionId), {
          preserveScroll: true,
          onSuccess: () => addToast({ title: 'Eliminada', description: 'Solicitud de vacaciones eliminada correctamente.' }),
        })
        break
      case 'aceptar-vacacion':
        router.patch(route('rrhh.vacaciones.aceptar', confirmAction.vacacionId), {}, {
          preserveScroll: true,
          onSuccess: () => addToast({ title: 'Aceptada', description: 'Vacaciones aceptadas correctamente.' }),
        })
        break
      case 'update-permisos-sistema':
        router.patch(route('rrhh.permisos-sistema', user.id), {
          permisos: userPermisosEdit,
        }, {
          preserveScroll: true,
          onSuccess: () => addToast({ title: 'Permisos', description: 'Permisos actualizados correctamente.' }),
        })
        break
    }
    setConfirmAction(null)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setConfirmAction({ type: 'update' })
  }

  const submitOtt = (e: React.FormEvent) => {
    e.preventDefault()
    setOttModalOpen(false)
    setTimeout(() => setConfirmAction({ type: 'create-ott' }), 0)
  }

  const deleteOtt = (ordenId: number) => {
    setConfirmAction({ type: 'delete-ott', ordenId })
  }

  const submitPermiso = (e: React.FormEvent) => {
    e.preventDefault()
    setPermisoModalOpen(false)
    setTimeout(() => setConfirmAction({ type: 'create-permiso' }), 0)
  }

  const deletePermiso = (permisoId: number) => {
    setConfirmAction({ type: 'delete-permiso', permisoId })
  }

  const aceptarPermiso = (permisoId: number) => {
    setConfirmAction({ type: 'aceptar-permiso', permisoId })
  }

  const rechazarPermiso = (permisoId: number) => {
    setRechazoDialog({ open: true, permisoId, observacion: '' })
  }

  const submitVacacion = (e: React.FormEvent) => {
    e.preventDefault()
    setVacacionModalOpen(false)
    setTimeout(() => setConfirmAction({ type: 'create-vacacion' }), 0)
  }

  const submitVacacionHistorico = (e: React.FormEvent) => {
    e.preventDefault()
    setVacacionHistoricoModalOpen(false)
    setTimeout(() => setConfirmAction({ type: 'create-vacacion-historico' }), 0)
  }

  const submitPermisosSistema = (e: React.FormEvent) => {
    e.preventDefault()
    permisosSistemaForm.setData('permisos', userPermisosEdit)
    setConfirmAction({ type: 'update-permisos-sistema' })
  }

  const deleteVacacion = (vacacionId: number) => {
    setConfirmAction({ type: 'delete-vacacion', vacacionId })
  }

  const aceptarVacacion = (vacacionId: number) => {
    setConfirmAction({ type: 'aceptar-vacacion', vacacionId })
  }

  const rechazarVacacion = (vacacionId: number) => {
    setRechazoVacacionDialog({ open: true, vacacionId, observacion: '' })
  }

  const anularVacacion = (vacacionId: number) => {
    setAnularVacacionDialog({ open: true, vacacionId, observacion: '' })
  }

  const estadoBadge = (estado: string | null) => {
    if (!estado) return <Badge variant="outline">Sin estado</Badge>
    const map: Record<string, string> = {
      Ingresada: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'En Proceso': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      Finalizada: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Cancelada: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    }
    return (
      <Badge className={map[estado] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}>
        {estado}
      </Badge>
    )
  }

  const estadoPermisoBadge = (estado: string | null) => {
    if (!estado) return <Badge variant="outline">Sin estado</Badge>
    const map: Record<string, string> = {
      Ingresada: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      Aceptada: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      Rechazada: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      Anulada: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    }
    return (
      <Badge className={map[estado] ?? 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'}>
        {estado}
      </Badge>
    )
  }

  return (
    <>
      <Head title="RRHH - Editar Usuario" />

      <div className="animate-fade-in-up space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/rrhh">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {user.nombres} {user.apellido_paterno}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {user.rut_formateado} &middot; {user.email}
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full flex-wrap sm:flex-nowrap gap-1 justify-start h-auto min-h-9">
            <TabsTrigger value="datos-personales" className="gap-2 w-[calc(33.33%-4px)] sm:w-auto min-h-[40px]">
              <User className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Datos Personales</span>
              <span className="inline sm:hidden">Datos</span>
            </TabsTrigger>
            <TabsTrigger value="info-laboral" className="gap-2 w-[calc(33.33%-4px)] sm:w-auto min-h-[40px]">
              <Briefcase className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Información Laboral</span>
              <span className="inline sm:hidden">Laboral</span>
            </TabsTrigger>
            <TabsTrigger value="ordenes" className="gap-2 w-[calc(33.33%-4px)] sm:w-auto min-h-[40px]">
              <FileText className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Órdenes Trabajo</span>
              <span className="inline sm:hidden">Órdenes</span>
              {ordenes.length > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {ordenes.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="permisos" className="gap-2 w-[calc(33.33%-4px)] sm:w-auto min-h-[40px]">
              <ClipboardList className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Permisos</span>
              <span className="inline sm:hidden">Permisos</span>
              {lista_permisos.length > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {lista_permisos.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="vacaciones" className="gap-2 w-[calc(33.33%-4px)] sm:w-auto min-h-[40px]">
              <Calendar className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Vacaciones</span>
              <span className="inline sm:hidden">Vac.</span>
              {vacaciones.length > 0 && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {vacaciones.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="merito" className="gap-2 w-[calc(33.33%-4px)] sm:w-auto min-h-[40px]">
              <Award className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Mérito / Demérito</span>
              <span className="inline sm:hidden">Mérito</span>
            </TabsTrigger>
            <TabsTrigger value="sistema" className="gap-2 w-[calc(33.33%-4px)] sm:w-auto min-h-[40px]">
              <Shield className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Sistema</span>
              <span className="inline sm:hidden">Sistema</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="datos-personales" className="mt-6 animate-fade-in-up">
            <form onSubmit={submit} autoComplete="off">
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Datos Personales</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Información básica del usuario.
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="id" className="flex items-center gap-1.5">
                        RUT
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="id"
                        value={user.rut_formateado}
                        disabled
                        className="font-mono opacity-60"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        Correo Electrónico
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="correo@ejemplo.cl"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        autoComplete="off"
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombres" className="flex items-center gap-1.5">
                        Nombres
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="nombres"
                        placeholder="Nombres del usuario"
                        value={data.nombres}
                        onChange={(e) => setData('nombres', e.target.value)}
                        autoComplete="off"
                      />
                      {errors.nombres && (
                        <p className="text-xs text-destructive">{errors.nombres}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="apellido_paterno" className="flex items-center gap-1.5">
                        Apellido Paterno
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="apellido_paterno"
                        placeholder="Apellido paterno"
                        value={data.apellido_paterno}
                        onChange={(e) => setData('apellido_paterno', e.target.value)}
                        autoComplete="off"
                      />
                      {errors.apellido_paterno && (
                        <p className="text-xs text-destructive">{errors.apellido_paterno}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="apellido_materno">Apellido Materno</Label>
                      <Input
                        id="apellido_materno"
                        placeholder="Apellido materno (opcional)"
                        value={data.apellido_materno}
                        onChange={(e) => setData('apellido_materno', e.target.value)}
                        autoComplete="off"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefono" className="flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        Teléfono
                      </Label>
                      <Input
                        id="telefono"
                        placeholder="+56 9 1234 5678"
                        value={data.telefono}
                        onChange={(e) => setData('telefono', e.target.value)}
                        autoComplete="off"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sexo_id">Sexo</Label>
                      <Select
                        value={data.sexo_id}
                        onValueChange={(v) => setData('sexo_id', v)}
                      >
                        <SelectTrigger id="sexo_id">
                          <SelectValue placeholder="Seleccionar sexo" />
                        </SelectTrigger>
                        <SelectContent>
                          {sexos.map((s) => (
                            <SelectItem key={s.id} value={String(s.id)}>
                              {s.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nacionalidad_id">Nacionalidad</Label>
                      <Select
                        value={data.nacionalidad_id}
                        onValueChange={(v) => setData('nacionalidad_id', v)}
                      >
                        <SelectTrigger id="nacionalidad_id">
                          <SelectValue placeholder="Seleccionar nacionalidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {nacionalidades.map((n) => (
                            <SelectItem key={n.id} value={String(n.id)}>
                              {n.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fecha_nacimiento" className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        Fecha de Nacimiento
                      </Label>
                      <Input
                        id="fecha_nacimiento"
                        type="date"
                        value={data.fecha_nacimiento}
                        onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                        autoComplete="off"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="direccion" className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        Dirección
                      </Label>
                      <textarea
                        id="direccion"
                        placeholder="Dirección del usuario"
                        value={data.direccion}
                        onChange={(e) => setData('direccion', e.target.value)}
                        rows={2}
                        className="flex min-h-[36px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Button type="submit" disabled={processing} className="gap-2 min-w-[160px]">
                      {processing ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Guardando...
                        </span>
                      ) : (
                        'Guardar Cambios'
                      )}
                    </Button>
                    <Link href="/rrhh">
                      <Button type="button" variant="ghost">
                        Cancelar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="info-laboral" className="mt-6 animate-fade-in-up">
            <form onSubmit={submit} autoComplete="off">
              <Card>
                <CardHeader className="flex flex-row items-center gap-3 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/20">
                    <Briefcase className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <CardTitle>Información Laboral</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Datos relacionados al ámbito laboral del usuario.
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profesion_id">Profesión</Label>
                      <Select
                        value={data.profesion_id}
                        onValueChange={(v) => setData('profesion_id', v)}
                      >
                        <SelectTrigger id="profesion_id">
                          <SelectValue placeholder="Seleccionar profesión" />
                        </SelectTrigger>
                        <SelectContent>
                          {profesiones.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prevision_id">Previsión</Label>
                      <Select
                        value={data.prevision_id}
                        onValueChange={(v) => setData('prevision_id', v)}
                      >
                        <SelectTrigger id="prevision_id">
                          <SelectValue placeholder="Seleccionar previsión" />
                        </SelectTrigger>
                        <SelectContent>
                          {previsiones.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="afp_id">
                        <Building2 className="mr-1.5 inline h-3.5 w-3.5 text-muted-foreground" />
                        AFP
                      </Label>
                      <Select
                        value={data.afp_id}
                        onValueChange={(v) => setData('afp_id', v)}
                      >
                        <SelectTrigger id="afp_id">
                          <SelectValue placeholder="Seleccionar AFP" />
                        </SelectTrigger>
                        <SelectContent>
                          {afps.map((a) => (
                            <SelectItem key={a.id} value={String(a.id)}>
                              {a.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estado_id">Estado</Label>
                      <Select
                        value={data.estado_id}
                        onValueChange={(v) => setData('estado_id', v)}
                      >
                        <SelectTrigger id="estado_id">
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {estados.map((e) => (
                            <SelectItem key={e.id} value={String(e.id)}>
                              {e.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 md:max-w-xs">
                    <Label htmlFor="fecha_ingreso" className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      Fecha de Ingreso
                    </Label>
                    <Input
                      id="fecha_ingreso"
                      type="date"
                      value={data.fecha_ingreso}
                      onChange={(e) => setData('fecha_ingreso', e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Button type="submit" disabled={processing} className="gap-2 min-w-[160px]">
                      {processing ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Guardando...
                        </span>
                      ) : (
                        'Guardar Cambios'
                      )}
                    </Button>
                    <Link href="/rrhh">
                      <Button type="button" variant="ghost">
                        Cancelar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="ordenes" className="mt-6 animate-fade-in-up">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/20">
                    <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle>Órdenes de Trabajo</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {ordenes.length} orden(es) registrada(s) para este usuario.
                    </p>
                  </div>
                </div>
                <Button onClick={() => setOttModalOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nueva Orden
                </Button>
              </CardHeader>
              <CardContent>
                {ordenes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">No hay órdenes de trabajo registradas.</p>
                    <Button variant="outline" className="mt-4 gap-2" onClick={() => setOttModalOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Crear primera orden
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>OTT</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Contrato</TableHead>
                          <TableHead>Inicio</TableHead>
                          <TableHead>Término</TableHead>
                          <TableHead>Horas</TableHead>
                          <TableHead>C. Costo</TableHead>
                          <TableHead>Nivel</TableHead>
                          <TableHead>AFP</TableHead>
                          <TableHead>Previsión</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Creado por</TableHead>
                          <TableHead className="w-[80px]">Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ordenes.map((o) => (
                          <TableRow key={o.id}>
                            <TableCell className="font-medium">{o.ott_display}</TableCell>
                            <TableCell>{o.tipo_orden}</TableCell>
                            <TableCell>{o.tipo_contrato}</TableCell>
                            <TableCell>{o.fecha_inicio}</TableCell>
                            <TableCell>{o.fecha_termino ?? <span className="text-muted-foreground">—</span>}</TableCell>
                            <TableCell>{o.jornada_horas ?? <span className="text-muted-foreground">—</span>}</TableCell>
                            <TableCell>{o.centro_costo}</TableCell>
                            <TableCell>{o.nivel}</TableCell>
                            <TableCell>{o.afp}</TableCell>
                            <TableCell>{o.prevision}</TableCell>
                            <TableCell>{estadoBadge(o.estado)}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{o.creado_por}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => deleteOtt(o.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permisos" className="mt-6 animate-fade-in-up">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-950/20">
                    <ClipboardList className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <CardTitle>Permisos</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {lista_permisos.length} permiso(s) registrado(s) para este usuario.
                    </p>
                  </div>
                </div>
                <Button onClick={() => setPermisoModalOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Permiso
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Card resumen bloques Con Goce de Sueldo */}
                {bloques_anuales.total > 0 && (
                  <div className="rounded-lg border bg-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Con Goce de Sueldo {new Date().getFullYear()}</span>
                      <span className="text-sm text-muted-foreground">
                        {bloques_anuales.usados}/{bloques_anuales.total} bloques usados
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          bloques_anuales.usados >= bloques_anuales.total
                            ? 'bg-destructive'
                            : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min((bloques_anuales.usados / bloques_anuales.total) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {lista_permisos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ClipboardList className="h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">No hay permisos registrados.</p>
                    <Button variant="outline" className="mt-4 gap-2" onClick={() => setPermisoModalOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Crear primer permiso
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>PERM</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead>Detalle</TableHead>
                          <TableHead className="text-center">Días / Bloques</TableHead>
                          <TableHead>Motivo</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Gestión</TableHead>
                          <TableHead>Observación</TableHead>
                          <TableHead className="w-[80px]">Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {lista_permisos.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-medium">{p.permiso_display}</TableCell>
                            <TableCell>{p.tipo_permiso}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{p.detalle}</TableCell>
                            <TableCell className="text-center">
                              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {p.bloques_consumidos ?? p.dias_solicitados}
                                {p.bloques_consumidos ? ' bloque(s)' : ' día(s)'}
                              </span>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={p.motivo}>
                              {p.motivo}
                            </TableCell>
                            <TableCell>{estadoPermisoBadge(p.estado)}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {p.fecha_gestion ? (
                                <span>{p.fecha_gestion} por {p.gestionado_por}</span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate text-xs text-muted-foreground" title={p.observacion_rechazo ?? ''}>
                              {p.observacion_rechazo ?? <span className="text-muted-foreground">—</span>}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {p.estado === 'Ingresada' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20"
                                      onClick={() => aceptarPermiso(p.id)}
                                    >
                                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                      onClick={() => rechazarPermiso(p.id)}
                                    >
                                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                      </svg>
                                    </Button>
                                    <div className="w-px h-4 bg-border mx-0.5" />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => deletePermiso(p.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vacaciones" className="mt-6 animate-fade-in-up">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/20">
                    <Calendar className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <CardTitle>Vacaciones</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {vacaciones.length} solicitude(s) registrada(s).
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 max-sm:flex-col">
                  <Button variant="secondary" onClick={() => setVacacionHistoricoModalOpen(true)} className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Registrar Histórico</span>
                    <span className="inline sm:hidden">Histórico</span>
                  </Button>
                  <Button onClick={() => setVacacionModalOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Nueva Solicitud</span>
                    <span className="inline sm:hidden">Solicitar</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {periodos_vacaciones.length > 0 && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Desde</TableHead>
                          <TableHead>Hasta</TableHead>
                          <TableHead className="text-center">Año Servicio</TableHead>
                          <TableHead className="text-center">Corresponde</TableHead>
                          <TableHead className="text-center">Usados</TableHead>
                          <TableHead className="text-center">Restantes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {periodos_vacaciones.map((p) => (
                          <TableRow key={p.numero}>
                            <TableCell className="text-xs text-muted-foreground">{p.inicio}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{p.fin}</TableCell>
                            <TableCell className="text-center font-medium">{p.numero}° año</TableCell>
                            <TableCell className="text-center font-medium">{p.dias_correspondientes} días</TableCell>
                            <TableCell className="text-center">{p.dias_usados}</TableCell>
                            <TableCell className="text-center">
                              <span className={`font-medium ${p.dias_correspondientes - p.dias_usados > 0 ? 'text-green-600' : 'text-destructive'}`}>
                                {p.dias_correspondientes - p.dias_usados}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {vacaciones.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">No hay solicitudes de vacaciones.</p>
                    <Button variant="outline" className="mt-4 gap-2" onClick={() => setVacacionModalOpen(true)}>
                      <Plus className="h-4 w-4" />
                      Crear primera solicitud
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>#</TableHead>
                          <TableHead>Período</TableHead>
                          <TableHead>Inicio</TableHead>
                          <TableHead>Término</TableHead>
                          <TableHead className="text-center">Días</TableHead>
                          <TableHead>Motivo</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Gestión</TableHead>
                          <TableHead>Observación</TableHead>
                          <TableHead className="w-[80px]">Acción</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vacaciones.map((v) => (
                          <TableRow key={v.id}>
                            <TableCell className="font-medium">VAC-{v.id}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-0.5">
                                {v.periodos.map((p) => (
                                  <span key={p.periodo_numero} className="text-xs">
                                    Per. {p.periodo_numero}: {p.dias_consumidos} día(s)
                                  </span>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{v.fecha_inicio}</TableCell>
                            <TableCell>{v.fecha_termino}</TableCell>
                            <TableCell className="text-center">
                              <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                {v.dias_solicitados}
                              </span>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate" title={v.motivo}>
                              {v.motivo}
                            </TableCell>
                            <TableCell>{estadoPermisoBadge(v.estado)}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {v.fecha_gestion ? (
                                <span>{v.fecha_gestion} por {v.gestionado_por}</span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate text-xs text-muted-foreground" title={v.observacion_rechazo ?? v.observacion_anulacion ?? ''}>
                              {v.observacion_rechazo ?? v.observacion_anulacion ?? <span className="text-muted-foreground">—</span>}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {v.estado === 'Ingresada' && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20"
                                      onClick={() => aceptarVacacion(v.id)}
                                    >
                                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                      onClick={() => rechazarVacacion(v.id)}
                                    >
                                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                                      </svg>
                                    </Button>
                                    <div className="w-px h-4 bg-border mx-0.5" />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                      onClick={() => deleteVacacion(v.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                {v.estado === 'Aceptada' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                                    onClick={() => anularVacacion(v.id)}
                                  >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" />
                                    </svg>
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="merito" className="mt-6 animate-fade-in-up">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/20">
                  <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <CardTitle>Mérito / Demérito</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Gestión de méritos y deméritos del usuario.
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Award className="h-12 w-12 text-muted-foreground/40 mb-3" />
                  <p className="text-sm text-muted-foreground">Próximamente.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sistema" className="mt-6 animate-fade-in-up">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <Shield className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle>Permisos del Sistema</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Asigna permisos del sistema a {user.nombres} {user.apellido_paterno}.
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {permisos_sistema && permisos_sistema.length > 0 ? (
                  <form onSubmit={submitPermisosSistema}>
                    <div className="space-y-3">
                      {permisos_sistema.map((permiso) => {
                        const tienePermiso = userPermisosEdit.includes(permiso.slug)
                        return (
                          <div key={permiso.id} className="flex items-center gap-3 rounded-md border p-3">
                            <Shield className="h-5 w-5 shrink-0 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{permiso.nombre}</p>
                              <p className="text-xs text-muted-foreground">{permiso.descripcion}</p>
                            </div>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={tienePermiso}
                              onClick={() => {
                                if (tienePermiso) {
                                  setUserPermisosEdit(userPermisosEdit.filter(s => s !== permiso.slug))
                                } else {
                                  setUserPermisosEdit([...userPermisosEdit, permiso.slug])
                                }
                              }}
                              className={cn(
                                'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                tienePermiso ? 'bg-primary' : 'bg-input'
                              )}
                            >
                              <span className={cn(
                                'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform',
                                tienePermiso ? 'translate-x-5' : 'translate-x-0'
                              )} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <Button type="submit" disabled={permisosSistemaForm.processing} className="gap-2">
                        {permisosSistemaForm.processing ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Guardando...
                          </span>
                        ) : (
                          'Guardar Permisos'
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Shield className="h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">No hay permisos disponibles.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={ottModalOpen} onOpenChange={setOttModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <form onSubmit={submitOtt} autoComplete="off">
            <DialogHeader>
              <DialogTitle>Nueva Orden de Trabajo</DialogTitle>
              <DialogDescription>
                Ingresa los datos de la nueva orden de trabajo para {user.nombres} {user.apellido_paterno}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ott_tipo_orden">
                    Tipo de Orden <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={ottForm.data.tipo_orden_id}
                    onValueChange={(v) => ottForm.setData('tipo_orden_id', v)}
                  >
                    <SelectTrigger id="ott_tipo_orden">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipos_orden.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {ottForm.errors.tipo_orden_id && (
                    <p className="text-xs text-destructive">{ottForm.errors.tipo_orden_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ott_tipo_contrato">
                    Tipo de Contrato <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={ottForm.data.tipo_contrato_id}
                    onValueChange={(v) => ottForm.setData('tipo_contrato_id', v)}
                  >
                    <SelectTrigger id="ott_tipo_contrato">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {tipos_contrato.map((t) => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {ottForm.errors.tipo_contrato_id && (
                    <p className="text-xs text-destructive">{ottForm.errors.tipo_contrato_id}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ott_fecha_inicio">
                    Fecha de Inicio <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="ott_fecha_inicio"
                    type="date"
                    value={ottForm.data.fecha_inicio}
                    onChange={(e) => ottForm.setData('fecha_inicio', e.target.value)}
                  />
                  {ottForm.errors.fecha_inicio && (
                    <p className="text-xs text-destructive">{ottForm.errors.fecha_inicio}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ott_fecha_termino">Fecha de Término</Label>
                  <Input
                    id="ott_fecha_termino"
                    type="date"
                    value={ottForm.data.fecha_termino}
                    onChange={(e) => ottForm.setData('fecha_termino', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ott_jornada_horas">Jornada (horas)</Label>
                  <Input
                    id="ott_jornada_horas"
                    type="number"
                    min="0"
                    step="0.5"
                    placeholder="45"
                    value={ottForm.data.jornada_horas}
                    onChange={(e) => ottForm.setData('jornada_horas', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ott_nivel">Nivel</Label>
                  <Input
                    id="ott_nivel"
                    placeholder="Ej: Profesional"
                    value={ottForm.data.nivel}
                    onChange={(e) => ottForm.setData('nivel', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ott_centro_costo">
                  Centro de Costo <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={ottForm.data.centro_costo_id}
                  onValueChange={(v) => ottForm.setData('centro_costo_id', v)}
                >
                  <SelectTrigger id="ott_centro_costo">
                    <SelectValue placeholder="Seleccionar centro de costo" />
                  </SelectTrigger>
                  <SelectContent>
                    {centros_costo.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {ottForm.errors.centro_costo_id && (
                  <p className="text-xs text-destructive">{ottForm.errors.centro_costo_id}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="ott_afp">AFP</Label>
                  <Select
                    value={ottForm.data.afp_id}
                    onValueChange={(v) => ottForm.setData('afp_id', v)}
                  >
                    <SelectTrigger id="ott_afp">
                      <SelectValue placeholder="Seleccionar AFP" />
                    </SelectTrigger>
                    <SelectContent>
                      {afps.map((a) => (
                        <SelectItem key={a.id} value={String(a.id)}>
                          {a.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ott_prevision">Previsión</Label>
                  <Select
                    value={ottForm.data.prevision_id}
                    onValueChange={(v) => ottForm.setData('prevision_id', v)}
                  >
                    <SelectTrigger id="ott_prevision">
                      <SelectValue placeholder="Seleccionar previsión" />
                    </SelectTrigger>
                    <SelectContent>
                      {previsiones.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOttModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={ottForm.processing} className="gap-2">
                {ottForm.processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creando...
                  </span>
                ) : (
                  'Crear Orden'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={permisoModalOpen} onOpenChange={setPermisoModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={submitPermiso} autoComplete="off">
            <DialogHeader>
              <DialogTitle>Nuevo Permiso</DialogTitle>
              <DialogDescription>
                Ingresa los datos del nuevo permiso para {user.nombres} {user.apellido_paterno}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="perm_tipo">
                  Tipo de Permiso <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={permisoForm.data.tipo_permiso_id}
                  onValueChange={(v) => {
                    const conGoceId = tipos_permiso.find(t => t.nombre === 'Con Goce de Sueldo')?.id
                    const wasConGoce = conGoceId && String(conGoceId) === permisoForm.data.tipo_permiso_id
                    const nowConGoce = conGoceId && String(conGoceId) === v
                    permisoForm.setData({
                      ...permisoForm.data,
                      tipo_permiso_id: v,
                      fecha_termino: nowConGoce ? '' : permisoForm.data.fecha_termino,
                      jornada: wasConGoce && !nowConGoce ? '' : permisoForm.data.jornada,
                      detalles: wasConGoce && !nowConGoce ? [] : permisoForm.data.detalles,
                    })
                  }}
                >
                  <SelectTrigger id="perm_tipo">
                    <SelectValue placeholder="Seleccionar tipo de permiso" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipos_permiso.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {permisoForm.errors.tipo_permiso_id && (
                  <p className="text-xs text-destructive">{permisoForm.errors.tipo_permiso_id}</p>
                )}
              </div>

              {(() => {
                const conGoceId = tipos_permiso.find(t => t.nombre === 'Con Goce de Sueldo')?.id
                const esConGoce = conGoceId && String(conGoceId) === permisoForm.data.tipo_permiso_id

                if (esConGoce) return null

                return (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="perm_fecha_inicio">
                        Fecha de Inicio <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="perm_fecha_inicio"
                        type="date"
                        value={permisoForm.data.fecha_inicio}
                        onChange={(e) => permisoForm.setData('fecha_inicio', e.target.value)}
                      />
                      {permisoForm.errors.fecha_inicio && (
                        <p className="text-xs text-destructive">{permisoForm.errors.fecha_inicio}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perm_fecha_termino">Fecha de Término</Label>
                      <Input
                        id="perm_fecha_termino"
                        type="date"
                        value={permisoForm.data.fecha_termino}
                        onChange={(e) => permisoForm.setData('fecha_termino', e.target.value)}
                      />
                    </div>
                  </div>
                )
              })()}

              {(() => {
                const conGoceId = tipos_permiso.find(t => t.nombre === 'Con Goce de Sueldo')?.id
                const esConGoce = conGoceId && String(conGoceId) === permisoForm.data.tipo_permiso_id
                if (!esConGoce) return null

                const totalBloques = permisoForm.data.detalles.reduce(
                  (sum, d) => sum + (d.jornada === 'completo' ? 2 : d.jornada ? 1 : 0), 0
                )

                const addDetalle = () => {
                  permisoForm.setData('detalles', [
                    ...permisoForm.data.detalles,
                    { fecha: '', jornada: '' },
                  ])
                }

                const removeDetalle = (index: number) => {
                  permisoForm.setData('detalles', permisoForm.data.detalles.filter((_, i) => i !== index))
                }

                const updateDetalle = (index: number, field: 'fecha' | 'jornada', value: string) => {
                  const updated = [...permisoForm.data.detalles]
                  updated[index] = { ...updated[index], [field]: value }
                  permisoForm.setData('detalles', updated)
                }

                return (
                  <div className="space-y-3">
                    <Label>Días del Permiso <span className="text-destructive">*</span></Label>

                    {permisoForm.data.detalles.map((d, i) => (
                      <div key={i} className="flex items-end gap-2">
                        <div className="flex-1 space-y-1">
                          <Input
                            type="date"
                            value={d.fecha}
                            onChange={(e) => updateDetalle(i, 'fecha', e.target.value)}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Select
                            value={d.jornada}
                            onValueChange={(v) => updateDetalle(i, 'jornada', v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Jornada" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mañana">Mañana (1 bloque)</SelectItem>
                              <SelectItem value="tarde">Tarde (1 bloque)</SelectItem>
                              <SelectItem value="completo">Completo (2 bloques)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeDetalle(i)}
                          disabled={permisoForm.data.detalles.length <= 1}
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </Button>
                      </div>
                    ))}

                    {permisoForm.errors.detalles && (
                      <p className="text-xs text-destructive">{permisoForm.errors.detalles as string}</p>
                    )}

                    <Button type="button" variant="outline" size="sm" onClick={addDetalle} className="gap-1">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="M12 5v14" />
                      </svg>
                      Agregar día
                    </Button>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-medium">
                        Total: {totalBloques} bloque(s)
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${bloques_anuales.usados + totalBloques > bloques_anuales.total ? 'bg-destructive' : 'bg-primary'}`}
                            style={{ width: `${Math.min(((bloques_anuales.usados + totalBloques) / bloques_anuales.total) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {bloques_anuales.usados + totalBloques}/{bloques_anuales.total}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })()}

              <div className="space-y-2">
                <Label htmlFor="perm_motivo">
                  Motivo <span className="text-destructive">*</span>
                </Label>
                <textarea
                  id="perm_motivo"
                  placeholder="Describe el motivo del permiso"
                  value={permisoForm.data.motivo}
                  onChange={(e) => permisoForm.setData('motivo', e.target.value)}
                  rows={3}
                  className="flex min-h-[36px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                {permisoForm.errors.motivo && (
                  <p className="text-xs text-destructive">{permisoForm.errors.motivo}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setPermisoModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={permisoForm.processing} className="gap-2">
                {permisoForm.processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creando...
                  </span>
                ) : (
                  'Crear Permiso'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={vacacionModalOpen} onOpenChange={setVacacionModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <form onSubmit={submitVacacion} autoComplete="off">
            <DialogHeader>
              <DialogTitle>Nueva Solicitud de Vacaciones</DialogTitle>
              <DialogDescription>
                Ingresa los datos de la solicitud para {user.nombres} {user.apellido_paterno}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vac_fecha_inicio">
                    Fecha de Inicio <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="vac_fecha_inicio"
                    type="date"
                    value={vacacionForm.data.fecha_inicio}
                    onChange={(e) => vacacionForm.setData('fecha_inicio', e.target.value)}
                  />
                  {vacacionForm.errors.fecha_inicio && (
                    <p className="text-xs text-destructive">{vacacionForm.errors.fecha_inicio}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vac_fecha_termino">
                    Fecha de Término <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="vac_fecha_termino"
                    type="date"
                    value={vacacionForm.data.fecha_termino}
                    onChange={(e) => vacacionForm.setData('fecha_termino', e.target.value)}
                  />
                  {vacacionForm.errors.fecha_termino && (
                    <p className="text-xs text-destructive">{vacacionForm.errors.fecha_termino}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vac_motivo">
                  Motivo <span className="text-destructive">*</span>
                </Label>
                <textarea
                  id="vac_motivo"
                  placeholder="Describe el motivo de tu solicitud"
                  value={vacacionForm.data.motivo}
                  onChange={(e) => vacacionForm.setData('motivo', e.target.value)}
                  rows={3}
                  className="flex min-h-[36px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                {vacacionForm.errors.motivo && (
                  <p className="text-xs text-destructive">{vacacionForm.errors.motivo}</p>
                )}
              </div>

              {periodos_vacaciones.length > 0 && vacacionForm.data.fecha_inicio && vacacionForm.data.fecha_termino && (() => {
                const inicio = new Date(vacacionForm.data.fecha_inicio)
                const termino = new Date(vacacionForm.data.fecha_termino)
                let diff = 0
                let current = new Date(inicio)
                while (current <= termino) {
                  const d = current.getDay()
                  if (d !== 0 && d !== 6) diff++
                  current.setDate(current.getDate() + 1)
                }
                const distribucion: { numero: number; restantes: number; consumir: number }[] = []
                let pendiente = diff
                for (const p of periodos_vacaciones) {
                  const restantes = (p.dias_correspondientes || 0) - (p.dias_usados || 0)
                  if (restantes <= 0) continue
                  const consumir = Math.min(restantes, pendiente)
                  if (consumir <= 0) continue
                  distribucion.push({ numero: p.numero, restantes, consumir })
                  pendiente -= consumir
                }
                if (distribucion.length === 0 && diff === 0) return null
                return (
                  <div className="rounded-md border p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Distribución automática (FIFO) — {diff} día(s) hábil(es):
                    </p>
                    <div className="space-y-1 text-xs">
                      {distribucion.map((d) => (
                        <div key={d.numero} className="flex justify-between">
                          <span>Período {d.numero}° año ({d.restantes} restantes)</span>
                          <span className="font-medium">-{d.consumir} día(s)</span>
                        </div>
                      ))}
                      {pendiente > 0 && (
                        <p className="text-destructive font-medium pt-1 border-t mt-1">
                          ⚠ Faltan {pendiente} día(s) — no hay suficientes períodos disponibles.
                        </p>
                      )}
                    </div>
                  </div>
                )
              })()}
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setVacacionModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={vacacionForm.processing} className="gap-2">
                {vacacionForm.processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creando...
                  </span>
                ) : (
                  'Solicitar Vacaciones'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={vacacionHistoricoModalOpen} onOpenChange={setVacacionHistoricoModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Registro Histórico de Vacaciones</DialogTitle>
            <DialogDescription>
              Registra vacaciones ya tomadas antes del sistema. Los días se descontarán desde el período más antiguo disponible.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submitVacacionHistorico}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="vac_historico_dias">
                  Días a registrar <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="vac_historico_dias"
                  type="number"
                  min={1}
                  placeholder="Ej: 30"
                  value={vacacionHistoricoForm.data.dias}
                  onChange={(e) => vacacionHistoricoForm.setData('dias', e.target.value)}
                />
                {vacacionHistoricoForm.errors.dias && (
                  <p className="text-xs text-destructive">{vacacionHistoricoForm.errors.dias}</p>
                )}
              </div>

              {periodos_vacaciones.length > 0 && (() => {
                const remaining = parseInt(vacacionHistoricoForm.data.dias) || 0
                const distribucion: { numero: number; restantes: number; consumir: number }[] = []
                let pendiente = remaining
                for (const p of periodos_vacaciones) {
                  const restantes = (p.dias_correspondientes || 0) - (p.dias_usados || 0)
                  if (restantes <= 0) continue
                  const consumir = Math.min(restantes, pendiente)
                  if (consumir <= 0) continue
                  distribucion.push({ numero: p.numero, restantes, consumir })
                  pendiente -= consumir
                }
                return (
                  <div className="rounded-md border p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Vista prevía de distribución (FIFO):</p>
                    <div className="space-y-1 text-xs">
                      {distribucion.map((d) => (
                        <div key={d.numero} className="flex justify-between">
                          <span>Período {d.numero}° año ({d.restantes} restantes)</span>
                          <span className="font-medium">-{d.consumir} día(s)</span>
                        </div>
                      ))}
                      {pendiente > 0 && (
                        <p className="text-destructive font-medium pt-1 border-t mt-1">
                          ⚠ Faltan {pendiente} día(s) por distribuir — no hay suficientes períodos.
                        </p>
                      )}
                    </div>
                  </div>
                )
              })()}
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setVacacionHistoricoModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={vacacionHistoricoForm.processing} className="gap-2">
                {vacacionHistoricoForm.processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  'Registrar Histórico'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {confirmAction?.type === 'update' && (
        <ConfirmDialog
          open
          title="¿Guardar cambios?"
          message="Se actualizarán los datos del usuario."
          confirmText="Sí, guardar"
          confirmColor="#1a6bdb"
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {confirmAction?.type === 'create-ott' && (
        <ConfirmDialog
          open
          title="¿Crear orden de trabajo?"
          message="Se agregará una nueva orden de trabajo para este usuario."
          confirmText="Sí, crear"
          confirmColor="#1a6bdb"
          onConfirm={handleConfirm}
          onCancel={() => { setConfirmAction(null); setOttModalOpen(true) }}
        />
      )}

      {confirmAction?.type === 'delete-ott' && (
        <ConfirmDialog
          open
          title="¿Eliminar orden?"
          message="Esta acción no se puede deshacer."
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          confirmColor="#dc2626"
          icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {confirmAction?.type === 'create-permiso' && (
        <ConfirmDialog
          open
          title="¿Crear permiso?"
          message="Se agregará un nuevo permiso para este usuario."
          confirmText="Sí, crear"
          confirmColor="#1a6bdb"
          onConfirm={handleConfirm}
          onCancel={() => { setConfirmAction(null); setPermisoModalOpen(true) }}
        />
      )}

      {confirmAction?.type === 'delete-permiso' && (
        <ConfirmDialog
          open
          title="¿Eliminar permiso?"
          message="Esta acción no se puede deshacer."
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          confirmColor="#dc2626"
          icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {confirmAction?.type === 'aceptar-permiso' && (
        <ConfirmDialog
          open
          title="¿Aceptar permiso?"
          message="El permiso será marcado como aceptado."
          confirmText="Sí, aceptar"
          cancelText="Cancelar"
          confirmColor="#16a34a"
          icon={
            <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      <Dialog open={rechazoDialog.open} onOpenChange={(open) => setRechazoDialog({ ...rechazoDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rechazar Permiso</DialogTitle>
            <DialogDescription>
              Indica el motivo del rechazo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="rechazo_observacion">Observación <span className="text-destructive">*</span></Label>
              <textarea
                id="rechazo_observacion"
                placeholder="Describe el motivo del rechazo"
                value={rechazoDialog.observacion}
                onChange={(e) => setRechazoDialog({ ...rechazoDialog, observacion: e.target.value })}
                rows={3}
                className="flex min-h-[36px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setRechazoDialog({ ...rechazoDialog, open: false })}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={rechazoDialog.observacion.trim().length < 5}
              onClick={() => {
                setRechazoDialog({ ...rechazoDialog, open: false })
                router.patch(route('rrhh.permisos.rechazar', rechazoDialog.permisoId), {
                  observacion_rechazo: rechazoDialog.observacion,
                }, {
                  preserveScroll: true,
                  onSuccess: () => addToast({ title: 'Rechazado', description: 'Permiso rechazado correctamente.' }),
                  onError: () => setRechazoDialog({ ...rechazoDialog, open: true }),
                })
              }}
            >
              Rechazar Permiso
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {confirmAction?.type === 'create-vacacion' && (
        <ConfirmDialog
          open
          title="¿Crear solicitud de vacaciones?"
          message="Se agregará una nueva solicitud de vacaciones."
          confirmText="Sí, crear"
          confirmColor="#1a6bdb"
          onConfirm={handleConfirm}
          onCancel={() => { setConfirmAction(null); setVacacionModalOpen(true) }}
        />
      )}

      {confirmAction?.type === 'create-vacacion-historico' && (
        <ConfirmDialog
          open
          title="¿Registrar vacaciones históricas?"
          message="Se descontarán los días desde los períodos más antiguos disponibles. Los registros quedarán como Aceptados."
          confirmText="Sí, registrar"
          confirmColor="#1a6bdb"
          onConfirm={handleConfirm}
          onCancel={() => { setConfirmAction(null); setVacacionHistoricoModalOpen(true) }}
        />
      )}

      {confirmAction?.type === 'delete-vacacion' && (
        <ConfirmDialog
          open
          title="¿Eliminar solicitud?"
          message="Esta acción no se puede deshacer."
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
          confirmColor="#dc2626"
          icon={<AlertTriangle className="h-6 w-6 text-destructive" />}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {confirmAction?.type === 'aceptar-vacacion' && (
        <ConfirmDialog
          open
          title="¿Aceptar solicitud de vacaciones?"
          message="Las vacaciones serán marcadas como aceptadas."
          confirmText="Sí, aceptar"
          cancelText="Cancelar"
          confirmColor="#16a34a"
          icon={
            <svg className="h-6 w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      {confirmAction?.type === 'update-permisos-sistema' && (
        <ConfirmDialog
          open
          title="¿Actualizar permisos del sistema?"
          message="Se asignarán los permisos seleccionados al usuario."
          confirmText="Sí, actualizar"
          confirmColor="#1a6bdb"
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      <Dialog open={rechazoVacacionDialog.open} onOpenChange={(open) => setRechazoVacacionDialog({ ...rechazoVacacionDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud de Vacaciones</DialogTitle>
            <DialogDescription>
              Indica el motivo del rechazo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="rechazo_vac_observacion">Observación <span className="text-destructive">*</span></Label>
              <textarea
                id="rechazo_vac_observacion"
                placeholder="Describe el motivo del rechazo"
                value={rechazoVacacionDialog.observacion}
                onChange={(e) => setRechazoVacacionDialog({ ...rechazoVacacionDialog, observacion: e.target.value })}
                rows={3}
                className="flex min-h-[36px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setRechazoVacacionDialog({ ...rechazoVacacionDialog, open: false })}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={rechazoVacacionDialog.observacion.trim().length < 5}
              onClick={() => {
                setRechazoVacacionDialog({ ...rechazoVacacionDialog, open: false })
                router.patch(route('rrhh.vacaciones.rechazar', rechazoVacacionDialog.vacacionId), {
                  observacion_rechazo: rechazoVacacionDialog.observacion,
                }, {
                  preserveScroll: true,
                  onSuccess: () => addToast({ title: 'Rechazada', description: 'Solicitud de vacaciones rechazada correctamente.' }),
                  onError: () => setRechazoVacacionDialog({ ...rechazoVacacionDialog, open: true }),
                })
              }}
            >
              Rechazar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={anularVacacionDialog.open} onOpenChange={(open) => setAnularVacacionDialog({ ...anularVacacionDialog, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Anular Vacaciones</DialogTitle>
            <DialogDescription>
              Indica el motivo de la anulación.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="anular_vac_observacion">Motivo de anulación <span className="text-destructive">*</span></Label>
              <textarea
                id="anular_vac_observacion"
                placeholder="Describe el motivo de la anulación"
                value={anularVacacionDialog.observacion}
                onChange={(e) => setAnularVacacionDialog({ ...anularVacacionDialog, observacion: e.target.value })}
                rows={3}
                className="flex min-h-[36px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setAnularVacacionDialog({ ...anularVacacionDialog, open: false })}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={anularVacacionDialog.observacion.trim().length < 5}
              onClick={() => {
                setAnularVacacionDialog({ ...anularVacacionDialog, open: false })
                router.patch(route('rrhh.vacaciones.anular', anularVacacionDialog.vacacionId), {
                  observacion_anulacion: anularVacacionDialog.observacion,
                }, {
                  preserveScroll: true,
                  onSuccess: () => addToast({ title: 'Anulada', description: 'Vacaciones anuladas correctamente.' }),
                  onError: () => setAnularVacacionDialog({ ...anularVacacionDialog, open: true }),
                })
              }}
            >
              Anular Vacaciones
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

Edit.layout = (page: ReactNode) => <AppLayout title="Editar Usuario" children={page} />
