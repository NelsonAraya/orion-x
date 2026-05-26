# ORION-X — Memoria de Estructura y Stack

## Versiones

| Herramienta | Versión |
|------------|---------|
| Laravel | 13.9.0 |
| PHP | 8.4.21 |
| React | 18.3.1 |
| Inertia.js (react) | 2.3.23 |
| Node.js | 26.1.0 |
| npm | 11.13.0 |
| Tailwind CSS | 3.4.19 |
| TypeScript | 5.9.3 |
| Vite | 8.0.13 |

## Stack completo

### Plugins y paquetes PHP (composer.json)

| Paquete | Versión instalada | Propósito |
|---------|-------------------|-----------|
| `laravel/framework` | v13.9.0 | Framework principal |
| `inertiajs/inertia-laravel` | v2.0.24 | Inertia server-side adapter |
| `predis/predis` | v3.4.2 | Cliente Redis para queue/cache |
| `laravel/horizon` | v5.46.0 | Dashboard de colas Redis |
| `laravel/sanctum` | v4.3.2 | API tokens / SPA auth |
| `league/flysystem-aws-s3-v3` | ^3.34.0 | Driver S3 para almacenamiento de archivos |
| `tightenco/ziggy` | v2.6.2 | Helper `route()` en JS |
| `laravel/tinker` | v3.0.2 | REPL interactivo |
| `laravel/breeze` (dev) | v2.4.1 | Scaffolding auth inicial |
| `pestphp/pest` (dev) | v4.7.0 | Testing framework |
| `fakerphp/faker` (dev) | v1.24.1 | Generación de datos fake |

### Plugins y paquetes NPM (package.json)

| Paquete | Versión (rango) | Propósito |
|---------|-----------------|-----------|
| `react` | ^18.2.0 | UI library |
| `react-dom` | ^18.2.0 | Renderizado DOM |
| `@inertiajs/react` | ^2.0.0 | Inertia client-side adapter |
| `typescript` | ^5.0.2 | Tipado estático |
| `tailwindcss` | ^3.2.1 | CSS utility framework |
| `vite` | ^8.0.0 | Build tool |
| `@vitejs/plugin-react` | ^4.2.0 | React plugin para Vite |
| `laravel-vite-plugin` | ^3.1 | Laravel plugin para Vite |
| `zustand` | ^5.0.13 | Estado global (sidebarStore) |
| `lucide-react` | ^1.16.0 | Iconos |
| `sweetalert2` | ^11.17.2 | Diálogos de confirmación |
| `class-variance-authority` | ^0.7.1 | Variantes de componentes (shadcn) |
| `tailwind-merge` | ^3.6.0 | Merge de clases Tailwind |
| `clsx` | ^2.1.1 | Condicional de clases |
| `tailwindcss-animate` | ^1.0.7 | Animaciones Tailwind |
| `react-hook-form` | ^7.75.0 | Manejo de formularios |
| `@hookform/resolvers` | ^5.2.2 | Validación con schemas |
| `zod` | ^4.4.3 | Validación de schemas |
| `recharts` | ^3.8.1 | Gráficos |
| `@radix-ui/react-dialog` | ^1.1.15 | Modal accesible |
| `@radix-ui/react-dropdown-menu` | ^2.1.16 | Dropdown menu accesible |
| `@radix-ui/react-label` | ^2.1.8 | Label accesible |
| `@radix-ui/react-select` | ^2.2.6 | Select accesible |
| `@radix-ui/react-slot` | ^1.2.4 | Composición de componentes |
| `@radix-ui/react-tabs` | ^1.1.13 | Tabs accesibles |
| `@radix-ui/react-checkbox` | ^1.0.4 | Checkbox accesible |
| `@tailwindcss/forms` | ^0.5.3 | Estilos base para forms |
| `@headlessui/react` | ^2.0.0 | Componentes headless UI |
| `postcss` | ^8.4.31 | Procesador CSS |
| `autoprefixer` | ^10.4.12 | Prefixes CSS |
| `concurrently` | ^9.0.1 | Ejecutar múltiples procesos |
| `eslint` + plugins | ^8.57.0 | Linting |
| `prettier` + plugins | ^3.3.0 | Formateo |

## Estructura de directorios

