import { useState, type ReactNode } from 'react'
import { Head, Link, router } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { PageHeader } from '@/Components/shared/PageHeader'
import { EmptyState } from '@/Components/shared/EmptyState'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Badge } from '@/Components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/Components/ui/table'
import { Users, Search, ChevronLeft, ChevronRight, Plus, UserPlus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserRow {
  id: number
  rut_formateado: string
  name: string
  nombres: string
  apellido_paterno: string
  apellido_materno: string | null
  email: string
  fecha_ingreso: string | null
  estado: string
  foto_perfil_url: string | null
  created_at: string
}

export interface PaginationData {
  data: UserRow[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

interface Props {
  users: PaginationData
  filters: { search?: string }
}

function getEstadoVariant(estado: string) {
  const map: Record<string, string> = {
    Activo: 'default',
    Inactivo: 'destructive',
    Pendiente: 'secondary',
  }
  return (map[estado] ?? 'outline') as 'default' | 'destructive' | 'secondary' | 'outline'
}

export default function Index({ users, filters }: Props) {
  const [search, setSearch] = useState(filters.search ?? '')
  const { data, ...meta } = users

  const handleSearch = (value: string) => {
    setSearch(value)
    router.get('/rrhh', { search: value || undefined }, { preserveState: true, replace: true })
  }

  return (
    <>
      <Head title="RRHH - Usuarios" />

      <div className="animate-fade-in-up space-y-6">
        <PageHeader
          title="Gestión de Usuarios"
          description="Administra los usuarios registrados en el sistema."
          actions={
            <Link href="/rrhh/create">
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Nuevo Usuario
              </Button>
            </Link>
          }
        />

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="relative mb-4 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o RUT..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">RUT</TableHead>
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-[120px]">Fecha Ingreso</TableHead>
                    <TableHead className="w-[110px]">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        <EmptyState
                          icon={<Users className="h-12 w-12" />}
                          title="Sin usuarios"
                          description="No se encontraron usuarios con los filtros actuales."
                          action={
                            <Link href="/rrhh/create">
                              <Button variant="outline" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Crear primer usuario
                              </Button>
                            </Link>
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((user) => (
                      <TableRow
                        key={user.id}
                        onClick={() => router.visit(`/rrhh/${user.id}/edit`)}
                        className="cursor-pointer transition-colors hover:bg-muted/50"
                      >
                        <TableCell className="font-mono text-sm">
                          {user.rut_formateado}
                        </TableCell>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {user.fecha_ingreso ?? '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getEstadoVariant(user.estado)}>
                            {user.estado}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {meta.last_page > 1 && (
              <div className="flex flex-col items-center justify-between gap-4 pt-4 sm:flex-row">
                <p className="text-sm text-muted-foreground">
                  Mostrando {meta.from} a {meta.to} de {meta.total} registros
                </p>
                <div className="flex items-center gap-1">
                  {meta.current_page > 1 && (
                    <Link
                      href={`/rrhh?page=${meta.current_page - 1}${search ? `&search=${search}` : ''}`}
                      preserveState
                    >
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(
                    (page) => (
                      <Link
                        key={page}
                        href={`/rrhh?page=${page}${search ? `&search=${search}` : ''}`}
                        preserveState
                      >
                        <Button
                          variant={
                            page === meta.current_page ? 'default' : 'outline'
                          }
                          size="sm"
                          className={cn(
                            'h-8 min-w-[32px] px-2',
                            page === meta.current_page &&
                              'shadow-sm'
                          )}
                        >
                          {page}
                        </Button>
                      </Link>
                    )
                  )}
                  {meta.current_page < meta.last_page && (
                    <Link
                      href={`/rrhh?page=${meta.current_page + 1}${search ? `&search=${search}` : ''}`}
                      preserveState
                    >
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

Index.layout = (page: ReactNode) => <AppLayout title="RRHH" children={page} />
