import { useState, useMemo, useEffect, type ReactNode } from 'react'
import { Head, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Breadcrumbs } from '@/Components/shared/Breadcrumbs'
import { SearchFilters } from '@/Components/shared/SearchFilters'
import { FormInput } from '@/Components/forms/FormInput'
import { FormSelect } from '@/Components/forms/FormSelect'
import { DataTable, type Column } from '@/Components/shared/DataTable'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import { useToastContext } from '@/Components/ToastProvider'
import { OtDetalleModal } from '@/Components/cementerio/OtDetalleModal'
import { EditarOtModal } from '@/Components/cementerio/EditarOtModal'
import { Eye, PenSquare, FileText } from 'lucide-react'
import { estadosOt } from '@/lib/mockData'

interface OtRow {
  numero_ot: string
  fallecido_nombre: string
  fallecido_identificador: string
  deudor_nombre: string
  deudor_identificador: string
  servicios: string
  total: number
  estado: string
  created_at: string
}

const estadoBadge: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Ingresada: 'default',
  Finalizada: 'outline',
  Anulada: 'destructive',
}

function AccionesCell({
  item,
  onVer,
  onEditar,
  canEdit,
}: {
  item: OtRow
  onVer: (numeroOt: string) => void
  onEditar: (numeroOt: string) => void
  canEdit: boolean
}) {
  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="sm" onClick={() => onVer(item.numero_ot)}>
        <Eye className="h-4 w-4" />
      </Button>
      {canEdit && (
        <Button variant="ghost" size="sm" onClick={() => onEditar(item.numero_ot)}>
          <PenSquare className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

interface Filters {
  numero_ot: string
  fallecido_rut: string
  fallecido_nombre: string
  estado: string
  fecha_desde: string
  fecha_hasta: string
}

const initialFilters: Filters = {
  numero_ot: '',
  fallecido_rut: '',
  fallecido_nombre: '',
  estado: '',
  fecha_desde: '',
  fecha_hasta: '',
}

export default function BuscarOt() {
  const page = usePage()
  const otsProp = (page.props.ots as OtRow[]) ?? []
  const [filters, setFilters] = useState<Filters>({ ...initialFilters })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [filtered, setFiltered] = useState<OtRow[]>([])
  const [searched, setSearched] = useState(false)
  const [otModalOpen, setOtModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedOt, setSelectedOt] = useState('')
  const { addToast } = useToastContext()
  const moduloPerfiles = (page.props.modulo_perfiles as Record<string, string> | undefined) ?? {}
  const perfil = moduloPerfiles['cementerio-buscar-ot'] ?? 'superadmin'
  const canManage = perfil !== 'auditor'

  const set = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }))
  }

  const handleBuscar = () => {
    const hasAnyFilter = Object.values(filters).some((v) => v.trim() !== '')
    if (!hasAnyFilter) {
      setErrors({ _general: 'Debe ingresar al menos un filtro de búsqueda.' })
      addToast({
        title: 'Filtros vacíos',
        description: 'Debe ingresar al menos un filtro de búsqueda.',
        variant: 'destructive',
      })
      return
    }
    setErrors({})

    let results = [...otsProp]
    if (filters.numero_ot) {
      results = results.filter((r) =>
        r.numero_ot.toLowerCase().includes(filters.numero_ot.toLowerCase()),
      )
    }
    if (filters.fallecido_rut) {
      const q = filters.fallecido_rut.toLowerCase()
      results = results.filter((r) =>
        r.fallecido_identificador.toLowerCase().includes(q),
      )
    }
    if (filters.fallecido_nombre) {
      const q = filters.fallecido_nombre.toLowerCase()
      results = results.filter((r) =>
        r.fallecido_nombre.toLowerCase().includes(q),
      )
    }
    if (filters.estado) {
      results = results.filter((r) => r.estado === filters.estado)
    }
    if (filters.fecha_desde) {
      results = results.filter((r) => r.created_at >= filters.fecha_desde)
    }
    if (filters.fecha_hasta) {
      results = results.filter((r) => r.created_at <= filters.fecha_hasta)
    }

    setFiltered(results)
    setSearched(true)

    addToast({
      title: 'Búsqueda completada',
      description: `Se encontraron ${results.length} resultados.`,
      variant: 'default',
    })
  }

  const handleLimpiar = () => {
    setFilters({ ...initialFilters })
    setErrors({})
    setFiltered([])
    setSearched(false)
  }

  const handleVer = (numeroOt: string) => {
    setSelectedOt(numeroOt)
    setOtModalOpen(true)
  }

  const handleEditar = (numeroOt: string) => {
    setSelectedOt(numeroOt)
    setEditModalOpen(true)
  }

  const displayData = searched ? filtered : otsProp

  const [pagina, setPagina] = useState(1)
  const perPage = 10

  const pagination = useMemo(() => {
    const lastPage = Math.max(1, Math.ceil(displayData.length / perPage))
    const safePage = Math.min(pagina, lastPage)
    const from = (safePage - 1) * perPage + 1
    const to = Math.min(safePage * perPage, displayData.length)
    return {
      current_page: safePage,
      last_page: lastPage,
      per_page: perPage,
      total: displayData.length,
      from: displayData.length > 0 ? from : null,
      to: displayData.length > 0 ? to : null,
    }
  }, [displayData, pagina])

  useEffect(() => {
    setPagina(1)
  }, [displayData])

  const columns: Column<OtRow>[] = [
    { key: 'numero_ot', label: 'N° OT' },
    { key: 'fallecido_identificador', label: 'RUT Fallecido' },
    { key: 'fallecido_nombre', label: 'Nombre Fallecido' },
    { key: 'deudor_identificador', label: 'RUT Deudor' },
    { key: 'deudor_nombre', label: 'Nombre Deudor' },
    { key: 'servicios', label: 'Servicios' },
    {
      key: 'total',
      label: 'Total',
      render: (item) => (
        <span className="font-medium tabular-nums">
          ${Number(item.total).toLocaleString('es-CL')}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Fecha OT',
      render: (item) => {
        const [y, m, d] = item.created_at.split('-')
        return <span>{`${d}-${m}-${y}`}</span>
      },
    },
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
      key: 'acciones',
      label: 'Acciones',
      render: (item) => (
        <AccionesCell item={item} onVer={handleVer} onEditar={handleEditar} canEdit={perfil === 'superadmin' || perfil === 'admin'} />
      ),
    },
  ]

  return (
    <>
      <Head title="Cementerio - Buscar OT" />

      <div className="animate-fade-in-up space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Cementerio' },
            { label: 'Orden de Trabajo' },
            { label: 'Buscar OT' },
          ]}
        />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Buscar Orden de Trabajo
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Encuentra órdenes de trabajo por distintos criterios.
            </p>
          </div>
          <FileText className="h-10 w-10 text-muted-foreground/30" />
        </div>

        <SearchFilters onSearch={handleBuscar} onClear={handleLimpiar} cols={3}>
          <FormInput
            label="Número OT"
            value={filters.numero_ot}
            onChange={(e) => set('numero_ot', e.target.value)}
            placeholder="Ej: OT-001"
          />
          <FormInput
            label="RUT Fallecido"
            value={filters.fallecido_rut}
            onChange={(e) => set('fallecido_rut', e.target.value)}
            placeholder="Ej: 12.345.678-9"
          />
          <FormInput
            label="Nombre Fallecido"
            value={filters.fallecido_nombre}
            onChange={(e) => set('fallecido_nombre', e.target.value)}
            placeholder="Nombre o apellido"
          />
          <FormSelect
            label="Estado"
            value={filters.estado}
            onValueChange={(v) => set('estado', v)}
            options={estadosOt}
            placeholder="Todos los estados"
          />
          <FormInput
            label="Fecha Desde"
            type="date"
            value={filters.fecha_desde}
            onChange={(e) => set('fecha_desde', e.target.value)}
          />
          <FormInput
            label="Fecha Hasta"
            type="date"
            value={filters.fecha_hasta}
            onChange={(e) => set('fecha_hasta', e.target.value)}
          />
        </SearchFilters>

        {errors._general && (
          <p className="text-sm text-destructive">{errors._general}</p>
        )}

        <div className="animate-fade-in-up">
          <DataTable
            columns={columns}
            data={displayData.slice((pagination.current_page - 1) * perPage, pagination.current_page * perPage)}
            keyExtractor={(item) => item.numero_ot}
            pagination={pagination}
            onPageChange={setPagina}
          />
        </div>
      </div>

      <OtDetalleModal
        open={otModalOpen}
        onOpenChange={setOtModalOpen}
        otNumber={selectedOt}
        canManage={canManage}
      />
      <EditarOtModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        otNumber={selectedOt}
      />
    </>
  )
}

BuscarOt.layout = (page: ReactNode) => (
  <AppLayout title="Buscar OT" children={page} />
)
