import { useState, useMemo, useEffect, type ReactNode } from 'react'
import { Head } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Breadcrumbs } from '@/Components/shared/Breadcrumbs'
import { DataTable, type Column } from '@/Components/shared/DataTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Badge } from '@/Components/ui/badge'
import { Button } from '@/Components/ui/button'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import { BarChart3, Eye, DollarSign, PieChart as PieIcon, TrendingUp } from 'lucide-react'
import { CardSection } from '@/Components/shared/CardSection'
import { ModalDetalleIngreso } from '@/Components/cementerio/ModalDetalleIngreso'
import { ModalDetalleCuota } from '@/Components/cementerio/ModalDetalleCuota'
import { OtDetalleModal } from '@/Components/cementerio/OtDetalleModal'
import {
  mockIngresoPorServicio,
  mockServiciosPorFinanciamiento,
  mockEvolucionIngresos,
} from '@/lib/mockData'
import { formatCurrency } from '@/lib/utils'

interface IngresoRow {
  id: number
  ot_id: string
  fallecido: string
  servicio: string
  cuota: string
  monto: number
  fecha_ultimo_pago: string
  estado: string
}

interface CuotaRow {
  id: number
  fallecido: string
  ot_id: string
  servicio: string
  cuota: string
  fecha_vencimiento: string
  dias_restantes: number
  estado: string
}

const ingresoEstadoBadge: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pagada: 'default',
  pendiente: 'secondary',
  parcial: 'outline',
  anulada: 'destructive',
}

const ingresoEstadoLabel: Record<string, string> = {
  pagada: 'Pagada',
  pendiente: 'Pendiente',
  parcial: 'Parcial',
  anulada: 'Anulada',
}

const cuotaEstadoBadge: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  proximo_vencimiento: 'secondary',
  vencida: 'destructive',
  futura: 'outline',
}

const cuotaEstadoLabel: Record<string, string> = {
  proximo_vencimiento: 'Próximo vencimiento',
  vencida: 'Vencida',
  futura: 'Futura',
}

const coloresFinanciamiento = ['hsl(215, 79%, 49%)', 'hsl(160, 50%, 40%)', 'hsl(45, 93%, 52%)']

const coloresServicios = [
  'hsl(215, 79%, 49%)',
  'hsl(180, 22%, 34%)',
  'hsl(0, 72%, 48%)',
  'hsl(45, 93%, 52%)',
  'hsl(160, 50%, 40%)',
  'hsl(280, 40%, 50%)',
  'hsl(30, 70%, 55%)',
  'hsl(200, 60%, 45%)',
]

const cuotaEstadoClass: Record<string, string> = {
  proximo_vencimiento: 'text-amber-600 font-medium',
  vencida: 'text-destructive font-medium',
  futura: 'text-muted-foreground',
}

