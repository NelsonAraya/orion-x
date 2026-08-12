import { useState, type ReactNode } from 'react'
import { Head } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Breadcrumbs } from '@/Components/shared/Breadcrumbs'
import { CardSection } from '@/Components/shared/CardSection'
import { FormInput } from '@/Components/forms/FormInput'
import { SearchFilters } from '@/Components/shared/SearchFilters'
import { useToastContext } from '@/Components/ToastProvider'
import { OtDetalleModal } from '@/Components/cementerio/OtDetalleModal'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { User, MapPin, Calendar, FileText, Search, Eye } from 'lucide-react'

const estadoBadge: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Ocupado: 'default',
  Disponible: 'secondary',
  Reservado: 'outline',
  'En Mantención': 'destructive',
  Bloqueado: 'destructive',
}

interface Resultado {
  id: number
  nombre: string
  rut: string
  sexo: string
  fecha_fallecimiento: string
  sector: string
  patio: string
  codigo_ubicacion: string
  tipo_ubicacion: string
  estado_ubicacion: string
  fecha_asignacion: string
  ot_numero: string | null
}

export default function BuscarPorFallecido() {
  const [rut, setRut] = useState('')
  const [nombre, setNombre] = useState('')
  const [resultado, setResultado] = useState<Resultado | null>(null)
  const [loading, setLoading] = useState(false)
  const [busco, setBusco] = useState(false)
  const [modalOtOpen, setModalOtOpen] = useState(false)
  const [selectedOtNumber, setSelectedOtNumber] = useState('')
  const { addToast } = useToastContext()

  const handleBuscar = () => {
    if (!rut.trim() && !nombre.trim()) {
      addToast({
        title: 'Campos vacíos',
        description: 'Debe ingresar RUT o nombre para buscar.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    setResultado(null)
    setBusco(true)

    const params = new URLSearchParams()
    if (rut.trim()) params.set('rut', rut.trim())
    if (nombre.trim()) params.set('nombre', nombre.trim())

    fetch(`/cementerio/buscar-fallecido-ubicacion?${params}`)
      .then((res) => {
        if (!res.ok) return null
        return res.json()
      })
      .then((data) => {
        if (!data) {
          setResultado(null)
          addToast({
            title: 'Sin resultados',
            description: 'No se encontró un fallecido con esos datos.',
            variant: 'destructive',
          })
          return
        }
        setResultado(data)
      })
      .catch(() => {
        setResultado(null)
        addToast({
          title: 'Error',
          description: 'Ocurrió un error al realizar la búsqueda.',
          variant: 'destructive',
        })
      })
      .finally(() => setLoading(false))
  }

  const handleLimpiar = () => {
    setRut('')
    setNombre('')
    setResultado(null)
    setBusco(false)
  }

  const abrirModalOT = (otNumber: string) => {
    setSelectedOtNumber(otNumber)
    setModalOtOpen(true)
  }

  return (
    <>
      <Head title="Cementerio - Buscar por Fallecido" />

      <div className="animate-fade-in-up space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Cementerio' },
            { label: 'Ubicaciones' },
            { label: 'Buscar por Fallecido' },
          ]}
        />

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Buscar por Fallecido
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Encuentra la ubicación de un fallecido en el cementerio.
          </p>
        </div>

        <SearchFilters onSearch={handleBuscar} onClear={handleLimpiar}>
          <FormInput
            label="RUT"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            placeholder="Ej: 12.345.678-9"
          />
          <FormInput
            label="Nombre o Apellido"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del fallecido"
          />
        </SearchFilters>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}

        {!loading && busco && !resultado && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <h3 className="text-lg font-semibold">Sin resultados</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No se encontró ningún fallecido con los datos ingresados.
            </p>
          </div>
        )}

        {resultado && (
          <div className="animate-fade-in-up">
            <CardSection title="Información del Fallecido" icon={User} iconColor="primary">
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <span className="text-xs text-muted-foreground">Nombre completo</span>
                    <p className="font-medium">{resultado.nombre}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">RUT</span>
                    <p className="font-medium">{resultado.rut}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Sexo</span>
                    <p className="font-medium capitalize">{resultado.sexo}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">F. Fallecimiento</span>
                    <p className="font-medium">{resultado.fecha_fallecimiento}</p>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">Estado ubicación</span>
                    <div className="mt-0.5">
                      <Badge variant={estadoBadge[resultado.estado_ubicacion] ?? 'outline'}>
                        {resultado.estado_ubicacion}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-secondary">
                    <MapPin className="h-4 w-4" />
                    Ubicación
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <span className="text-xs text-muted-foreground">Sector</span>
                      <p className="font-medium">{resultado.sector}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Patio</span>
                      <p className="font-medium">{resultado.patio}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">{resultado.tipo_ubicacion}</span>
                      <p className="font-medium">{resultado.codigo_ubicacion}</p>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground">Fecha de Asignación</span>
                      <p className="font-medium">{resultado.fecha_asignacion}</p>
                    </div>
                  </div>
                </div>

                {resultado.ot_numero && (
                  <div className="flex justify-end border-t pt-4">
                    <Button
                      onClick={() => abrirModalOT(resultado.ot_numero!)}
                      className="gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Ver OT
                    </Button>
                  </div>
                )}
              </div>
            </CardSection>
          </div>
        )}
      </div>

      <OtDetalleModal
        open={modalOtOpen}
        onOpenChange={setModalOtOpen}
        otNumber={selectedOtNumber}
      />
    </>
  )
}

BuscarPorFallecido.layout = (page: ReactNode) => (
  <AppLayout title="Buscar por Fallecido" children={page} />
)
