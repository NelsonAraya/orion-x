import { ToastProvider } from '@/Components/ToastProvider';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebarStore';
import type { User as UserType } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Building2,
    CalendarDays,
    CalendarRange,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CircleDollarSign,
    ClipboardCheck,
    ClipboardList,
    ClipboardPen,
    Clock,
    Cross,
    FileBarChart,
    FileStack,
    LayoutDashboard,
    List,
    LogOut,
    MapPin,
    Menu,
    Plus,
    Save,
    Search,
    User,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import Swal from 'sweetalert2';

function getInitials(name: string) {
    return name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

interface AppLayoutProps {
    title?: string;
    children: ReactNode;
}

export default function AppLayout({ title, children }: AppLayoutProps) {
    const { collapsed, toggle } = useSidebarStore();
    const { url, props } = usePage();
    const user = (props.auth as { user: UserType }).user;
    const permisos =
        (props as unknown as { permisos?: string[] }).permisos ?? [];
    const hasCementerioSubPermisos = permisos.some(
        (p) => p.startsWith('cementerio-') && p !== 'cementerio',
    );
    const canShowCementerioItem = (slug: string) =>
        !hasCementerioSubPermisos || permisos.includes(slug);
    const [mobileOpen, setMobileOpen] = useState(false);
    const effectiveCollapsed = collapsed && !mobileOpen;

    useEffect(() => {
        setMobileOpen(false);
    }, [url]);

    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
        {},
    );

    const toggleMenu = (key: string) => {
        setExpandedMenus((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const navLink = (href: string, icon: React.ReactNode, label: string) => {
        const isDashboard = href === '/dashboard';
        const active = isDashboard ? url === href : url.startsWith(href);
        return (
            <Link
                key={href}
                href={href}
                className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                    active
                        ? 'bg-primary-foreground/15 text-primary-foreground'
                        : 'text-primary-foreground/70',
                )}
            >
                <span className="h-5 w-5 shrink-0">{icon}</span>
                {!effectiveCollapsed && <span>{label}</span>}
            </Link>
        );
    };

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
                    mobileOpen
                        ? 'translate-x-0'
                        : '-translate-x-full lg:translate-x-0',
                )}
            >
                <div className="flex h-14 items-center border-b border-primary-foreground/10 px-4">
                    {effectiveCollapsed ? (
                        <span className="mx-auto text-lg font-bold tracking-tight">
                            O
                        </span>
                    ) : (
                        <span className="text-lg font-bold tracking-tight">
                            ORION-X
                        </span>
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
                    {navLink(
                        '/dashboard',
                        <LayoutDashboard className="h-5 w-5" />,
                        'Dashboard',
                    )}

                    {navLink(
                        '/portal',
                        <LayoutDashboard className="h-5 w-5" />,
                        'Mi Espacio',
                    )}

                    {permisos.includes('solicitudes') &&
                        navLink(
                            '/solicitudes',
                            <ClipboardList className="h-5 w-5" />,
                            'Solicitudes',
                        )}

                    {permisos.includes('rrhh') &&
                        navLink('/rrhh', <Users className="h-5 w-5" />, 'RRHH')}

                    {permisos.includes('cementerio') && (
                        <div>
                            <button
                                onClick={() => toggleMenu('cementerio')}
                                className={cn(
                                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                    !effectiveCollapsed &&
                                        expandedMenus.cementerio
                                        ? 'bg-primary-foreground/15 text-primary-foreground'
                                        : 'text-primary-foreground/70',
                                )}
                            >
                                <Cross className="h-4 w-4 shrink-0" />
                                <span className="flex-1 text-left">
                                    Cementerio
                                </span>
                                <ChevronDown
                                    className={cn(
                                        'h-3.5 w-3.5 transition-transform',
                                        expandedMenus.cementerio &&
                                            'rotate-180',
                                    )}
                                />
                            </button>

                            {expandedMenus.cementerio &&
                                !effectiveCollapsed && (
                                    <div className="ml-3 mt-1 space-y-1 border-l border-primary-foreground/20 pl-3">
                                        {(canShowCementerioItem(
                                            'cementerio-registro-fallecido',
                                        ) ||
                                            canShowCementerioItem(
                                                'cementerio-historial-deudores',
                                            )) && (
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        toggleMenu(
                                                            'registro_fallecido',
                                                        )
                                                    }
                                                    className={cn(
                                                        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                        !effectiveCollapsed &&
                                                            expandedMenus.registro_fallecido
                                                            ? 'bg-primary-foreground/15 text-primary-foreground'
                                                            : 'text-primary-foreground/70',
                                                    )}
                                                >
                                                    <Save className="h-4 w-4 shrink-0" />
                                                    <span className="flex-1 text-left">
                                                        Gestión Mortuaria
                                                    </span>
                                                    <ChevronDown
                                                        className={cn(
                                                            'h-3.5 w-3.5 transition-transform',
                                                            expandedMenus.registro_fallecido &&
                                                                'rotate-180',
                                                        )}
                                                    />
                                                </button>

                                                {expandedMenus.registro_fallecido && (
                                                    <div className="ml-4 mt-1 space-y-1">
                                                        {canShowCementerioItem(
                                                            'cementerio-registro-fallecido',
                                                        ) && (
                                                            <Link
                                                                href="/cementerio/registro-fallecido"
                                                                className={cn(
                                                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                                    url.startsWith(
                                                                        '/cementerio/registro-fallecido',
                                                                    )
                                                                        ? 'bg-primary-foreground/15 text-primary-foreground'
                                                                        : 'text-primary-foreground/70',
                                                                )}
                                                            >
                                                                <Save className="h-4 w-4 shrink-0" />
                                                                <span>
                                                                    Registro de
                                                                    Fallecido
                                                                </span>
                                                            </Link>
                                                        )}
                                                        {canShowCementerioItem(
                                                            'cementerio-historial-deudores',
                                                        ) && (
                                                            <Link
                                                                href="/cementerio/historial-deudores"
                                                                className={cn(
                                                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                                    url.startsWith(
                                                                        '/cementerio/historial-deudores',
                                                                    )
                                                                        ? 'bg-primary-foreground/15 text-primary-foreground'
                                                                        : 'text-primary-foreground/70',
                                                                )}
                                                            >
                                                                <CircleDollarSign className="h-4 w-4 shrink-0" />
                                                                <span>
                                                                    Historial
                                                                    Deudores
                                                                </span>
                                                            </Link>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {(canShowCementerioItem(
                                            'cementerio-ingresar-ot',
                                        ) ||
                                            canShowCementerioItem(
                                                'cementerio-buscar-ot',
                                            )) && (
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        toggleMenu(
                                                            'orden_trabajo',
                                                        )
                                                    }
                                                    className={cn(
                                                        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                        !effectiveCollapsed &&
                                                            expandedMenus.orden_trabajo
                                                            ? 'bg-primary-foreground/15 text-primary-foreground'
                                                            : 'text-primary-foreground/70',
                                                    )}
                                                >
                                                    <ClipboardPen className="h-4 w-4 shrink-0" />
                                                    <span className="flex-1 text-left">
                                                        Orden de Trabajo
                                                    </span>
                                                    <ChevronDown
                                                        className={cn(
                                                            'h-3.5 w-3.5 transition-transform',
                                                            expandedMenus.orden_trabajo &&
                                                                'rotate-180',
                                                        )}
                                                    />
                                                </button>

                                                {expandedMenus.orden_trabajo && (
                                                    <div className="ml-4 mt-1 space-y-1">
                                                        {canShowCementerioItem(
                                                            'cementerio-ingresar-ot',
                                                        ) && (
                                                            <Link
                                                                href="/cementerio/ingresar-ot"
                                                                className={cn(
                                                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                                    url.startsWith(
                                                                        '/cementerio/ingresar-ot',
                                                                    )
                                                                        ? 'bg-primary-foreground/15 text-primary-foreground'
                                                                        : 'text-primary-foreground/70',
                                                                )}
                                                            >
                                                                <Plus className="h-4 w-4 shrink-0" />
                                                                <span>
                                                                    Ingresar OT
                                                                </span>
                                                            </Link>
                                                        )}
                                                        {canShowCementerioItem(
                                                            'cementerio-buscar-ot',
                                                        ) && (
                                                            <Link
                                                                href="/cementerio/buscar-ot"
                                                                className={cn(
                                                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                                    url.startsWith(
                                                                        '/cementerio/buscar-ot',
                                                                    )
                                                                        ? 'bg-primary-foreground/15 text-primary-foreground'
                                                                        : 'text-primary-foreground/70',
                                                                )}
                                                            >
                                                                <Search className="h-4 w-4 shrink-0" />
                                                                <span>
                                                                    Buscar OT
                                                                </span>
                                                            </Link>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {(canShowCementerioItem(
                                            'cementerio-buscar-por-fallecido',
                                        ) ||
                                            canShowCementerioItem(
                                                'cementerio-consultar-ubicaciones',
                                            )) && (
                                            <div>
                                                <button
                                                    onClick={() =>
                                                        toggleMenu(
                                                            'ubicaciones',
                                                        )
                                                    }
                                                    className={cn(
                                                        'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                        !effectiveCollapsed &&
                                                            expandedMenus.ubicaciones
                                                            ? 'bg-primary-foreground/15 text-primary-foreground'
                                                            : 'text-primary-foreground/70',
                                                    )}
                                                >
                                                    <MapPin className="h-4 w-4 shrink-0" />
                                                    <span className="flex-1 text-left">
                                                        Ubicaciones
                                                    </span>
                                                    <ChevronDown
                                                        className={cn(
                                                            'h-3.5 w-3.5 transition-transform',
                                                            expandedMenus.ubicaciones &&
                                                                'rotate-180',
                                                        )}
                                                    />
                                                </button>

                                                {expandedMenus.ubicaciones && (
                                                    <div className="ml-4 mt-1 space-y-1">
                                                        {canShowCementerioItem(
                                                            'cementerio-buscar-por-fallecido',
                                                        ) && (
                                                            <Link
                                                                href="/cementerio/buscar-por-fallecido"
                                                                className={cn(
                                                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                                    url.startsWith(
                                                                        '/cementerio/buscar-por-fallecido',
                                                                    )
                                                                        ? 'bg-primary-foreground/15 text-primary-foreground'
                                                                        : 'text-primary-foreground/70',
                                                                )}
                                                            >
                                                                <Search className="h-4 w-4 shrink-0" />
                                                                <span>
                                                                    Buscar por
                                                                    Fallecido
                                                                </span>
                                                            </Link>
                                                        )}
                                                        {canShowCementerioItem(
                                                            'cementerio-consultar-ubicaciones',
                                                        ) && (
                                                            <Link
                                                                href="/cementerio/consultar-ubicaciones"
                                                                className={cn(
                                                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                                    url.startsWith(
                                                                        '/cementerio/consultar-ubicaciones',
                                                                    )
                                                                        ? 'bg-primary-foreground/15 text-primary-foreground'
                                                                        : 'text-primary-foreground/70',
                                                                )}
                                                            >
                                                                <List className="h-4 w-4 shrink-0" />
                                                                <span>
                                                                    Consultar
                                                                    Ubicaciones
                                                                </span>
                                                            </Link>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {canShowCementerioItem(
                                            'cementerio-documentos',
                                        ) && (
                                            <Link
                                                href="/cementerio/documentos"
                                                className={cn(
                                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                    url.startsWith(
                                                        '/cementerio/documentos',
                                                    )
                                                        ? 'bg-primary-foreground/15 text-primary-foreground'
                                                        : 'text-primary-foreground/70',
                                                )}
                                            >
                                                <FileStack className="h-4 w-4 shrink-0" />
                                                <span>Documentos</span>
                                            </Link>
                                        )}

                                        {canShowCementerioItem(
                                            'cementerio-reportes',
                                        ) && (
                                            <Link
                                                href="/cementerio/reportes"
                                                className={cn(
                                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                    url.startsWith(
                                                        '/cementerio/reportes',
                                                    )
                                                        ? 'bg-primary-foreground/15 text-primary-foreground'
                                                        : 'text-primary-foreground/70',
                                                )}
                                            >
                                                <BarChart3 className="h-4 w-4 shrink-0" />
                                                <span>Reportes</span>
                                            </Link>
                                        )}
                                    </div>
                                )}
                        </div>
                    )}

                    {permisos.includes('asistencia') && (
                        <div>
                            <button
                                onClick={() => toggleMenu('asistencia')}
                                className={cn(
                                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                    !effectiveCollapsed &&
                                        expandedMenus.asistencia
                                        ? 'bg-primary-foreground/15 text-primary-foreground'
                                        : 'text-primary-foreground/70',
                                )}
                            >
                                <ClipboardCheck className="h-4 w-4 shrink-0" />
                                <span className="flex-1 text-left">
                                    Asistencia
                                </span>
                                <ChevronDown
                                    className={cn(
                                        'h-3.5 w-3.5 transition-transform',
                                        expandedMenus.asistencia &&
                                            'rotate-180',
                                    )}
                                />
                            </button>

                            {expandedMenus.asistencia &&
                                !effectiveCollapsed && (
                                    <div className="ml-3 mt-1 space-y-1 border-l border-primary-foreground/20 pl-3">
                                        <Link
                                            href="/asistencia/dashboard"
                                            className={cn(
                                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                url.startsWith(
                                                    '/asistencia/dashboard',
                                                )
                                                    ? 'bg-primary-foreground/15 text-primary-foreground'
                                                    : 'text-primary-foreground/70',
                                            )}
                                        >
                                            <LayoutDashboard className="h-4 w-4 shrink-0" />
                                            <span>Dashboard</span>
                                        </Link>

                                        <div>
                                            <button
                                                onClick={() =>
                                                    toggleMenu(
                                                        'asistencia_reportes',
                                                    )
                                                }
                                                className={cn(
                                                    'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                    !effectiveCollapsed &&
                                                        expandedMenus.asistencia_reportes
                                                        ? 'bg-primary-foreground/15 text-primary-foreground'
                                                        : 'text-primary-foreground/70',
                                                )}
                                            >
                                                <FileBarChart className="h-4 w-4 shrink-0" />
                                                <span className="flex-1 text-left">
                                                    Reportes
                                                </span>
                                                <ChevronDown
                                                    className={cn(
                                                        'h-3.5 w-3.5 transition-transform',
                                                        expandedMenus.asistencia_reportes &&
                                                            'rotate-180',
                                                    )}
                                                />
                                            </button>

                                            {expandedMenus.asistencia_reportes && (
                                                <div className="ml-4 mt-1 space-y-1">
                                                    <Link
                                                        href="/asistencia/reportes/por-funcionario"
                                                        className={cn(
                                                            'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                            url.startsWith(
                                                                '/asistencia/reportes/por-funcionario',
                                                            )
                                                                ? 'bg-primary-foreground/15 text-primary-foreground'
                                                                : 'text-primary-foreground/70',
                                                        )}
                                                    >
                                                        <Users className="h-4 w-4 shrink-0" />
                                                        <span>
                                                            Por Funcionario
                                                        </span>
                                                    </Link>
                                                    <div>
                                                        <button
                                                            onClick={() =>
                                                                toggleMenu(
                                                                    'asistencia_por_unidad',
                                                                )
                                                            }
                                                            className={cn(
                                                                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                                !effectiveCollapsed &&
                                                                    expandedMenus.asistencia_por_unidad
                                                                    ? 'bg-primary-foreground/15 text-primary-foreground'
                                                                    : 'text-primary-foreground/70',
                                                            )}
                                                        >
                                                            <List className="h-4 w-4 shrink-0" />
                                                            <span className="flex-1 text-left">
                                                                Por Unidad
                                                            </span>
                                                            <ChevronDown
                                                                className={cn(
                                                                    'h-3.5 w-3.5 transition-transform',
                                                                    expandedMenus.asistencia_por_unidad &&
                                                                        'rotate-180',
                                                                )}
                                                            />
                                                        </button>

                                                        {expandedMenus.asistencia_por_unidad && (
                                                            <div className="ml-4 mt-1 space-y-1">
                                                                <Link
                                                                    href="/asistencia/reportes/por-unidad"
                                                                    className={cn(
                                                                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                                        url ===
                                                                            '/asistencia/reportes/por-unidad'
                                                                            ? 'bg-primary-foreground/15 text-primary-foreground'
                                                                            : 'text-primary-foreground/70',
                                                                    )}
                                                                >
                                                                    <Building2 className="h-4 w-4 shrink-0" />
                                                                    <span>
                                                                        Unidades
                                                                    </span>
                                                                </Link>
                                                                <Link
                                                                    href="/asistencia/reportes/por-unidad/diario"
                                                                    className={cn(
                                                                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                                        url.startsWith(
                                                                            '/asistencia/reportes/por-unidad/diario',
                                                                        )
                                                                            ? 'bg-primary-foreground/15 text-primary-foreground'
                                                                            : 'text-primary-foreground/70',
                                                                    )}
                                                                >
                                                                    <CalendarDays className="h-4 w-4 shrink-0" />
                                                                    <span>
                                                                        Diario
                                                                    </span>
                                                                </Link>
                                                                <Link
                                                                    href="/asistencia/reportes/por-unidad/mensual"
                                                                    className={cn(
                                                                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                                        url.startsWith(
                                                                            '/asistencia/reportes/por-unidad/mensual',
                                                                        )
                                                                            ? 'bg-primary-foreground/15 text-primary-foreground'
                                                                            : 'text-primary-foreground/70',
                                                                    )}
                                                                >
                                                                    <CalendarRange className="h-4 w-4 shrink-0" />
                                                                    <span>
                                                                        Mensual
                                                                    </span>
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <Link
                                            href="/asistencia/horarios"
                                            className={cn(
                                                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground',
                                                url.startsWith(
                                                    '/asistencia/horarios',
                                                )
                                                    ? 'bg-primary-foreground/15 text-primary-foreground'
                                                    : 'text-primary-foreground/70',
                                            )}
                                        >
                                            <Clock className="h-4 w-4 shrink-0" />
                                            <span>Horarios</span>
                                        </Link>
                                    </div>
                                )}
                        </div>
                    )}
                </nav>

                <div className="border-t border-primary-foreground/20 p-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className={cn(
                                    'flex w-full items-center gap-3 rounded-lg transition-colors hover:bg-primary-foreground/10',
                                    effectiveCollapsed
                                        ? 'justify-center p-2'
                                        : 'px-3 py-2',
                                )}
                            >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-foreground/20 text-sm font-semibold text-primary-foreground">
                                    {user.foto_perfil_url ? (
                                        <img
                                            src={user.foto_perfil_url}
                                            alt=""
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        getInitials(user.name)
                                    )}
                                </div>
                                {!effectiveCollapsed && (
                                    <div className="flex flex-1 items-center gap-2 overflow-hidden">
                                        <div className="flex-1 overflow-hidden text-left">
                                            <p className="truncate text-sm font-medium text-primary-foreground">
                                                {user.name}
                                            </p>
                                            <p className="truncate text-xs text-primary-foreground/60">
                                                {user.email}
                                            </p>
                                        </div>
                                        <ChevronDown className="h-4 w-4 shrink-0 text-primary-foreground/60" />
                                    </div>
                                )}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            <DropdownMenuItem asChild>
                                <Link
                                    href={route('profile.edit')}
                                    className="flex w-full cursor-pointer items-center"
                                >
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
                                            confirmButtonText:
                                                'Sí, cerrar sesión',
                                            cancelButtonText: 'Cancelar',
                                        });
                                        if (result.isConfirmed)
                                            router.post(
                                                route('logout'),
                                                {},
                                                {},
                                            );
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
    );
}
