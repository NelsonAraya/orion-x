import { useState, type ReactNode } from 'react'
import { Head, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Breadcrumbs } from '@/Components/shared/Breadcrumbs'
import { SearchFilters } from '@/Components/shared/SearchFilters'
import { FormSelect } from '@/Components/forms/FormSelect'
import { DataTable, type Column } from '@/Components/shared/DataTable'
import { Card, CardContent } from '@/Components/ui/card'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/Components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'
import { OtDetalleModal } from '@/Components/cementerio/OtDetalleModal'
import { EditarFallecidoModal, type FallecidoEditData } from '@/Components/cementerio/EditarFallecidoModal'
import { useToastContext } from '@/Components/ToastProvider'
import { MapPin, Eye, FileText, User, Loader } from 'lucide-react'

const estadoBadge: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Ocupado: 'default',
  Disponible: 'secondary',
  Reservado: 'outline',
  'En Mantención': 'destructive',
  Bloqueado: 'destructive',
}

interface FallecidoEnUbicacion {
  id: number
  nombre: string
  rut_fallecido: string | null
  codigo_nn: string | null
  nombres_fallecido: string
  apellido_paterno_fallecido: string
  apellido_materno_fallecido: string | null
  fecha_nacimiento_fallecido: string
  fecha_fallecimiento: string
  sexo_id: number
  sexo_nombre?: string
  estado_civil_id: number
  estado_civil_nombre?: string
  nacionalidad_fallecido: string
  lugar_fallecimiento: string
  observaciones: string | null
  es_nn: boolean
  registrador_id: string | null
  carta_defuncion: string | null
  fecha_sepultacion: string
  ot_id: string
}

interface UbicacionRow {
  codigo: string
  tipo: string
  sector: string
  estado: string
  capacidad: number
  ocupados: number
  fallecidos: FallecidoEnUbicacion[]
}