```
orion-x/
├── app/
│   ├── Helpers/
│   │   ├── RutHelper.php                  ─ Formateo de RUT chileno
│   │   └── VacacionesHelper.php           ─ Cálculo períodos/días vacaciones
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/                      ─ Controladores de autenticación (Breeze)
│   │   │   ├── Controller.php             ─ Base controller
│   │   │   ├── DashboardController.php    ─ Dashboard (una acción: index)
│   │   │   ├── PortalController.php       ─ Mi Espacio (permisos/vacaciones propias)
│   │   │   ├── ProfileController.php      ─ Perfil de usuario (simplificado, sin catálogos)
│   │   │   ├── SolicitudesController.php  ─ Bandeja de Solicitudes (aceptar/rechazar)
│   │   │   └── Rrhh/
│   │   │       └── RrhhUserController.php ─ RRHH: CRUD usuarios + OTT + permisos + vacaciones
│   │   └── Requests/
│   │       ├── Auth/LoginRequest.php
│   │       ├── ProfileUpdateRequest.php
│   │       ├── Ott/
│   │   │   ├── StoreOttRequest.php       ─ Validación crear OTT
│   │   │   └── StoreOttFileRequest.php   ─ Validación subir PDF a OTT
│   │       ├── Rrhh/
│   │       │   ├── StoreUserRequest.php   ─ RRHH: validación crear usuario
│   │       │   └── UpdateUserRequest.php  ─ RRHH: validación editar usuario
│   │       ├── Permiso/
│   │       │   └── StorePermisoRequest.php ─ Validación crear permiso (con detalles)
│   │       └── Vacacion/
│   │           ├── StoreVacacionRequest.php      ─ Validación solicitud vacaciones
│   │           └── StoreVacacionHistoricoRequest.php ─ Validación registro histórico
│   ├── Models/
│   │   ├── User.php                       ─ Usuario completo ($fillable, relaciones, accessors)
│   │   ├── Sexo.php
│   │   ├── Nacionalidad.php
│   │   ├── Profesion.php
│   │   ├── Prevision.php
│   │   ├── Afp.php
│   │   ├── Estado.php
│   │   ├── TipoOrden.php, TipoContrato.php, EstadoOtt.php, CentroCosto.php
│   │   ├── OrdenTrabajo.php              ─ OTT (relación files + deleting event limpia S3)
│   │   ├── OttFile.php                  ─ Archivos adjuntos a OTT (S3)
│   │   ├── TipoPermiso.php, EstadoPermiso.php
│   │   ├── Permiso.php                   ─ Permiso con detalles dinámicos
│   │   ├── PermisoDetalle.php            ─ Detalle por día (Con Goce)
│   │   ├── EstadoVacacione.php           ─ Estados vacaciones (4)
│   │   ├── Vacacione.php                 ─ Vacaciones (solicitud única)
│   │   ├── VacacionPeriodo.php           ─ Desglose por período de cada solicitud
│   │   └── PermisoSistema.php            ─ Permisos del sistema (rrhh, solicitudes, etc.)
│   ├── Notifications/
│   │   ├── PermisoCreada.php            ─ Notif. al crear permiso
│   │   ├── PermisoAceptada.php          ─ Notif. al aceptar permiso
│   │   ├── PermisoRechazada.php         ─ Notif. al rechazar permiso
│   │   ├── VacacionCreada.php           ─ Notif. al crear vacaciones
│   │   ├── VacacionAceptada.php         ─ Notif. al aceptar vacaciones
│   │   ├── VacacionRechazada.php        ─ Notif. al rechazar vacaciones
│   │   └── VacacionAnulada.php          ─ Notif. al anular vacaciones
│   └── Providers/
│       ├── AppServiceProvider.php
│       ├── RepositoryServiceProvider.php
│       └── ServiceServiceProvider.php
├── bootstrap/
│   └── app.php                          ─ Middleware, excepciones, routing
├── config/
│   ├── app.php
│   ├── auth.php
│   ├── cache.php
│   ├── database.php
│   ├── filesystems.php
│   ├── horizon.php                      ─ Config de Laravel Horizon
│   ├── logging.php
│   ├── mail.php
│   ├── queue.php
│   ├── sanctum.php
│   ├── session.php
│   └── services.php
├── database/
│   ├── database.sqlite                  ─ Base de datos SQLite (dev)
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   ├── 2025_01_01_000001_create_catalog_tables.php
│   │   ├── 2026_05_16_010532_add_foto_perfil_to_users_table.php
│   │   ├── 2026_05_16_000004_create_permisos_tables.php
│   │   ├── 2026_05_16_140345_add_jornada_to_permisos.php
│   │   ├── 2026_05_16_xxxxxx_create_permiso_detalles_table.php
│   │   ├── 2026_05_16_xxxxxx_create_estados_vacaciones_table.php
│   │   ├── 2026_05_16_xxxxxx_create_vacaciones_table.php
│   │   ├── 2026_05_16_153403_make_fechas_nullable_in_vacaciones.php
│   │   ├── 2026_05_16_160121_create_vacacion_periodos_table.php
│   │   ├── 2026_05_16_160838_drop_periodo_numero_from_vacaciones.php
│   │   ├── 2026_05_16_164059_create_permisos_sistema_table.php
│   │   └── 2026_05_16_164100_create_user_permiso_sistema_table.php
│   └── seeders/
│       ├── DatabaseSeeder.php
│       ├── AdminUserSeeder.php
│       ├── SexoSeeder.php
│       ├── NacionalidadSeeder.php
│       ├── ProfesionSeeder.php
│       ├── PrevisionSeeder.php
│       ├── AfpSeeder.php
│       ├── EstadoSeeder.php
│       ├── PermisoSistemaSeeder.php        ─ 2 permisos (rrhh, solicitudes) (firstOrCreate)
│       ├── TipoPermisoSeeder.php         ─ 7 tipos (firstOrCreate)
│       ├── EstadoPermisoSeeder.php       ─ 3 estados (firstOrCreate)
│       └── EstadoVacacionSeeder.php      ─ 4 estados (firstOrCreate)
├── docs/                                ─ Documentación del proyecto
│   ├── memory-estructura.md
│   └── memory-modulos.md
├── public/
│   ├── build/                           ─ Assets compilados por Vite
│   └── storage/ → storage/app/public    ─ Symlink para archivos subidos
├── resources/
│   ├── css/
│   │   └── app.css                      ─ Tailwind v3 + variables HSL (sin dark)
│   ├── js/
│   │   ├── app.tsx                      ─ Entry point Inertia + React
│   │   ├── Components/
│   │   │   ├── ui/                      ─ shadcn/ui components (12: button, card, input, label, dialog, dropdown-menu, select, badge, table, tabs, checkbox, toast)
│   │   │   ├── ConfirmDialog.tsx        ─ Diálogo de confirmación (sin portal)
│   │   │   └── ToastProvider.tsx        ─ Provider de notificaciones toast
│   │   ├── Layouts/
│   │   │   ├── AppLayout.tsx            ─ Layout principal (sidebar azul + header)
│   │   │   └── GuestLayout.tsx          ─ Layout público (shadcn/ui)
│   │   ├── lib/
│   │   │   └── utils.ts                ─ cn(), formatDate(), etc.
│   │   ├── Pages/
│   │   │   ├── Auth/                    ─ 6 páginas de autenticación (shadcn/ui)
│   │   │   ├── Dashboard/Index.tsx      ─ Saludo personalizado
│   │   │   ├── Portal/Index.tsx          ─ Mi Espacio (3 tabs: Permisos, Vacaciones, Órdenes)
│   │   │   ├── Profile/                 ─ Perfil con foto + partials (shadcn/ui + AppLayout)
│   │   │   │   └── Partials/            ─ 2 partials (información + contraseña)
│   │   │   ├── Rrhh/                    ─ RRHH: Index, Create, Edit (7 tabs)
│   │   │   └── Solicitudes/             ─ Bandeja de Solicitudes
│   │   │       └── Index.tsx            ─ 2 cards (Permisos/Vacaciones pendientes)
│   │   ├── stores/
│   │   │   └── sidebarStore.ts          ─ Estado del sidebar (colapsado)
│   │   └── types/
│   │       ├── global.d.ts              ─ Tipos globales (Ziggy, Inertia)
│   │       ├── index.ts                 ─ Interfaces del proyecto (User, PageProps, CatalogItem)
│   │       └── vite-env.d.ts            ─ Tipos de Vite
│   └── views/
│       └── app.blade.php                ─ Layout Blade raíz (Outfit + DM Sans)
├── routes/
│   ├── auth.php                         ─ Rutas de autenticación (Breeze)
│   ├── console.php
│   └── web.php                          ─ Dashboard + perfil + RRHH + Portal + Solicitudes
├── storage/
│   └── app/public/avatars/              ─ Fotos de perfil subidas
├── .env
├── .env.example
├── composer.json
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
├── tsconfig.json
└── components.json                      ─ Config de shadcn/ui
```

