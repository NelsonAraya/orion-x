import { useState, useEffect, type ReactNode } from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import { useSidebarStore } from '@/stores/sidebarStore'
import {
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Menu,
  X,
  User,
  Users,
  ClipboardList,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { User as UserType } from '@/types'
import Swal from 'sweetalert2'
import { router } from '@inertiajs/react'
import { Button } from '@/Components/ui/button'
import { ToastProvider } from '@/Components/ToastProvider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface AppLayoutProps {
  title?: string
  children: ReactNode
}

export default function AppLayout({ title, children }: AppLayoutProps) {
  const { collapsed, toggle } = useSidebarStore()
  const { url, props } = usePage()
  const user = (props.auth as { user: UserType }).user
  const permisos = (props as unknown as { permisos?: string[] }).permisos ?? []
  const [mobileOpen, setMobileOpen] = useState(false)
  const effectiveCollapsed = collapsed && !mobileOpen

  useEffect(() => {
    setMobileOpen(false)
  }, [url])

  const navLink = (href: string, icon: React.ReactNode, label: string) => {
    const isDashboard = href === '/dashboard'
    const active = isDashboard ? url === href : url.startsWith(href)
    return (
      <Link
        key={href}
        href={href}
        className={cn(
          'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
          active
            ? 'bg-primary-foreground/15 text-primary-foreground'
            : 'text-primary-foreground/70'
        )}
      >
        <span className="h-5 w-5 shrink-0">{icon}</span>
        {!effectiveCollapsed && <span>{label}</span>}
      </Link>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Head title={title ? `${title} - ORION-X` : 'ORION-X'} />

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-primary text-primary-foreground transition-all duration-300 lg:static',
          effectiveCollapsed ? 'w-16' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
          {effectiveCollapsed ? (
            <span className="mx-auto text-lg font-bold tracking-tight">O</span>
          ) : (
            <span className="text-lg font-bold tracking-tight">ORION-X</span>
          )}
          <button
            onClick={toggle}
            className="ml-auto hidden rounded-md p-1 hover:bg-primary-foreground/10 lg:block"
          >
            {effectiveCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto rounded-md p-1 hover:bg-primary-foreground/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-2">
          {navLink('/dashboard', <LayoutDashboard className="h-5 w-5" />, 'Dashboard')}

          {navLink('/portal', <LayoutDashboard className="h-5 w-5" />, 'Mi Espacio')}

          {permisos.includes('solicitudes') && navLink('/solicitudes', <ClipboardList className="h-5 w-5" />, 'Solicitudes')}

          {permisos.includes('rrhh') && navLink('/rrhh', <Users className="h-5 w-5" />, 'RRHH')}
        </nav>

        <div className="border-t border-primary-foreground/20 p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg transition-colors hover:bg-primary-foreground/10',
                  effectiveCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                )}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-foreground/20 text-sm font-semibold text-primary-foreground">
                  {user.foto_perfil_url ? (
                    <img src={user.foto_perfil_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                {!effectiveCollapsed && (
                  <div className="flex flex-1 items-center gap-2 overflow-hidden">
                    <div className="flex-1 overflow-hidden text-left">
                      <p className="truncate text-sm font-medium text-primary-foreground">{user.name}</p>
                      <p className="truncate text-xs text-primary-foreground/60">{user.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 shrink-0 text-primary-foreground/60" />
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem asChild>
                <Link href={route('profile.edit')} className="flex w-full cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <button
                  onClick={async () => {
                    const result = await Swal.fire({
                      title: '¿Cerrar sesión?',
                      text: 'Serás redirigido a la pantalla de inicio.',
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonText: 'Sí, cerrar sesión',
                      cancelButtonText: 'Cancelar',
                    })
                    if (result.isConfirmed) router.post(route('logout'), {}, {})
                  }}
                  className="flex w-full cursor-pointer items-center px-2 py-1.5 text-sm text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center border-b bg-card px-4 lg:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-2 rounded-md p-2 hover:bg-accent lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="ml-2 text-base font-semibold tracking-tight lg:hidden">
            ORION-X
          </span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <ToastProvider>{children}</ToastProvider>
        </main>
      </div>
    </div>
  )
}
