import { useState, useMemo, type ReactNode } from 'react'
import { Head } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Breadcrumbs } from '@/Components/shared/Breadcrumbs'
import { DataTable } from '@/Components/shared/DataTable'
import { SearchFilters } from '@/Components/shared/SearchFilters'
import { FormInput } from '@/Components/forms/FormInput'
import { Button } from '@/Components/ui/button'
import { Badge } from '@/Components/ui/badge'
import { FileText, Eye } from 'lucide-react'
import { ExpedienteModal } from '@/Components/cementerio/ExpedienteModal'
import { mockFallecidosExpediente } from '@/lib/mockData'
import type { Column } from '@/Components/shared/DataTable'

interface FallecidoRow {
  id: number
  nombre: string
  rut: string
  fecha_registro: string
  ubicacion: string
  documentos_count: number
  estado: string
  ultimo_movimiento: string
}

const estadoBadge: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  Activo: 'default',
  Finalizado: 'secondary',
}

function Documentos() {
  const [search, setSearch] = useState('')
  const [selectedFallecido, setSelectedFallecido] = useState<FallecidoRow | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const filtered = useMemo(() => {
    if (!search.trim()) return mockFallecidosExpediente
    const term = search.toLowerCase()
    return mockFallecidosExpediente.filter(
      (f) => f.nombre.toLowerCase().includes(term) || f.rut.toLowerCase().includes(term)
    )
  }, [search])

  const columns: Column<FallecidoRow>[] = [
    { key: 'nombre', label: 'Fallecido' },
    { key: 'rut', label: 'RUT' },
    { key: 'fecha_registro', label: 'Registro' },
    { key: 'ubicacion', label: 'Ubicación' },
    {
      key: 'documentos_count',
      label: 'Documentos',
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{item.documentos_count}</span>
        </div>
      ),
    },
    {
      key: 'accion',
      label: 'Acción',
      render: (item) => (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={(e) => {
            e.stopPropagation()
            setSelectedFallecido(item)
            setModalOpen(true)
          }}
        >
          <Eye className="h-3.5 w-3.5" />
          Ver detalle
        </Button>
      ),
    },
  ]

  return (
    <>
      <Head title="Cementerio - Documentos" />

      <div className="animate-fade-in-up space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Cementerio' },
            { label: 'Documentos' },
          ]}
        />

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Documentos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Expediente digital de fallecidos
          </p>
        </div>

        <SearchFilters
          onSearch={() => {}}
          onClear={() => setSearch('')}
        >
          <FormInput
            label="Buscar"
            placeholder="Nombre o RUT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </SearchFilters>

        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(item) => item.id}
          onRowClick={(item) => {
            setSelectedFallecido(item)
            setModalOpen(true)
          }}
        />
      </div>

      <ExpedienteModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        fallecido={selectedFallecido}
      />
    </>
  )
}

Documentos.layout = (page: ReactNode) => (
  <AppLayout title="Documentos" children={page} />
)

export default Documentos