## Configuración de base de datos

- **Driver (dev)**: SQLite
- **Driver (prod)**: PostgreSQL
- **Conexión actual** (`.env`):
  ```
  DB_CONNECTION=sqlite
  ```
  Sin host/port — SQLite usa archivo `database/database.sqlite`.
- **Migraciones ejecutadas**: 15 (usuarios, caché, jobs, catálogos, foto_perfil, permisos, jornada, detalles, estados_vacaciones, vacaciones, nullable_fechas, vacacion_periodos, drop_periodo_numero, permisos_sistema, user_permiso_sistema)

## Paleta de colores actual

| Variable | HSL | Color |
|----------|-----|-------|
| `--primary` | `215 79% 49%` | `#1B6DE0` — azul corporativo |
| `--primary-foreground` | `0 0% 98%` | blanco |
| `--secondary` | `180 22% 34%` | `#436B6B` — teal |
| `--secondary-foreground` | `0 0% 98%` | blanco |
| `--background` | `0 0% 97%` | gris muy claro (contenido) |
| `--foreground` | `215 25% 12%` | texto oscuro |
| `--card` | `0 0% 100%` | blanco (tarjetas) |
| `--card-foreground` | `215 25% 12%` | texto oscuro |
| `--popover` | `0 0% 100%` | blanco (popovers) |
| `--popover-foreground` | `215 25% 12%` | texto oscuro |
| `--muted` | `215 10% 92%` | gris azulado suave |
| `--muted-foreground` | `215 10% 45%` | gris medio |
| `--accent` | `215 10% 92%` | igual que muted |
| `--accent-foreground` | `215 25% 12%` | texto oscuro |
| `--destructive` | `0 72% 48%` | `#D32F2F` — rojo |
| `--destructive-foreground` | `0 0% 98%` | blanco |
| `--border` | `215 15% 85%` | bordes |
| `--input` | `215 15% 85%` | bordes de input |
| `--ring` | `215 79% 49%` | focus ring |
| `--radius` | `0.625rem` | esquinas redondeadas |

