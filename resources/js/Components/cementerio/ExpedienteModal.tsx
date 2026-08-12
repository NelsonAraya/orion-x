import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/Components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { CardSection } from '@/Components/shared/CardSection'
import {
  FileText,
  User,
  Calendar,
  Activity,
  Clock,
  Download,
  FileArchive,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { mockDocumentos, mockMovimientos } from '@/lib/mockData'

interface Fallecido {
  id: number
  nombre: string
  rut: string
  fecha_registro: string
  ubicacion: string
  documentos_count: number
  estado: string
  ultimo_movimiento: string
}

interface ExpedienteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  fallecido: Fallecido | null
}

const tipoMovimientoColor: Record<string, string> = {
  ingreso: 'bg-emerald-500',
  creacion_ot: 'bg-blue-500',
  actualizacion: 'bg-amber-500',
}

const tipoMovimientoBg: Record<string, string> = {
  ingreso: 'bg-emerald-50 border-emerald-200',
  creacion_ot: 'bg-blue-50 border-blue-200',
  actualizacion: 'bg-amber-50 border-amber-200',
}

const estadoBadge: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Activo: 'default',
  Finalizado: 'secondary',
  Pendiente: 'outline',
}

export function ExpedienteModal({ open, onOpenChange, fallecido }: ExpedienteModalProps) {
  const [activeTab, setActiveTab] = useState('informacion')

  if (!fallecido) return null

  const documentos = mockDocumentos.filter((d) => d.fallecido_id === fallecido.id)
  const movimientos = mockMovimientos.filter((m) => m.fallecido_id === fallecido.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Expediente digital</DialogTitle>
        </DialogHeader>

        <div className="rounded-lg border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">{fallecido.nombre}</h2>
              <p className="text-sm text-muted-foreground">RUT: {fallecido.rut}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Estado</p>
                <Badge variant={estadoBadge[fallecido.estado] || 'outline'}>
                  {fallecido.estado}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Ubicación</p>
                <p className="font-medium">{fallecido.ubicacion}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Registro</p>
                <p className="font-medium">{fallecido.fecha_registro}</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informacion">Información</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
            <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          </TabsList>

          <TabsContent value="informacion" className="mt-4">
            <CardSection title="Datos del fallecido" icon={User} iconColor="primary">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <span className="text-xs text-muted-foreground">Nombre completo</span>
                  <p className="mt-0.5 font-medium">{fallecido.nombre}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Identificación</span>
                  <p className="mt-0.5 font-medium">{fallecido.rut}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Fecha de registro</span>
                  <p className="mt-0.5 font-medium">{fallecido.fecha_registro}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Ubicación actual</span>
                  <p className="mt-0.5 font-medium">{fallecido.ubicacion}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Documentos asociados</span>
                  <p className="mt-0.5 font-medium">{fallecido.documentos_count} documentos</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Último movimiento</span>
                  <p className="mt-0.5 font-medium">{fallecido.ultimo_movimiento}</p>
                </div>
              </div>
            </CardSection>
          </TabsContent>

          <TabsContent value="documentos" className="mt-4 space-y-4">
            <div className="grid gap-3">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-start justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{doc.nombre}</p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {doc.fecha_creacion}
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="h-3 w-3" />
                          {doc.origen}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
                    <Download className="h-3.5 w-3.5" />
                    Ver PDF
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-center pt-2">
              <Button className="gap-2 px-6">
                <FileArchive className="h-4 w-4" />
                Ver expediente completo
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="movimientos" className="mt-4">
            <div className="relative">
              {movimientos.map((mov, index) => (
                <div key={mov.id} className="relative flex gap-4 pb-8 last:pb-0">
                  {index < movimientos.length - 1 && (
                    <div className="absolute left-[11px] top-5 h-full w-0.5 bg-border" />
                  )}
                  <div
                    className={cn(
                      'relative z-10 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                      tipoMovimientoColor[mov.tipo] || 'bg-gray-400'
                    )}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-white" />
                  </div>
                  <div className={cn('flex-1 rounded-lg border p-4', tipoMovimientoBg[mov.tipo])}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground">
                          {mov.fecha_hora}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {mov.tipo_label}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{mov.descripcion}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{mov.detalle}</p>
                    {mov.documento_asociado && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <FileText className="h-3 w-3" />
                        <span>{mov.documento_asociado}</span>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      <span className="font-medium">Usuario:</span> {mov.usuario}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}