interface CatalogoItem {
  id: number
  nombre: string
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

export default function ConsultarUbicaciones() {
  const page = usePage()
  const tipos = (page.props.tipos as CatalogoItem[]) ?? []
  const sectores = (page.props.sectores as CatalogoItem[]) ?? []
  const estados = (page.props.estados as CatalogoItem[]) ?? []
  const sexos = (page.props.sexos as SexoItem[]) ?? []
  const estadosCiviles = (page.props.estadosCiviles as EstadoCivilItem[]) ?? []

  const [tipo, setTipo] = useState('')
  const [sector, setSector] = useState('')
  const [estado, setEstado] = useState('')
  const [busco, setBusco] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<UbicacionRow[]>([])
  const [detalleOpen, setDetalleOpen] = useState(false)
  const [detalleItem, setDetalleItem] = useState<UbicacionRow | null>(null)
  const [modalOtOpen, setModalOtOpen] = useState(false)
  const [selectedOtNumber, setSelectedOtNumber] = useState('')
  const [editandoFallecido, setEditandoFallecido] = useState<FallecidoEditData | null>(null)
  const { addToast } = useToastContext()

  const tipoOptions = tipos.map((t) => ({ value: String(t.id), label: t.nombre }))
  const sectorOptions = sectores.map((s) => ({ value: String(s.id), label: s.nombre }))
  const estadoOptions = estados.map((e) => ({ value: String(e.id), label: e.nombre }))

  const handleBuscar = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (tipo) params.set('tipo', tipo)
    if (sector) params.set('sector', sector)
    if (estado) params.set('estado', estado)

    try {
      const res = await fetch(`/cementerio/ubicaciones/consultar-data?${params.toString()}`)
      const json = await res.json()
      setData(json)
      setBusco(true)
      addToast({
        title: 'Búsqueda completada',
        description: `Se encontraron ${json.length} ubicaciones.`,
        variant: 'default',
      })
    } catch {
      addToast({
        title: 'Error',
        description: 'No se pudieron cargar las ubicaciones.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLimpiar = () => {
    setTipo('')
    setSector('')
    setEstado('')
    setData([])
    setBusco(false)
  }

  const abrirDetalle = (item: UbicacionRow) => {
    setDetalleItem(item)
    setDetalleOpen(true)
  }

  const abrirModalOT = (otNumber: string) => {
    setSelectedOtNumber(otNumber)
    setModalOtOpen(true)
  }

  const abrirEditarFallecido = (f: FallecidoEnUbicacion) => {
    setEditandoFallecido(f as FallecidoEditData)
  }

  const columns: Column<UbicacionRow>[] = [
    { key: 'codigo', label: 'Código' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'sector', label: 'Sector' },
    {
      key: 'estado',
      label: 'Estado',
      render: (item) => (
        <Badge variant={estadoBadge[item.estado] ?? 'outline'}>
          {item.estado}
        </Badge>
      ),
    },
    {
      key: 'ocupacion',
      label: 'Ocupación',
      render: (item) => (
        <span className="font-medium">{item.ocupados}/{item.capacidad}</span>
      ),
    },
  ]

  return (
    <>
      <Head title="Cementerio - Consultar Ubicaciones" />

      <div className="animate-fade-in-up space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Cementerio' },
            { label: 'Ubicaciones' },
            { label: 'Consultar Ubicaciones' },
          ]}
        />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Consultar Ubicaciones
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Visualiza todas las ubicaciones del cementerio y su estado.
            </p>
          </div>
          <MapPin className="h-10 w-10 text-muted-foreground/30" />
        </div>

        <SearchFilters onSearch={handleBuscar} onClear={handleLimpiar}>
          <FormSelect
            label="Tipo de Ubicación"
            value={tipo}
            onValueChange={setTipo}
            options={tipoOptions}
            placeholder="Todos los tipos"
          />
          <FormSelect
            label="Sector"
            value={sector}
            onValueChange={setSector}
            options={sectorOptions}
            placeholder="Todos los sectores"
          />
          <FormSelect
            label="Estado"
            value={estado}
            onValueChange={setEstado}
            options={estadoOptions}
            placeholder="Todos los estados"
          />
        </SearchFilters>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {busco && !loading && (
          <div className="animate-fade-in-up">
            <DataTable
              columns={columns}
              data={data}
              keyExtractor={(item) => item.codigo}
              onRowClick={abrirDetalle}
            />
          </div>
        )}
      </div>

      {/* Modal detalle de ubicación */}
      <Dialog open={detalleOpen} onOpenChange={setDetalleOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detalleItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Ubicación {detalleItem.codigo}
                </DialogTitle>
                <DialogDescription>
                  Detalle de la ubicación y fallecidos asociados.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {/* Información de la ubicación */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4 text-sm lg:grid-cols-3">
                      <div>
                        <span className="text-xs text-muted-foreground">Código</span>
                        <p className="font-medium">{detalleItem.codigo}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Tipo</span>
                        <p className="font-medium">{detalleItem.tipo}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Sector</span>
                        <p className="font-medium">{detalleItem.sector}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Estado</span>
                        <div className="mt-0.5">
                          <Badge variant={estadoBadge[detalleItem.estado] ?? 'outline'}>
                            {detalleItem.estado}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Capacidad Total</span>
                        <p className="font-medium">{detalleItem.capacidad}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Ocupados</span>
                        <p className="font-medium">{detalleItem.ocupados}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Disponibles</span>
                        <p className="font-medium">
                          {detalleItem.capacidad - detalleItem.ocupados}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de fallecidos */}
                <div>
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Fallecidos en esta ubicación
                  </h4>

                  {detalleItem.fallecidos.length === 0 ? (
                    <div className="flex items-center justify-center rounded-md border py-8 text-sm text-muted-foreground">
                      No hay fallecidos registrados en esta ubicación.
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre del Fallecido</TableHead>
                            <TableHead>Fecha de Sepultación</TableHead>
                            <TableHead>OT Asociada</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {detalleItem.fallecidos.map((f, i) => (
                            <TableRow key={i}>
                              <TableCell className="font-medium">{f.nombre}</TableCell>
                              <TableCell>{f.fecha_sepultacion}</TableCell>
                              <TableCell>{f.ot_id}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => abrirModalOT(f.ot_id)}
                                  >
                                    <FileText className="mr-1 h-4 w-4" />
                                    Ver OT
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => abrirEditarFallecido(f)}
                                  >
                                    <User className="mr-1 h-4 w-4" />
                                    Ver Fallecido
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <OtDetalleModal
        open={modalOtOpen}
        onOpenChange={setModalOtOpen}
        otNumber={selectedOtNumber}
      />

      <EditarFallecidoModal
        open={editandoFallecido !== null}
        onOpenChange={(open) => { if (!open) setEditandoFallecido(null) }}
        fallecido={editandoFallecido}
        sexos={sexos}
        estadosCiviles={estadosCiviles}
        onSuccess={handleBuscar}
      />
    </>
  )
}

ConsultarUbicaciones.layout = (page: ReactNode) => (
  <AppLayout title="Consultar Ubicaciones" children={page} />
)