## Variables de entorno requeridas

| Variable | Valor dev actual | Descripción |
|----------|-----------------|-------------|
| `APP_NAME` | ORION-X | Nombre de la aplicación |
| `APP_ENV` | local | Entorno |
| `APP_KEY` | generada | Clave de cifrado |
| `APP_DEBUG` | true | Modo debug |
| `APP_URL` | http://localhost:8000 | URL base |
| `DB_CONNECTION` | sqlite | Driver de BD (dev) |
| `SESSION_DRIVER` | file | Driver de sesión (dev) |
| `SESSION_LIFETIME` | 120 | Minutos de sesión |
| `QUEUE_CONNECTION` | sync | Driver de cola (dev) |
| `CACHE_STORE` | file | Driver de caché (dev) |
| `MAIL_MAILER` | smtp | Driver de mail (Gmail SMTP) |
| `MAIL_HOST` | smtp.gmail.com | Host SMTP |
| `MAIL_PORT` | 587 | Puerto SMTP |
| `MAIL_USERNAME` | l2.irux@gmail.com | Cuenta Gmail |
| `MAIL_PASSWORD` | (contraseña de aplicación) | App password Gmail |
| `MAIL_ENCRYPTION` | tls | Encriptación |
| `MAIL_FROM_ADDRESS` | l2.irux@gmail.com | Remitente |
| `MAIL_FROM_NAME` | "${APP_NAME}" | Nombre remitente |
| `FILESYSTEM_DISK` | local | Disco de archivos |

Para **producción Linux**: cambiar `DB_CONNECTION=pgsql`, `QUEUE_CONNECTION=redis`, `CACHE_STORE=redis`, `SESSION_DRIVER=redis`.

## Comandos útiles del proyecto

