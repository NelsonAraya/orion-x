import { useState } from 'react'
import { Head, useForm, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/Components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { Badge } from '@/Components/ui/badge'
import { ClipboardList, Calendar, Briefcase, Plus, FileText } from 'lucide-react'

interface TipoPermiso {
  id: number
  nombre: string
}

interface PermisoDetalle {
  fecha: string
  jornada: string
  bloques: number
}

interface Permiso {
  id: number
  permiso_display: string
  tipo_permiso: string
  fecha_inicio: string | null
  fecha_termino: string | null
  jornada: string | null
  bloques_consumidos: number | null
  detalle: string | null
  dias_solicitados: number | null
  detalles: PermisoDetalle[]
  motivo: string
  estado: string
  fecha_gestion: string | null
  gestionado_por: string | null
  observacion_rechazo: string | null
  creado_por: string
  created_at: string
}

interface VacacionPeriodo {
  periodo_numero: number
  dias_consumidos: number
}

interface Vacacion {
  id: number
  fecha_inicio: string | null
  fecha_termino: string | null
  dias_solicitados: number
  periodos: VacacionPeriodo[]
  motivo: string
  estado: string
  fecha_gestion: string | null
  gestionado_por: string | null
  observacion_rechazo: string | null
  observacion_anulacion: string | null
  creado_por: string
  created_at: string
}

interface Periodo {
  fecha: string
  numero: number
  inicio: string
  fin: string
  dias_correspondientes: number
  dias_usados: number
}

interface Orden {
  id: number
  ott_display: string
  tipo_orden: string
  tipo_contrato: string
  fecha_inicio: string
  fecha_termino: string | null
  jornada_horas: string | null
  centro_costo: string | null
  nivel: string | null
  afp: string | null
  prevision: string | null
  estado: string
  creado_por: string
  created_at: string
}

function estadoBadge(estado: string | null) {
  const variants: Record<string, string> = {
    Ingresada: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Aceptada: 'bg-green-100 text-green-800 border-green-300',
    Rechazada: 'bg-red-100 text-red-800 border-red-300',
    Anulada: 'bg-gray-100 text-gray-800 border-gray-300',
  }
  return (
    <Badge variant="outline" className={variants[estado ?? ''] || ''}>
      {estado}
    </Badge>
  )
}

export default function PortalIndex({ lista_permisos, tipos_permiso, con_goce_id, bloques_anuales, vacaciones, periodos_vacaciones, ordenes, tiene_fecha_ingreso }: {
  lista_permisos: Permiso[]
  tipos_permiso: TipoPermiso[]
  con_goce_id: number
  bloques_anuales: { usados: number; total: number }
  vacaciones: Vacacion[]
  periodos_vacaciones: Periodo[]
  ordenes: Orden[]
  tiene_fecha_ingreso: boolean
}) {
  const [permisoModalOpen, setPermisoModalOpen] = useState(false)
  const [vacacionModalOpen, setVacacionModalOpen] = useState(false)

  const permisoForm = useForm({
    tipo_permiso_id: '',
    fecha_inicio: '',
    fecha_termino: '',
    jornada: '',
    motivo: '',
    detalles: [] as { fecha: string; jornada: string }[],
  })

  const vacacionForm = useForm({
    fecha_inicio: '',
    fecha_termino: '',
    motivo: '',
  })

  const submitPermiso = (e: React.FormEvent) => {
    e.preventDefault()
    permisoForm.post(route('portal.permisos.store'), {
      preserveScroll: true,
      onSuccess: () => {
        permisoForm.reset()
        setPermisoModalOpen(false)
      },
    })
  }

  const submitVacacion = (e: React.FormEvent) => {
    e.preventDefault()
    vacacionForm.post(route('portal.vacaciones.store'), {
      preserveScroll: true,
      onSuccess: () => {
        vacacionForm.reset()
        setVacacionModalOpen(false)
      },
    })
  }

  const esConGoce = con_goce_id && String(con_goce_id) === permisoForm.data.tipo_permiso_id

  const previewDias = (() => {
    if (!vacacionForm.data.fecha_inicio || !vacacionForm.data.fecha_termino) return null
    const start = new Date(vacacionForm.data.fecha_inicio)
    const end = new Date(vacacionForm.data.fecha_termino)
    if (end < start) return null
    let count = 0
    const d = new Date(start)
    while (d <= end) {
      const day = d.getDay()
      if (day !== 0 && day !== 6) count++
      d.setDate(d.getDate() + 1)
    }
    if (count === 0) return null
    const disponibles = periodos_vacaciones.map((p) => ({
      ...p,
      restantes: p.dias_correspondientes - p.dias_usados,
    }))
    const preview: { periodo: number; consumir: number }[] = []
    let remaining = count
    for (const p of disponibles) {
      if (remaining <= 0) break
      if (p.restantes <= 0) continue
      const consumir = Math.min(p.restantes, remaining)
      preview.push({ periodo: p.numero, consumir })
      remaining -= consumir
    }
    return { total: count, distribucion: preview, faltante: remaining }
  })()

  return (
    <AppLayout title="Mi Espacio">
      <Head title="Mi Espacio" />
      <div className="animate-fade-in-up">
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold">Mi Espacio</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona tus permisos, vacaciones y consulta tus órdenes de trabajo.</p>
        </div>

        <Tabs defaultValue="permisos">
          <TabsList className="flex-wrap h-auto min-h-9">
            <TabsTrigger value="permisos" className="gap-2 shrink-0">
              <ClipboardList className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Permisos</span>
              <span className="inline sm:hidden">Permisos</span>
            </TabsTrigger>
            <TabsTrigger value="vacaciones" className="gap-2 shrink-0">
              <Calendar className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Vacaciones</span>
              <span className="inline sm:hidden">Vac.</span>
            </TabsTrigger>
            <TabsTrigger value="ordenes" className="gap-2 shrink-0">
              <Briefcase className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">Órdenes de Trabajo</span>
              <span className="inline sm:hidden">Órdenes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="permisos" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                    <ClipboardList className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>Permisos</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {lista_permisos.length} permiso(s) registrado(s).
                    </p>
                  </div>
                </div>
                <Button onClick={() => setPermisoModalOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Permiso
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
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
                        className={`h-full rounded-full transition-all ${bloques_anuales.usados >= bloques_anuales.total ? 'bg-destructive' : 'bg-primary'}`}
                        style={{ width: `${Math.min((bloques_anuales.usados / bloques_anuales.total) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {lista_permisos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ClipboardList className="h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">No tienes permisos registrados.</p>
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
                            <TableCell className="max-w-[200px] truncate" title={p.motivo}>{p.motivo}</TableCell>
                            <TableCell>{estadoBadge(p.estado)}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {p.fecha_gestion ? (
                                <span>{p.fecha_gestion} por {p.gestionado_por}</span>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
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

          <TabsContent value="vacaciones" className="mt-6">
            {!tiene_fecha_ingreso && (
              <Card className="mb-6 border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Fecha de ingreso no registrada</p>
                      <p className="text-sm text-amber-700 mt-1">
                        No puedes solicitar vacaciones porque no tienes una fecha de ingreso registrada.
                        Contacta al departamento de RRHH para que regularicen tu información.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {periodos_vacaciones.length > 0 && (
              <Card className="mb-6">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                      <Calendar className="h-5 w-5 text-teal-600" />
                    </div>
                    <CardTitle className="text-base">Mis Períodos de Vacaciones</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                    <FileText className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <CardTitle>Solicitudes</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {vacaciones.length} solicitude(s) registrada(s).
                    </p>
                  </div>
                </div>
                <Button onClick={() => setVacacionModalOpen(true)} className="gap-2" disabled={!tiene_fecha_ingreso}>
                  <Plus className="h-4 w-4" />
                  Nueva Solicitud
                </Button>
              </CardHeader>
              <CardContent>
                {vacaciones.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">No tienes solicitudes de vacaciones.</p>
                    <Button variant="outline" className="mt-4 gap-2" onClick={() => setVacacionModalOpen(true)} disabled={!tiene_fecha_ingreso}>
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
                            <TableCell className="max-w-[200px] truncate" title={v.motivo}>{v.motivo}</TableCell>
                            <TableCell>{estadoBadge(v.estado)}</TableCell>
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ordenes" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Órdenes de Trabajo</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {ordenes.length} orden(es) registrada(s).
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                {ordenes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Briefcase className="h-12 w-12 text-muted-foreground/40 mb-3" />
                    <p className="text-sm text-muted-foreground">No tienes órdenes de trabajo registradas.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>OTT</TableHead>
                          <TableHead>Tipo Orden</TableHead>
                          <TableHead>Tipo Contrato</TableHead>
                          <TableHead>Inicio</TableHead>
                          <TableHead>Término</TableHead>
                          <TableHead>Jornada</TableHead>
                          <TableHead>Centro Costo</TableHead>
                          <TableHead>Nivel</TableHead>
                          <TableHead>AFP</TableHead>
                          <TableHead>Previsión</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ordenes.map((o) => (
                          <TableRow key={o.id}>
                            <TableCell className="font-medium">{o.ott_display}</TableCell>
                            <TableCell>{o.tipo_orden}</TableCell>
                            <TableCell>{o.tipo_contrato}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{o.fecha_inicio}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{o.fecha_termino ?? '—'}</TableCell>
                            <TableCell>{o.jornada_horas ?? '—'}</TableCell>
                            <TableCell>{o.centro_costo ?? '—'}</TableCell>
                            <TableCell>{o.nivel ?? '—'}</TableCell>
                            <TableCell>{o.afp ?? '—'}</TableCell>
                            <TableCell>{o.prevision ?? '—'}</TableCell>
                            <TableCell>{estadoBadge(o.estado)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={permisoModalOpen} onOpenChange={setPermisoModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={submitPermiso} autoComplete="off">
              <DialogHeader>
                <DialogTitle>Nuevo Permiso</DialogTitle>
                <DialogDescription>Ingresa los datos de tu nuevo permiso.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="perm_tipo">
                    Tipo de Permiso <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={permisoForm.data.tipo_permiso_id}
                    onValueChange={(v) => {
                      const wasConGoce = con_goce_id && String(con_goce_id) === permisoForm.data.tipo_permiso_id
                      const nowConGoce = con_goce_id && String(con_goce_id) === v
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
                        <SelectItem key={t.id} value={String(t.id)}>{t.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {permisoForm.errors.tipo_permiso_id && (
                    <p className="text-xs text-destructive">{permisoForm.errors.tipo_permiso_id}</p>
                  )}
                </div>

                {!esConGoce && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="perm_fecha_inicio">Fecha de Inicio <span className="text-destructive">*</span></Label>
                      <Input id="perm_fecha_inicio" type="date" value={permisoForm.data.fecha_inicio}
                        onChange={(e) => permisoForm.setData('fecha_inicio', e.target.value)} />
                      {permisoForm.errors.fecha_inicio && <p className="text-xs text-destructive">{permisoForm.errors.fecha_inicio}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="perm_fecha_termino">Fecha de Término</Label>
                      <Input id="perm_fecha_termino" type="date" value={permisoForm.data.fecha_termino}
                        onChange={(e) => permisoForm.setData('fecha_termino', e.target.value)} />
                    </div>
                  </div>
                )}

                {esConGoce && (
                  <div className="space-y-3">
                    <Label>Días del Permiso <span className="text-destructive">*</span></Label>
                    {permisoForm.data.detalles.map((d, i) => (
                      <div key={i} className="flex items-end gap-2">
                        <div className="flex-1 space-y-1">
                          <Input type="date" value={d.fecha}
                            onChange={(e) => {
                              const u = [...permisoForm.data.detalles]
                              u[i] = { ...u[i], fecha: e.target.value }
                              permisoForm.setData('detalles', u)
                            }} />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Select value={d.jornada}
                            onValueChange={(v) => {
                              const u = [...permisoForm.data.detalles]
                              u[i] = { ...u[i], jornada: v }
                              permisoForm.setData('detalles', u)
                            }}>
                            <SelectTrigger><SelectValue placeholder="Jornada" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mañana">Mañana (1 bloque)</SelectItem>
                              <SelectItem value="tarde">Tarde (1 bloque)</SelectItem>
                              <SelectItem value="completo">Completo (2 bloques)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="button" variant="ghost" size="icon"
                          className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => permisoForm.setData('detalles', permisoForm.data.detalles.filter((_, j) => j !== i))}
                          disabled={permisoForm.data.detalles.length <= 1}>
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                        </Button>
                      </div>
                    ))}
                    {permisoForm.errors.detalles && (
                      <p className="text-xs text-destructive">{permisoForm.errors.detalles as string}</p>
                    )}
                    <Button type="button" variant="outline" size="sm"
                      onClick={() => permisoForm.setData('detalles', [...permisoForm.data.detalles, { fecha: '', jornada: '' }])}
                      className="gap-1">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" /><path d="M12 5v14" />
                      </svg>
                      Agregar día
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="perm_motivo">Motivo <span className="text-destructive">*</span></Label>
                  <textarea id="perm_motivo" placeholder="Describe el motivo del permiso"
                    value={permisoForm.data.motivo}
                    onChange={(e) => permisoForm.setData('motivo', e.target.value)}
                    rows={3}
                    className="flex min-h-[36px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                  {permisoForm.errors.motivo && <p className="text-xs text-destructive">{permisoForm.errors.motivo}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setPermisoModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={permisoForm.processing}>
                  {permisoForm.processing ? 'Guardando...' : 'Solicitar Permiso'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={vacacionModalOpen} onOpenChange={setVacacionModalOpen}>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={submitVacacion} autoComplete="off">
              <DialogHeader>
                <DialogTitle>Nueva Solicitud de Vacaciones</DialogTitle>
                <DialogDescription>Selecciona el rango de fechas para tu solicitud.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vac_fecha_inicio">Fecha de Inicio <span className="text-destructive">*</span></Label>
                    <Input id="vac_fecha_inicio" type="date" value={vacacionForm.data.fecha_inicio}
                      onChange={(e) => vacacionForm.setData('fecha_inicio', e.target.value)} />
                    {vacacionForm.errors.fecha_inicio && <p className="text-xs text-destructive">{vacacionForm.errors.fecha_inicio}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vac_fecha_termino">Fecha de Término <span className="text-destructive">*</span></Label>
                    <Input id="vac_fecha_termino" type="date" value={vacacionForm.data.fecha_termino}
                      onChange={(e) => vacacionForm.setData('fecha_termino', e.target.value)} />
                    {vacacionForm.errors.fecha_termino && <p className="text-xs text-destructive">{vacacionForm.errors.fecha_termino}</p>}
                  </div>
                </div>

                {previewDias && (
                  <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
                    <p className="text-sm font-medium">{previewDias.total} día(s) hábil(es) — Distribución:</p>
                    {previewDias.distribucion.map((d) => (
                      <p key={d.periodo} className="text-xs text-muted-foreground">Período {d.periodo}: {d.consumir} día(s)</p>
                    ))}
                    {previewDias.faltante > 0 && (
                      <p className="text-xs text-destructive font-medium">Faltan {previewDias.faltante} día(s) por cubrir.</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="vac_motivo">Motivo <span className="text-destructive">*</span></Label>
                  <textarea id="vac_motivo" placeholder="Describe el motivo de tu solicitud"
                    value={vacacionForm.data.motivo}
                    onChange={(e) => vacacionForm.setData('motivo', e.target.value)}
                    rows={3}
                    className="flex min-h-[36px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" />
                  {vacacionForm.errors.motivo && <p className="text-xs text-destructive">{vacacionForm.errors.motivo}</p>}
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setVacacionModalOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={vacacionForm.processing}>
                  {vacacionForm.processing ? 'Guardando...' : 'Solicitar Vacaciones'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
