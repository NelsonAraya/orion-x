# ORION-X — Memoria de Módulos y Funcionalidades

## Reglas del proyecto

- No hacer nada que no se pida explícitamente
- No inventar funcionalidades, tarjetas, componentes, colores ni nada no solicitado
- Si no se entiende algo, preguntar hasta estar seguro antes de actuar
- Solo modificar los archivos necesarios para la tarea específica
- Toda adición debe ser aprobada por el usuario antes de implementarse

## Índice de módulos

- [Módulo: Autenticación](#módulo-autenticación)
- [Módulo: Dashboard](#módulo-dashboard)
- [Módulo: Perfil](#módulo-perfil)
- [Módulo: RRHH](#módulo-rrhh)

---

## Módulo: Autenticación

### Descripción
Módulo de autenticación generado por Laravel Breeze. Maneja registro, login, logout, verificación de email, reset de contraseña y confirmación de contraseña. Usa `sweetalert2` para confirmar acciones antes de ejecutarlas (cerrar sesión, reenviar verificación).

### Archivos involucrados

**Backend:**
- `app/Http/Controllers/Auth/` — 9 controladores (login, register, password reset, email verification, confirm password)
- `app/Http/Requests/Auth/LoginRequest.php` — Validación de login
- `routes/auth.php` — Rutas de autenticación (9 rutas)

**Frontend:**
- `resources/js/Pages/Auth/Login.tsx` — Página de inicio de sesión (shadcn/ui)
- `resources/js/Pages/Auth/Register.tsx` — Página de registro (shadcn/ui)
- `resources/js/Pages/Auth/ForgotPassword.tsx` — Solicitar reset de contraseña (shadcn/ui)
- `resources/js/Pages/Auth/ResetPassword.tsx` — Resetear contraseña (shadcn/ui)
- `resources/js/Pages/Auth/ConfirmPassword.tsx` — Confirmar contraseña (shadcn/ui)
- `resources/js/Pages/Auth/VerifyEmail.tsx` — Verificar email con confirmación sweetalert2 (shadcn/ui)
- `resources/js/Layouts/GuestLayout.tsx` — Layout público (shadcn/ui)

### Rutas

| Método | URI | Controller@método | Middleware |
|--------|-----|-------------------|------------|
| GET | `/login` | `AuthenticatedSessionController@create` | guest |
| POST | `/login` | `AuthenticatedSessionController@store` | guest |
| POST | `/logout` | `AuthenticatedSessionController@destroy` | auth |
| GET | `/register` | `RegisteredUserController@create` | guest |
| POST | `/register` | `RegisteredUserController@store` | guest |
| GET | `/forgot-password` | `PasswordResetLinkController@create` | guest |
| POST | `/forgot-password` | `PasswordResetLinkController@store` | guest |
| GET | `/reset-password/{token}` | `NewPasswordController@create` | guest |
| POST | `/reset-password` | `NewPasswordController@store` | guest |
| GET | `/verify-email` | `EmailVerificationPromptController` | auth |
| GET | `/verify-email/{id}/{hash}` | `VerifyEmailController` | auth |
| POST | `/email/verification-notification` | `EmailVerificationNotificationController@store` | auth |
| GET | `/confirm-password` | `ConfirmablePasswordController@show` | auth |
| POST | `/confirm-password` | `ConfirmablePasswordController@store` | auth |

### Funcionalidades implementadas
- [x] Login con validación
- [x] Registro con validación
- [x] Logout (con confirmación sweetalert2)
- [x] Reset de contraseña por email
- [x] Verificación de email (skippable)
- [x] Confirmación de contraseña
- [x] Reenviar verificación (con confirmación sweetalert2)

---

## Módulo: Dashboard

### Descripción
Página principal del panel de administración. Solo muestra un saludo personalizado al usuario autenticado.

### Archivos involucrados

**Backend:**
- `app/Http/Controllers/DashboardController.php` — Controlador con método `index`
- `routes/web.php` — Ruta `GET /dashboard` (middleware: auth, verified)

**Frontend:**
- `resources/js/Pages/Dashboard/Index.tsx` — Saludo personalizado con nombre del usuario

### Rutas

| Método | URI | Middleware |
|--------|-----|-----------|
| GET | `/dashboard` | auth, verified |

### Funcionalidades implementadas
- [x] Saludo personalizado con nombre del usuario

---

## Módulo: Perfil

### Descripción
Edición de perfil de usuario autenticado. Formulario simplificado con foto de perfil, datos personales básicos y cambio de contraseña. Las acciones requieren confirmación vía sweetalert2.

### Archivos involucrados

**Backend:**
- `app/Http/Controllers/ProfileController.php` — edit (simplificado sin catálogos), update (con subida de foto), destroy (sin UI)
- `app/Http/Requests/ProfileUpdateRequest.php` — Validación: nombres, apellidos, email, foto_perfil
- `app/Models/User.php` — Accessors: name, fotoPerfilUrl, rutCompleto. $appends: name, foto_perfil_url
- `routes/web.php` — Rutas GET/PATCH /profile, DELETE /profile (sin UI), PUT /password

**Frontend:**
- `resources/js/Pages/Profile/Edit.tsx` — Página de perfil (AppLayout, grid lg:grid-cols-2)
- `resources/js/Pages/Profile/Partials/UpdateProfileInformationForm.tsx` — Formulario: foto, nombres, apellidos, email
- `resources/js/Pages/Profile/Partials/UpdatePasswordForm.tsx` — Cambio de contraseña
- `resources/js/Layouts/AppLayout.tsx` — Sidebar con avatar (foto o iniciales) + dropdown Perfil / Cerrar sesión

### Rutas

| Método | URI | Controller@método | Middleware |
|--------|-----|-------------------|------------|
| GET | `/profile` | `ProfileController@edit` | auth |
| PATCH | `/profile` | `ProfileController@update` | auth |
| DELETE | `/profile` | `ProfileController@destroy` | auth (sin UI) |
| PUT | `/password` | `PasswordController@update` | auth |

### Funcionalidades implementadas
- [x] Editar nombres, apellidos y email
- [x] Subir y mostrar foto de perfil (almacenada en `storage/app/public/avatars/`)
- [x] Foto se muestra en sidebar (avatar) y en formulario
- [x] Actualizar contraseña (3 campos: actual, nueva, confirmar)
- [x] Confirmación sweetalert2 antes de guardar perfil
- [x] Confirmación sweetalert2 antes de cambiar contraseña
- [x] Layout responsive: 2 columnas en desktop (`lg:grid-cols-2`), 1 columna en móvil

### Eliminación de cuenta
El backend tiene la ruta `DELETE /profile` y el método `ProfileController::destroy()`, pero no existe UI en el frontend (el partial `DeleteUserForm.tsx` fue eliminado). Si se requiere en el futuro, habrá que agregar el botón + confirmación sweetalert2.

---

## Módulo: Portal de Autoservicio (Mi Espacio)

### Descripción
Portal de autoservicio donde los empleados gestionan sus propias solicitudes. Cada empleado solo ve sus propios datos (permisos, vacaciones, órdenes de trabajo) y puede crear solicitudes que quedan en estado Ingresada. No tiene botones de gestión (aceptar/rechazar/eliminar).

### Archivos involucrados

**Backend:**
- `app/Http/Controllers/PortalController.php` — index, storePermiso, storeVacacion (todo con auth()->id())
- `app/Http/Requests/Vacacion/StoreVacacionRequest.php` — validación con fallback a auth()->id() cuando no existe {user} en ruta
- `routes/web.php` — 3 rutas portal

**Frontend:**
- `resources/js/Pages/Portal/Index.tsx` — 3 tabs (Permisos, Vacaciones, Órdenes) + modales crear

### Rutas

| Método | URI | Controller@método | Name |
|--------|-----|-------------------|------|
| GET | `/portal` | `PortalController@index` | `portal.index` |
| POST | `/portal/permisos` | `PortalController@storePermiso` | `portal.permisos.store` |
| POST | `/portal/vacaciones` | `PortalController@storeVacacion` | `portal.vacaciones.store` |

### Funcionalidades implementadas
- [x] Tab Permisos: lista permisos del usuario autenticado con tabla similar a RRHH
- [x] Tab Vacaciones: lista solicitudes + tabla de períodos disponibles
- [x] Tab Órdenes: lista OTT del usuario autenticado
- [x] Modal crear permiso (tipo, fecha, motivo; con goce con filas dinámicas)
- [x] Modal crear vacaciones (rango de fechas + motivo con distribución FIFO)
- [x] Validación `tiene_fecha_ingreso`: si el usuario no tiene fecha de ingreso registrada, se muestra card ámbar con advertencia y botones "Nueva Solicitud"/"Crear primera solicitud" deshabilitados
- [x] Todas las solicitudes se crean en estado Ingresada (sin gestión)

### Diseño UI
- Misma línea visual que RRHH (shadcn/ui Cards, Tables, Badges)
- Tabs internos (Permisos, Vacaciones, Órdenes) con iconos
- Sin botones de aceptar/rechazar/eliminar — solo crear

---

## Módulo: RRHH

### Descripción
Gestión de usuarios del sistema desde el panel de RRHH. Permite listar todos los usuarios registrados, crear nuevos, editar con 7 tabs (Datos Personales, Información Laboral, Órdenes de Trabajo, Permisos, Vacaciones, Mérito/Demérito, Sistema). Incluye gestión completa de OTT, Permisos (con/sin goce de sueldo), Vacaciones con cálculo automático de períodos según Código del Trabajo / Salud, y control de acceso por permisos del sistema.

### Archivos involucrados

**Backend:**
- `app/Http/Controllers/Rrhh/RrhhUserController.php` — index, create, store, edit (7 tabs + data), update, + OTT/permiso/vacacion/permisos-sistema methods
- `app/Http/Requests/Rrhh/StoreUserRequest.php` — Validación crear usuario
- `app/Http/Requests/Rrhh/UpdateUserRequest.php` — Validación editar usuario
- `app/Http/Requests/Permiso/StorePermisoRequest.php` — Validación crear permiso (con detalles dinámicos)
- `app/Http/Requests/Vacacion/StoreVacacionRequest.php` — Validación crear solicitud vacaciones
- `app/Http/Requests/Vacacion/StoreVacacionHistoricoRequest.php` — Validación registro histórico vacaciones
- `app/Helpers/VacacionesHelper.php` — Cálculo de periodos, días correspondientes, días hábiles, detección Salud/CT
- `app/Models/User.php` — Scope search, relaciones OTT/permisos/vacaciones
- `app/Models/TipoOrden.php`, `TipoContrato.php`, `EstadoOtt.php`, `CentroCosto.php` — Catálogos OTT
- `app/Models/OrdenTrabajo.php` — Modelo OTT
- `app/Models/TipoPermiso.php`, `EstadoPermiso.php` — Catálogos permisos
- `app/Models/Permiso.php` — Permiso con detalles dinámicos
- `app/Models/PermisoDetalle.php` — Detalle por día (Con Goce)
- `app/Models/EstadoVacacione.php`, `Vacacione.php` — Models vacaciones
- `app/Models/VacacionPeriodo.php` — Desglose por período de cada solicitud de vacaciones
- `app/Models/PermisoSistema.php` — Permisos del sistema (rrhh, etc.)
- `routes/web.php` — Grupo completo de rutas RRHH

**Frontend:**
- `resources/js/Pages/Rrhh/Index.tsx` — Listado paginado con DataTable, búsqueda, badge de estado
- `resources/js/Pages/Rrhh/Create.tsx` — Formulario crear (2 cards)
- `resources/js/Pages/Rrhh/Edit.tsx` — Edición con 7 tabs responsive + todos los dialogs
- `resources/js/Components/ConfirmDialog.tsx` — Diálogo de confirmación sin portal (z-index fix)
- `resources/js/Components/ToastProvider.tsx` — Toast de notificaciones
- `resources/js/Components/ui/toast.tsx` — Componente Toast shadcn/ui
- `resources/js/Components/ui/checkbox.tsx` — Componente Checkbox shadcn/ui
- `resources/js/Components/ui/tabs.tsx` — Componente Tabs shadcn/ui

### Rutas

| Método | URI | Controller@método | Name |
|--------|-----|-------------------|------|
| GET | `/rrhh` | `index` | `rrhh.index` |
| GET | `/rrhh/create` | `create` | `rrhh.create` |
| POST | `/rrhh` | `store` | `rrhh.store` |
| GET | `/rrhh/{user}/edit` | `edit` | `rrhh.edit` |
| PATCH | `/rrhh/{user}` | `update` | `rrhh.update` |
| POST | `/rrhh/{user}/ordenes` | `storeOrden` | `rrhh.ordenes.store` |
| DELETE | `/rrhh/ordenes/{orden}` | `destroyOrden` | `rrhh.ordenes.destroy` |
| POST | `/rrhh/{user}/permisos` | `storePermiso` | `rrhh.permisos.store` |
| DELETE | `/rrhh/permisos/{permiso}` | `destroyPermiso` | `rrhh.permisos.destroy` |
| PATCH | `/rrhh/permisos/{permiso}/aceptar` | `aceptarPermiso` | `rrhh.permisos.aceptar` |
| PATCH | `/rrhh/permisos/{permiso}/rechazar` | `rechazarPermiso` | `rrhh.permisos.rechazar` |
| POST | `/rrhh/{user}/vacaciones` | `storeVacacion` | `rrhh.vacaciones.store` |
| POST | `/rrhh/{user}/vacaciones/historico` | `storeVacacionHistorico` | `rrhh.vacaciones.historico` |
| DELETE | `/rrhh/vacaciones/{vacacion}` | `destroyVacacion` | `rrhh.vacaciones.destroy` |
| PATCH | `/rrhh/vacaciones/{vacacion}/aceptar` | `aceptarVacacion` | `rrhh.vacaciones.aceptar` |
| PATCH | `/rrhh/vacaciones/{vacacion}/rechazar` | `rechazarVacacion` | `rrhh.vacaciones.rechazar` |
| PATCH | `/rrhh/vacaciones/{vacacion}/anular` | `anularVacacion` | `rrhh.vacaciones.anular` |
| PATCH | `/rrhh/{user}/permisos-sistema` | `storePermisosSistema` | — (name `rrhh.permisos-sistema`)

### Funcionalidades implementadas
- [x] Listar usuarios paginados (10 por página)
- [x] Búsqueda por nombres, apellidos, email, RUT
- [x] Badge de estado con color (Activo, Inactivo, Pendiente)
- [x] Crear usuario con todos los campos del modelo
- [x] RUT formateado con dígito verificador
- [x] Catálogos en selects
- [x] Contraseña automática = RUT sin dígito
- [x] Email auto-verificado al crear
- [x] Confirmación sweetalert2 antes de crear
- [x] Animación fade-in-up con delays escalonados
- [x] Layout responsive: 2 columnas en desktop, 1 columna en móvil
- [x] Editar usuario con 7 tabs responsive (Datos, Laboral, OTT, Permisos, Vacaciones, Mérito, Sistema)
- [x] Tabs con scroll horizontal en mobile, íconos + texto abreviado
- [x] Órdenes de Trabajo: crear, eliminar
- [x] Permisos: crear con tipos (Con/Sin Goce), eliminar (solo Ingresada), aceptar, rechazar
- [x] Permisos Con Goce: filas dinámicas (fecha + jornada), max 12 bloques/año
- [x] Card resumen bloques anuales (solo Aceptados)
- [x] Vacaciones: crear solicitud (1 registro + desglose por períodos en `vacacion_periodos`), aceptar, rechazar, anular (Aceptada), eliminar (solo Ingresada)
- [x] Columna `periodo_numero` eliminada de `vacaciones` — los períodos se gestionan vía `vacacion_periodos`
- [x] Datos legacy migrados automáticamente a `vacacion_periodos`
- [x] Registro histórico vacaciones: ingreso masivo de días con distribución FIFO
- [x] 4 estados vacaciones: Ingresada, Aceptada, Rechazada, Anulada
- [x] Cálculo automático de períodos vacacionales por aniversario fecha_ingreso
- [x] Detección tipo trabajador (Código del Trabajo / Salud) desde última OTT
- [x] Fórmula días CT: 20 + intdiv(max(0, años - 10) + 2, 3)
- [x] SweetAlert2 reemplazado por ConfirmDialog + ToastProvider (sin conflictos de portal)
- [x] Seeders idempotentes (firstOrCreate) para todos los catálogos
- [x] Filtro de menú RRHH por permiso `rrhh` (AppLayout.tsx)
- [x] Tab Mérito/Demérito: card placeholder vacío (próximamente)
- [x] Tab Sistema: lista de switches toggle para asignar permisos_sistema al usuario
- [x] Validación de login: solo usuarios con estado Activo pueden iniciar sesión
- [x] Bug fix: colisión clave `permisos` entre shared prop (string[] slugs) y page prop (array objetos) → renombrada a `lista_permisos` en RrhhUserController::edit() y Edit.tsx
- [x] StoreVacacionRequest compatible con Portal: fallback `auth()->id()` cuando no existe `{user}` en la ruta

### Diseño UI
- **Index**: Card con tabla, buscador con icono, paginación con botones numerados, badge de estado con variantes de color, filas clickeables
- **Create**: 2 Cards seccionados (Datos Personales con icono User azul, Info. Laboral con icono Briefcase teal), hint box ámbar para regla de contraseña, inputs con iconos decorativos, textarea para dirección
- **Edit**: Misma estructura que Create, RUT disabled con opacidad, Estado como select, sin campo password. 7 tabs (Datos, Laboral, OTT, Permisos, Vacaciones, Mérito, Sistema). Tabs responsive con flex-wrap (3 por fila) en mobile, h-auto min-h-9, icons shrink-0, texto abreviado (Datos, Laboral, Órdenes, Permisos, Vac., Mérito, Sistema). Tab Mérito: card vacío. Tab Sistema: switches toggle por permiso.