```bash
# Desarrollo — frontend
npm run dev              # Inicia Vite dev server con HMR
npm run build            # Compila TypeScript + empaqueta para producción

# Desarrollo — backend
php artisan serve        # Servidor PHP dev (http://localhost:8000)
php artisan migrate      # Ejecuta migraciones
php artisan migrate:fresh # Reinicia BD desde cero
php artisan storage:link # Crea symlink public/storage → storage/app/public
php artisan route:list   # Lista rutas registradas
php artisan tinker       # REPL interactivo

# Ambos simultáneos
composer run dev         # Inicia server + queue + logs + vite con concurrently

# Testing
php artisan test         # Pest tests
```

## S3 / Almacenamiento de Archivos

- Disco S3 configurado en `config/filesystems.php`, driver `s3`
- Bucket: `orion-cormudesi-files` (us-east-1)
- Archivos de OTT se almacenan en `ott-files/{orden_id}/{uuid}.pdf`
- Descarga vía `Storage::disk('s3')->download()` (stream directo desde S3)
- Evento `deleting` en `OrdenTrabajo` limpia archivos S3 al eliminar una OTT

## Decisiones arquitectónicas

### Inertia.js v2 + React 18
- Sin SSR (SPA clásico)
- Rutas desde backend compartidas vía Ziggy (inyectadas con `@routes`)
- Layout principal `AppLayout` con sidebar azul fijo + header limpio

### Paleta de colores fija (sin modo oscuro)
- Tema fijo con variables CSS HSL en `:root`, sin `.dark`
- Color primario: `--primary: 215 79% 49%` (azul corporativo `#1B6DE0`)
- Sidebar usa `bg-primary text-primary-foreground` (fondo azul, texto blanco)
- Fondo de contenido: `--background: 0 0% 97%` (gris muy claro)
- Sin toggle de tema, sin themeStore

### Tipografía
- **Outfit** para headings (`font-heading`)
- **DM Sans** para cuerpo (`font-sans`)
- Cargadas desde Google Fonts via `fonts.bunny.net`

### Componentes UI
- **shadcn/ui** sobre Radix Primitives: Button, Card, Input, Label, Dialog, DropdownMenu, Select, Badge, Table, Tabs, Checkbox, Toast
- ConfirmDialog personalizado (sin portal, z-[200] fijo) para evitar conflictos con overlays de Dialog
- ToastProvider + ui/toast para notificaciones de éxito
- Componentes Breeze legacy eliminados y reemplazados por shadcn
- Esquinas suaves (`--radius: 0.625rem`)

### Sidebar responsive
- Desktop: colapsable (w-64 / w-16) con botón toggle
- Mobile: oculta por defecto, se abre con hamburguesa (w-64), se cierra con X o backdrop
- Datos del usuario al pie: avatar (foto o iniciales) + nombre + email + dropdown (Perfil / Cerrar sesión)
- En mobile con sidebar abierta, se ignora el estado `collapsed` (siempre w-64)
- La foto de perfil se muestra en el avatar cuando `foto_perfil_url` está disponible

### Perfil de usuario
- Formulario simplificado: solo nombres, apellidos, email + foto de perfil
- Catálogos (sexo, nacionalidad, profesión, etc.) eliminados del perfil
- Foto se almacena en `storage/app/public/avatars/` y se sirve via `public/storage`
- Dos paneles (información + contraseña) en grid `lg:grid-cols-2` en desktop
- Sin sección "Eliminar cuenta" (el backend tiene la ruta pero no hay UI)

### Modelo User
- `$fillable` simplificado: solo datos básicos + `foto_perfil`
- Accessors: `name` (nombres + apellido paterno), `fotoPerfilUrl` (asset URL), `rutCompleto` (RUT formateado)
- `$appends` incluye `name` y `foto_perfil_url` para que lleguen al frontend vía Inertia
- Relaciones con catálogos: sexo, nacionalidad, profesión, prevision, afp, estado
- Relación `permisosSistema()`: BelongsToMany con PermisoSistema via `user_permiso_sistema`

### Login con validación de estado
- `LoginRequest.php::authenticate()` verifica que `$user->estado?->nombre === 'Activo'` después de autenticar
- Usuarios inactivos son rechazados con mensaje: "Tu cuenta no está activa. Contacta al administrador."
- Se aplica `Auth::logout()` + rate limiting en caso de rechazo