function Reportes({ ingresos, cuotasPorVencer }: { ingresos: IngresoRow[], cuotasPorVencer: CuotaRow[] }) {
  const [activeTab, setActiveTab] = useState('ingresos')
  const [ingresoSelected, setIngresoSelected] = useState<IngresoRow | null>(null)
  const [ingresoModalOpen, setIngresoModalOpen] = useState(false)
  const [cuotaSelected, setCuotaSelected] = useState<CuotaRow | null>(null)
  const [cuotaModalOpen, setCuotaModalOpen] = useState(false)
  const [otModalOpen, setOtModalOpen] = useState(false)
  const [otIdSelected, setOtIdSelected] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 10

  const pagination = useMemo(() => {
    const lastPage = Math.max(1, Math.ceil(ingresos.length / perPage))
    const safePage = Math.min(page, lastPage)
    const from = (safePage - 1) * perPage + 1
    const to = Math.min(safePage * perPage, ingresos.length)
    return {
      current_page: safePage,
      last_page: lastPage,
      per_page: perPage,
      total: ingresos.length,
      from: ingresos.length > 0 ? from : null,
      to: ingresos.length > 0 ? to : null,
    }
  }, [ingresos, page])

  useEffect(() => {
    setPage(1)
  }, [ingresos])

  const ingresoColumns: Column<IngresoRow>[] = useMemo(() => [
    { key: 'ot_id', label: 'N° OT' },
    { key: 'fallecido', label: 'Fallecido' },
    { key: 'servicio', label: 'Servicio' },
    { key: 'cuota', label: 'Cuota' },
    {
      key: 'monto',
      label: 'Monto',
      render: (item) => formatCurrency(item.monto),
    },
    { key: 'fecha_ultimo_pago', label: 'Fecha último pago' },
    {
      key: 'estado',
      label: 'Estado',
      render: (item) => (
        <Badge variant={ingresoEstadoBadge[item.estado] || 'outline'}>
          {ingresoEstadoLabel[item.estado] || item.estado}
        </Badge>
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
            setOtIdSelected(item.ot_id)
            setOtModalOpen(true)
          }}
        >
          <Eye className="h-3.5 w-3.5" />
          Ver detalle
        </Button>
      ),
    },
  ], [])

  const cuotaColumns: Column<CuotaRow>[] = useMemo(() => [
    { key: 'fallecido', label: 'Fallecido' },
    { key: 'ot_id', label: 'N° OT' },
    { key: 'servicio', label: 'Servicio' },
    { key: 'cuota', label: 'Cuota' },
    { key: 'fecha_vencimiento', label: 'Vencimiento' },
    {
      key: 'dias_restantes',
      label: 'Días rest.',
      render: (item) => (
        <span className={cuotaEstadoClass[item.estado]}>
          {item.estado === 'vencida' ? `${item.dias_restantes} días` : `${item.dias_restantes} días`}
        </span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      render: (item) => (
        <Badge variant={cuotaEstadoBadge[item.estado] || 'outline'}>
          {cuotaEstadoLabel[item.estado] || item.estado}
        </Badge>
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
            setOtIdSelected(item.ot_id)
            setOtModalOpen(true)
          }}
        >
          <Eye className="h-3.5 w-3.5" />
          Ver OT
        </Button>
      ),
    },
  ], [])

  const [cuotaPage, setCuotaPage] = useState(1)
  const cuotaPerPage = 10

  const cuotaPagination = useMemo(() => {
    const lastPage = Math.max(1, Math.ceil(cuotasPorVencer.length / cuotaPerPage))
    const safePage = Math.min(cuotaPage, lastPage)
    const from = (safePage - 1) * cuotaPerPage + 1
    const to = Math.min(safePage * cuotaPerPage, cuotasPorVencer.length)
    return {
      current_page: safePage,
      last_page: lastPage,
      per_page: cuotaPerPage,
      total: cuotasPorVencer.length,
      from: cuotasPorVencer.length > 0 ? from : null,
      to: cuotasPorVencer.length > 0 ? to : null,
    }
  }, [cuotasPorVencer, cuotaPage])

  useEffect(() => {
    setCuotaPage(1)
  }, [cuotasPorVencer])

  return (
    <>
      <Head title="Cementerio - Reportes" />

      <div className="animate-fade-in-up space-y-6">
        <Breadcrumbs
          items={[
            { label: 'Cementerio' },
            { label: 'Reportes' },
          ]}
        />

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Reportes</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Control financiero administrativo
            </p>
          </div>
          <BarChart3 className="h-10 w-10 text-muted-foreground/30" />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-lg grid-cols-3">
            <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
            <TabsTrigger value="cuotas">Cuotas por vencer</TabsTrigger>
            <TabsTrigger value="estadistico">Reporte Estadístico</TabsTrigger>
          </TabsList>

          <TabsContent value="ingresos" className="mt-4 space-y-4">
            <DataTable
              columns={ingresoColumns}
              data={ingresos.slice((pagination.current_page - 1) * perPage, pagination.current_page * perPage)}
              keyExtractor={(item) => item.id}
              pagination={pagination}
              onPageChange={setPage}
              onRowClick={(item) => {
                setIngresoSelected(item)
                setIngresoModalOpen(true)
              }}
            />
          </TabsContent>

          <TabsContent value="cuotas" className="mt-4 space-y-4">
            <DataTable
              columns={cuotaColumns}
              data={cuotasPorVencer.slice((cuotaPagination.current_page - 1) * cuotaPerPage, cuotaPagination.current_page * cuotaPerPage)}
              keyExtractor={(item) => item.id}
              pagination={cuotaPagination}
              onPageChange={setCuotaPage}
              onRowClick={(item) => {
                setCuotaSelected(item)
                setCuotaModalOpen(true)
              }}
            />
          </TabsContent>

          <TabsContent value="estadistico" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <CardSection
                title="Servicios por Financiamiento"
                icon={PieIcon}
                iconColor="primary"
              >
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={mockServiciosPorFinanciamiento}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={100}
                      innerRadius={50}
                      paddingAngle={3}
                      label={({ name, percent }) =>
                        `${name ?? ''} ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                    >
                      {mockServiciosPorFinanciamiento.map((_, index) => (
                        <Cell key={index} fill={coloresFinanciamiento[index]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${Number(value)} servicios`, 'Cantidad']}
                      contentStyle={{
                        borderRadius: '0.5rem',
                        border: '1px solid hsl(var(--border))',
                        background: 'hsl(var(--card))',
                      }}
                    />
                    <Legend verticalAlign="bottom" />
                  </PieChart>
                </ResponsiveContainer>
              </CardSection>

              <CardSection
                title="Evolución de Ingresos Mensuales"
                icon={TrendingUp}
                iconColor="primary"
              >
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={mockEvolucionIngresos} margin={{ bottom: 20, left: 20, right: 20, top: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="mes" className="text-muted-foreground" />
                    <YAxis
                      tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                      className="text-muted-foreground"
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(Number(value)), 'Ingresos']}
                      contentStyle={{
                        borderRadius: '0.5rem',
                        border: '1px solid hsl(var(--border))',
                        background: 'hsl(var(--card))',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ingresos"
                      stroke="hsl(215, 79%, 49%)"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(215, 79%, 49%)', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardSection>
            </div>

            <CardSection
              title="Ingresos por Servicio"
              icon={DollarSign}
              iconColor="primary"
            >
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockIngresoPorServicio} margin={{ bottom: 60, left: 20, right: 20, top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="servicio"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value)), 'Ingresos']}
                    contentStyle={{
                      borderRadius: '0.5rem',
                      border: '1px solid hsl(var(--border))',
                      background: 'hsl(var(--card))',
                    }}
                  />
                  <Bar dataKey="monto" radius={[4, 4, 0, 0]}>
                    {mockIngresoPorServicio.map((_, index) => (
                      <Cell key={index} fill={coloresServicios[index % coloresServicios.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardSection>
          </TabsContent>
        </Tabs>
      </div>

      <ModalDetalleIngreso
        open={ingresoModalOpen}
        onOpenChange={setIngresoModalOpen}
        ingreso={ingresoSelected}
        onVerOt={(otId) => {
          setOtIdSelected(otId)
          setOtModalOpen(true)
        }}
      />

      <ModalDetalleCuota
        open={cuotaModalOpen}
        onOpenChange={setCuotaModalOpen}
        cuota={cuotaSelected}
      />

      <OtDetalleModal
        open={otModalOpen}
        onOpenChange={setOtModalOpen}
        otNumber={otIdSelected ?? ''}
      />
    </>
  )
}

Reportes.layout = (page: ReactNode) => (
  <AppLayout title="Reportes" children={page} />
)

export default Reportes