### Permisos del sistema (control de acceso global)
- Tabla `permisos_sistema` con columnas: id, nombre, slug, descripcion
- Pivot `user_permiso_sistema` (user_id, permiso_id)
- Modelo `PermisoSistema` con relación `users()` belongsToMany
- Seeder: `PermisoSistemaSeeder` crea permisos `rrhh` y `solicitudes` (firstOrCreate)
- Se comparten globalmente vía `HandleInertiaRequests.php`:
  ```php
  'permisos' => $request->user()?->permisosSistema?->pluck('slug') ?? [],
  ```
- `PageProps` en `types/index.ts` incluye `permisos: string[]`
- `AppLayout.tsx` muestra items condicionales según permisos:
  - `Mi Espacio` (siempre visible)
  - `Solicitudes` si `permisos.includes('solicitudes')`
  - `RRHH` si `permisos.includes('rrhh')`
  - Sin headers de sección (solo links cliqueables)
- `Rrhh/Edit.tsx` tab Sistema: switches toggle para asignar/remover permisos al usuario, con ruta `PATCH /rrhh/{user}/permisos-sistema`

### Confirmaciones con sweetalert2 (legacy) / ConfirmDialog + ToastProvider
- sweetalert2 instalado pero **solo se usa en páginas legacy** (Auth, Profile, Create, Rrhh/Create)
- En `Rrhh/Edit.tsx` y `Solicitudes/Index.tsx` sweetalert2 fue **reemplazado completamente** por:
  - `ConfirmDialog`: componente sin portal (z-[200]) para evitar conflictos con overlays de Radix Dialog
  - `ToastProvider` + `ui/toast`: notificaciones de éxito no obstructivas
- Acciones que usan ConfirmDialog: guardar perfil, crear/eliminar OTT, crear/eliminar/aceptar permiso, crear/eliminar/aceptar vacación, registrar histórico, aceptar/rechazar solicitudes

### Módulo RRHH
- Ruta: `/rrhh` (name: `rrhh.index`), `/rrhh/create` (`rrhh.create`), `POST /rrhh` (`rrhh.store`)
- Controlador: `RrhhUserController` con index, create, store, edit, update + métodos OTT/permiso/vacacion
- Request: `StoreUserRequest` (crear) + `UpdateUserRequest` (editar) + `StorePermisoRequest` + `StoreVacacionRequest` + `StoreVacacionHistoricoRequest`
- Frontend:
  - `Rrhh/Index.tsx`: tabla paginada con búsqueda + badge de estado por color
  - `Rrhh/Create.tsx`: formulario en 2 cards (Datos Personales + Info. Laboral), grid `md:grid-cols-2`
  - `Rrhh/Edit.tsx`: 7 tabs (Datos, Laboral, OTT, Permisos, Vacaciones, Mérito, Sistema):
    - Tabs responsive: flex-wrap (3 por fila) en mobile con h-auto min-h-9, icons shrink-0, texto abreviado
    - Permisos: 7 tipos (con/sin goce), filas dinámicas Con Goce, card resumen bloques
    - Vacaciones: tabla periodos + tabla solicitudes, 4 estados, dialogs crear/aceptar/rechazar/anular
    - Registro histórico: modal independiente con distribución FIFO + vista previa
    - Mérito/Demérito: card placeholder vacío (próximamente)
    - Sistema: lista de switches toggle para asignar permisos_sistema
- Contraseña: se genera automáticamente como el RUT sin dígito verificador
- Catálogos: todos los catálogos existentes se pasan a la vista create/edit
- Animaciones: `animate-fade-in-up` con delays para entrada escalonada
- **Vacaciones:**
  - `VacacionesHelper.php`: calcularPeriodos, calcularDiasCorrespondientes (CT: 20 + intdiv(max(0, años-10)+2,3)), contarDiasHabiles, calcularDiasUsados, esSalud
  - Tipo trabajador se determina desde última OTT (tipo_orden), no campo en users
  - Períodos calculados dinámicamente por aniversario de fecha_ingreso
  - 4 estados: Ingresada, Aceptada, Rechazada, Anulada
- **Seeders idempotentes:** `firstOrCreate` en todos los catálogos para evitar duplicados al re-ejecutar `db:seed`

### Portal de Autoservicio (Mi Espacio)
- Ruta: `/portal` (name: `portal.index`), `POST /portal/permisos` (`portal.permisos.store`), `POST /portal/vacaciones` (`portal.vacaciones.store`)
- Controlador: `PortalController` con index, storePermiso, storeVacacion (siempre usa `auth()->id()`)
- Frontend: `Portal/Index.tsx` con 3 tabs internos (Permisos, Vacaciones, Órdenes)
- Cada empleado solo ve sus propios datos, crea solicitudes en estado Ingresada
- Sin botones de gestión (aceptar/rechazar/eliminar) — solo crear
- Si el usuario no tiene `fecha_ingreso`:
  - Se muestra card ámbar con advertencia en tab Vacaciones
  - Botones "Nueva Solicitud" y "Crear primera solicitud" aparecen deshabilitados
  - Prop `tiene_fecha_ingreso` pasada desde `PortalController::index()`
- `StoreVacacionRequest` usa `$this->route('user') ?? auth()->id()` para ser compatible con ambas rutas (RRHH con `{user}` y Portal sin `{user}`)

### Bug fix: colisión de clave `permisos`
- La shared prop `permisos` (string[] de slugs) colisionaba con la page prop `permisos` (array de objetos Permiso) en `RrhhUserController::edit()` y `PortalController::index()`
- Causaba que `HandleInertiaRequests.php` sobrescribiera la page prop al compartir `permisos` globalmente
- Síntoma: el menú RRHH desaparecía del sidebar en las páginas de edición y portal
- Fix: renombrar `permisos` → `lista_permisos` en ambos controladores y sus respectivos frontends (Edit.tsx, Portal/Index.tsx)

### Base de datos
- SQLite en desarrollo (cero configuración)
- Preparado para PostgreSQL en producción (cambiar `.env` + habilitar extensión PHP)
- Catálogos (sexo, nacionalidades, profesiones, previsiones, afps, estados) con nombres en español

### Colas y Caché
- Dev: `sync` + `file` (sin Redis)
- Prod: Redis via `predis/predis` + `laravel/horizon`
- `QUEUE_CONNECTION=sync` en dev no requiere worker
- `CACHE_STORE=file` en dev usa sistema de archivos

### Notificaciones por Email
- 7 clases de notificación en `app/Notifications/`:
  - `PermisoCreada` — al empleado cuando se crea un permiso
  - `PermisoAceptada` — al empleado cuando se acepta un permiso
  - `PermisoRechazada` — al empleado cuando se rechaza un permiso (incluye motivo)
  - `VacacionCreada` — al empleado cuando se crea una solicitud de vacaciones
  - `VacacionAceptada` — al empleado cuando se aceptan las vacaciones
  - `VacacionRechazada` — al empleado cuando se rechazan las vacaciones (incluye motivo)
  - `VacacionAnulada` — al empleado cuando se anulan las vacaciones (incluye motivo)
- Configuradas con **Gmail SMTP** (contraseña de aplicación)
- Implementan `ShouldQueue`; con `QUEUE_CONNECTION=sync` se envían inline
- **Solo al empleado afectado** (nunca a administradores)
- El registro histórico de vacaciones **no** envía notificación
- Formato del mensaje: salutation sin `<br>`, incluye `**Solicitud:** #PERM-{id}` / `**Solicitud:** #VAC-{id}`, `**Motivo:**`, `**Gestionado el:** {fecha}`

### Bandeja de Solicitudes
- Ruta: `/solicitudes` (name: `solicitudes.index`)
- Controlador: `SolicitudesController` independiente de RRHH, reutiliza lógica similar pero redirige a `solicitudes.index`
- Frontend: `Solicitudes/Index.tsx` con 2 cards separadas (Permisos Pendientes + Vacaciones Pendientes)
- Muestra **solo solicitudes en estado Ingresada**
- Acciones disponibles: Aceptar (ConfirmDialog) / Rechazar (Dialog con textarea, min 5 caracteres)
- Notificaciones email al empleado afectado al aceptar o rechazar
- Requiere permiso `solicitudes` para acceder (compartido vía `HandleInertiaRequests.php`)
- Layout usa patrón `.layout = (page) => <AppLayout ...>` (mismo que RRHH Edit)
- Columnas en tabla: Funcionario (en lugar de Empleado)
