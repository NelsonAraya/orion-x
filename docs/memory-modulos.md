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
- [Módulo: Portal de Autoservicio (Mi Espacio)](#módulo-portal-de-autoservicio-mi-espacio)
- [Módulo: RRHH](#módulo-rrhh)
- [Módulo: Bandeja de Solicitudes](#módulo-bandeja-de-solicitudes)
- [Módulo: Notificaciones por Email](#módulo-notificaciones-por-email)
- [Módulo: Cementerio](#módulo-cementerio)
- [Módulo: Asistencia](#módulo-asistencia)

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
- [x] Tab Órdenes: lista OTT del usuario autenticado con archivos adjuntos
- [x] Descarga de archivos OTT desde S3 (solo lectura, sin subir/eliminar)
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
Gestión de usuarios del sistema desde el panel de RRHH. Permite listar todos los usuarios registrados, crear nuevos, editar con 7 tabs (Datos Personales, Información Laboral, Órdenes de Trabajo, Permisos, Vacaciones, Mérito/Demérito, Sistema). Incluye gestión completa de OTT (con archivos PDF en S3), Permisos (con/sin goce de sueldo), Vacaciones con cálculo automático de períodos según Código del Trabajo / Salud, y control de acceso por permisos del sistema.

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
- `app/Models/TipoOrden.php`, `TipoContrato.php`, `EstadoOtt.php`, `CentroCosto.php` — Catálogos OTT (con seeders idempotentes firstOrCreate)
- `app/Models/OrdenTrabajo.php` — Modelo OTT (relación `files` + evento `deleting` limpia S3)
- `app/Models/OttFile.php` — Archivos adjuntos a OTT (accessor `tamano_formateado`, signed URLs S3)
- `app/Models/TipoPermiso.php`, `EstadoPermiso.php` — Catálogos permisos
- `app/Models/Permiso.php` — Permiso con detalles dinámicos
- `app/Models/PermisoDetalle.php` — Detalle por día (Con Goce)
- `app/Models/EstadoVacacione.php`, `Vacacione.php` — Models vacaciones
- `app/Models/VacacionPeriodo.php` — Desglose por período de cada solicitud de vacaciones
- `app/Models/PermisoSistema.php` — Permisos del sistema (rrhh, cementerio-*, etc.)
- `app/Models/UserModuloPerfil.php` — Perfiles por módulo (superadmin/admin/usuario/auditor)
- `database/migrations/2026_07_01_204805_create_user_modulo_perfil_table.php` — Migración: user_id, modulo_slug, perfil_slug, unique compuesto
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
| PATCH | `/rrhh/{user}/permisos-sistema` | `storePermisosSistema` | `rrhh.permisos-sistema`
| PATCH | `/rrhh/{user}/modulo-perfiles` | `updateModuloPerfiles` | `rrhh.modulo-perfiles`
| POST | `/rrhh/ordenes/{orden}/archivos` | `storeOttFile` | `rrhh.ordenes.archivos.store`
| DELETE | `/rrhh/ordenes/archivos/{archivo}` | `destroyOttFile` | `rrhh.ordenes.archivos.destroy`
| GET | `/rrhh/ordenes/archivos/{archivo}/descargar` | `downloadOttFile` | `rrhh.ordenes.archivos.download`

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
- [x] Archivos OTT: subir PDF a S3, listar, descargar y eliminar (solo RRHH)
- [x] Al eliminar una OTT, sus archivos en S3 se borran automáticamente (evento `deleting` en OrdenTrabajo)
- [x] Límite: solo PDF, máximo 20 MB por archivo
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
- [x] Tab Sistema dividido en dos sub-tabs: Accesos (toggles de permisos por módulo) y Acciones (selects de perfil por submódulo: Superadmin/Admin/Usuario/Auditor)
- [x] Persistencia de perfiles vía tabla user_modulo_perfil con slug único (modulo_slug + perfil_slug)
- [x] HandleInertiaRequests comparte modulo_perfiles como Record<string, string> para inicializar selects
- [x] Validación de login: solo usuarios con estado Activo pueden iniciar sesión
- [x] Bug fix: colisión clave `permisos` entre shared prop (string[] slugs) y page prop (array objetos) → renombrada a `lista_permisos` en RrhhUserController::edit() y Edit.tsx
- [x] StoreVacacionRequest compatible con Portal: fallback `auth()->id()` cuando no existe `{user}` en la ruta
- [x] Notificaciones email al empleado al crear/aceptar/rechazar/anular permisos y vacaciones
- [x] Registro histórico de vacaciones no envía notificación email

### Diseño UI
- **Index**: Card con tabla, buscador con icono, paginación con botones numerados, badge de estado con variantes de color, filas clickeables
- **Create**: 2 Cards seccionados (Datos Personales con icono User azul, Info. Laboral con icono Briefcase teal), hint box ámbar para regla de contraseña, inputs con iconos decorativos, textarea para dirección
- **Edit**: Misma estructura que Create, RUT disabled con opacidad, Estado como select, sin campo password. 7 tabs (Datos, Laboral, OTT, Permisos, Vacaciones, Mérito, Sistema). Tabs responsive con flex-wrap (3 por fila) en mobile, h-auto min-h-9, icons shrink-0, texto abreviado (Datos, Laboral, Órdenes, Permisos, Vac., Mérito, Sistema). Tab Mérito: card vacío. Tab Sistema: dos sub-tabs (Accesos con switches toggle, Acciones con selects de perfil + botón Guardar). Cementerio expandible con chevron y sub-toggles anidados independientes (sin toggleGroup/toggleChildOnly).

---

## Módulo: Bandeja de Solicitudes

### Descripción
Bandeja centralizada para gestionar solicitudes pendientes de permisos y vacaciones. Muestra solo solicitudes en estado Ingresada, con dos cards separadas (Permisos y Vacaciones). Permite aceptar o rechazar cada solicitud con ConfirmDialog + textarea para el motivo de rechazo. Requiere permiso `solicitudes`.

### Archivos involucrados

**Backend:**
- `app/Http/Controllers/SolicitudesController.php` — index, aceptarPermiso, rechazarPermiso, aceptarVacacion, rechazarVacacion
- `app/Models/Permiso.php` — Relaciones userAsignado, tipoPermiso, estadoPermiso, detalles
- `app/Models/Vacacione.php` — Relaciones user, estadoVacacione, periodos
- `app/Models/EstadoPermiso.php` — Catálogo estados (Ingresada, Aceptada, Rechazada)
- `app/Models/EstadoVacacione.php` — Catálogo estados (Ingresada, Aceptada, Rechazada, Anulada)
- `app/Notifications/PermisoAceptada.php`, `PermisoRechazada.php`, `VacacionAceptada.php`, `VacacionRechazada.php`
- `app/Http/Middleware/HandleInertiaRequests.php` — Comparte `permisos` globalmente
- `routes/web.php` — 5 rutas solicitudes

**Frontend:**
- `resources/js/Pages/Solicitudes/Index.tsx` — 2 cards (Permisos/Vacaciones) con botones Aceptar/Rechazar
- `resources/js/Components/ConfirmDialog.tsx` — Confirmación antes de aceptar
- `resources/js/Components/ToastProvider.tsx` — Toast de notificaciones de éxito

### Rutas

| Método | URI | Controller@método | Name |
|--------|-----|-------------------|------|
| GET | `/solicitudes` | `index` | `solicitudes.index` |
| PATCH | `/solicitudes/permisos/{permiso}/aceptar` | `aceptarPermiso` | `solicitudes.permisos.aceptar` |
| PATCH | `/solicitudes/permisos/{permiso}/rechazar` | `rechazarPermiso` | `solicitudes.permisos.rechazar` |
| PATCH | `/solicitudes/vacaciones/{vacacion}/aceptar` | `aceptarVacacion` | `solicitudes.vacaciones.aceptar` |
| PATCH | `/solicitudes/vacaciones/{vacacion}/rechazar` | `rechazarVacacion` | `solicitudes.vacaciones.rechazar` |

### Funcionalidades implementadas
- [x] Listar permisos pendientes (Ingresada) con datos: solicitud, funcionario, tipo, detalle, motivo
- [x] Listar vacaciones pendientes (Ingresada) con datos: solicitud, funcionario, fechas, días, motivo
- [x] Aceptar permiso con ConfirmDialog + notificación email al empleado
- [x] Rechazar permiso con Dialog + textarea (min 5 caracteres) + notificación email al empleado
- [x] Aceptar vacaciones con ConfirmDialog + notificación email al empleado
- [x] Rechazar vacaciones con Dialog + textarea (min 5 caracteres) + notificación email al empleado
- [x] Validación: solo se pueden gestionar solicitudes en estado Ingresada
- [x] Redirección a `solicitudes.index` después de cada acción

### Diseño UI
- Cards separadas (Permisos Pendientes / Vacaciones Pendientes) con iconos distintivos (CheckCircle azul, Calendar teal)
- Tablas con columnas: Solicitud, Funcionario, Tipo/Fechas, Detalle/Días, Motivo, Acción
- Botones Aceptar (verde) y Rechazar (rojo) con iconos
- ConfirmDialog para Aceptar, Dialog con textarea para Rechazar
- Estado vacío: icono + mensaje "No hay X pendientes"
- Sin paginación (solo pendientes, volumen bajo)

---

## Módulo: Notificaciones por Email

### Descripción
Sistema de notificaciones por email que informa al empleado sobre el estado de sus solicitudes de permisos y vacaciones. Las notificaciones se envían solo al empleado afectado (no a administradores). Configurado con Gmail SMTP.

### Archivos involucrados

**Backend:**
- `app/Notifications/PermisoCreada.php` — Al crear permiso
- `app/Notifications/PermisoAceptada.php` — Al aceptar permiso
- `app/Notifications/PermisoRechazada.php` — Al rechazar permiso (incluye observación)
- `app/Notifications/VacacionCreada.php` — Al crear solicitud de vacaciones
- `app/Notifications/VacacionAceptada.php` — Al aceptar vacaciones
- `app/Notifications/VacacionRechazada.php` — Al rechazar vacaciones (incluye observación)
- `app/Notifications/VacacionAnulada.php` — Al anular vacaciones (incluye observación)
- `config/mail.php` — Configuración SMTP
- `.env` — Credenciales Gmail

### Canales
- **Email** (MailMessage via Laravel Notifications)
- Configurado con **Gmail SMTP** (contraseña de aplicación)
- `MAIL_MAILER=smtp`, `MAIL_HOST=smtp.gmail.com`, `MAIL_PORT=587`, `MAIL_ENCRYPTION=tls`

### Funcionalidades implementadas
- [x] Notificar al empleado cuando se crea un permiso (Portal o RRHH)
- [x] Notificar al empleado cuando se acepta un permiso (RRHH o Solicitudes)
- [x] Notificar al empleado cuando se rechaza un permiso, incluyendo motivo (RRHH o Solicitudes)
- [x] Notificar al empleado cuando se crea una solicitud de vacaciones (Portal o RRHH)
- [x] Notificar al empleado cuando se aceptan las vacaciones (RRHH o Solicitudes)
- [x] Notificar al empleado cuando se rechazan las vacaciones, incluyendo motivo (RRHH o Solicitudes)
- [x] Notificar al empleado cuando se anulan las vacaciones, incluyendo motivo (RRHH)
- [x] Notificaciones implementan `ShouldQueue` para envío asíncrono
- [x] Con `QUEUE_CONNECTION=sync` se envían inline (dev)
- [x] Solo al empleado afectado (nunca a administradores)
- [x] Registro histórico de vacaciones no envía notificación

### Formato del mensaje
- **Subject:** "ORION-X — [Acción]: [Tipo]" (ej: "ORION-X — Permiso Creado: Permiso por Enfermedad")
- **Salutation:** "Estimado(a) [Nombre],"
- **Cuerpo:** Descripción de la acción + detalles relevantes
- **Líneas informativas:**
  - `**Solicitud:** #PERM-{id}` o `**Solicitud:** #VAC-{id}`
  - `**Motivo:** {motivo}` (cuando aplica)
  - `**Gestionado el:** {fecha}`
- **Firma:** "— ORION-X" (sin `<br>`, línea plana)

---

## Módulo: Cementerio

### Descripción
Gestión del cementerio municipal con backend real (migraciones, modelos, seeders) y frontend conectado a BD. 11 páginas + 7 componentes: registro de fallecidos (CRUD completo), historial de deudores (CRUD), ingreso de OT, cuotas y pagos, búsqueda de OTs, consulta de ubicaciones, expediente digital, búsqueda por fallecido, reportes financieros, imprimir OT, comprobante de pago.

### Archivos involucrados

**Backend — Migraciones:**
- `database/migrations/2026_06_22_160001_create_cementerio_sexos_table.php` — Catálogo sexos (Masculino, Femenino)
- `database/migrations/2026_06_22_160002_create_cementerio_estados_civiles_table.php` — Catálogo estados civiles (Soltero/a, Casado/a, Viudo/a, Divorciado/a)
- `database/migrations/2026_06_22_160003_create_cementerio_fallecidos_table.php` — Tabla fallecidos con es_nn, codigo_nn, rut_fallecido, registrador_id, carta_defuncion, FK a sexos y estados_civiles
- `database/migrations/2026_06_22_204633_create_cementerio_deudores_table.php` — Tabla deudores con RUT como PK
- `database/migrations/2026_06_22_204644_add_registrador_id_to_cementerio_fallecidos_table.php` — Columna registrador_id
- `database/migrations/2026_06_22_212557_create_cementerio_relaciones_table.php` — Catálogo relaciones (Cónyuge, Hijo/a, etc.)
- `database/migrations/2026_06_22_213047_create_cementerio_financiamiento_table.php` — Catálogo financiamiento (Servicio, Arriendo, Otros)
- `database/migrations/2026_06_22_213448_create_cementerio_servicios_table.php` — Catálogo servicios (Sepultación, Cremación, etc.)
- `database/migrations/2026_06_23_000001_create_cementerio_sectores_table.php` — Catálogo sectores del cementerio
- `database/migrations/2026_06_23_000002_create_cementerio_tipos_ubicacion_table.php` — Catálogo tipos de ubicación (Nicho, Bóveda, etc.)
- `database/migrations/2026_06_23_000003_create_cementerio_estados_ubicacion_table.php` — Catálogo estados de ubicación (Ocupado, Disponible, etc.)
- `database/migrations/2026_06_23_000004_create_cementerio_ubicaciones_table.php` — Tabla ubicaciones con codigo único, FK a tipo/sector/estado, capacidad
- `database/migrations/2026_06_23_000005_create_cementerio_fallecido_ubicacion_table.php` — Tabla pivote fallecido-ubicación con fecha_asignacion, activo
- `database/migrations/2026_06_23_000006_add_valor_servicio_to_cementerio_servicios.php` — Columna valor_servicio en servicios
- `database/migrations/2026_06_23_000007_add_valor_arriendo_to_cementerio_financiamiento.php` — Columna valor_arriendo en financiamiento
- `database/migrations/2026_06_23_000008_create_cementerio_formas_pago_table.php` — Catálogo formas de pago
- `database/migrations/2026_06_23_000009_create_cementerio_ot_table.php` — Tabla OT con numero_ot único, FK a fallecido, deudor, relacion, ubicacion, financiamiento, forma_pago
- `database/migrations/2026_06_23_000010_create_cementerio_ot_servicios_table.php` — Tabla pivote OT-servicios con valor_unitario
- `database/migrations/2026_06_23_000011_add_dv_to_cementerio_deudores.php` — Columna dv en deudores
- `database/migrations/2026_06_23_000012_make_registrador_id_nullable_in_cementerio_deudores.php` — registrador_id nullable en deudores
- `database/migrations/2026_06_23_000013_create_cementerio_cuotas_table.php` — Tabla cuotas con FK a OT, monto, fechas, estado, método pago
- `database/migrations/2026_06_23_000014_add_metodo_pago_id_to_cementerio_cuotas.php` — Columna metodo_pago_id en cuotas
- `database/migrations/2026_06_23_000015_make_forma_pago_id_nullable_in_cementerio_ot.php` — forma_pago_id nullable en OT
- `database/migrations/2026_06_24_204638_create_cementerio_cuotas_pagos_mixto_table.php` — Tabla pagos mixtos (cuota_id, metodo_pago_id, monto, fecha)
- `database/migrations/2026_06_24_204702_add_pago_mixto_to_cementerio_formas_pago.php` — Columna permite_pago_mixto en formas_pago
- `database/migrations/2026_06_24_210121_add_monto_recibido_to_cementerio_cuotas.php` — Columna monto_recibido en cuotas
- `database/migrations/2026_07_02_000001_create_cementerio_ot_estados_table.php` — Tabla catálogo estados de OT (Ingresada, Finalizada, Anulada)
- `database/migrations/2026_07_02_000002_add_ot_estado_id_to_cementerio_ot_table.php` — Reemplaza columna `estado` varchar por FK `ot_estado_id`, migra datos existentes (pendiente/en_proceso → Ingresada, finalizada → Finalizada, anulada → Anulada)

**Backend — Modelos:**
- `app/Models/Cementerio/Fallecido.php` — SoftDeletes, booted events (genera codigo_nn), $appends nombre_completo, accessors (nombre_completo, identificador), relaciones sexo, estadoCivil, ubicacionActual, historialUbicaciones
- `app/Models/Cementerio/FallecidoUbicacion.php` — Pivote fallecido ↔ ubicacion con fecha_asignacion, fecha_retiro, activo. Relaciones fallecido, ubicacion
- `app/Models/Cementerio/Ubicacion.php` — SoftDeletes, tabla cementerio_ubicaciones. Relaciones tipoUbicacion, sector, estadoUbicacion, fallecidos, fallecidosActivos
- `app/Models/Cementerio/TipoUbicacion.php` — Catálogo tipos de ubicación
- `app/Models/Cementerio/Sector.php` — Catálogo sectores
- `app/Models/Cementerio/EstadoUbicacion.php` — Catálogo estados de ubicación
- `app/Models/Cementerio/Ot.php` — RouteKeyName = numero_ot. Relaciones fallecido, deudor, relacion, ubicacion, tipoFinanciamiento, formaPago, servicios (belongsToMany con pivot valor_unitario), registrador, estado (BelongsTo OtEstado via ot_estado_id)
- `app/Models/Cementerio/Financiamiento.php` — Catálogo
- `app/Models/Cementerio/Servicio.php` — Catálogo
- `app/Models/Cementerio/Relacion.php` — Catálogo
- `app/Models/Cementerio/FormaPago.php` — Catálogo
- `app/Models/Cementerio/Sexo.php` — Catálogo
- `app/Models/Cementerio/EstadoCivil.php` — Catálogo
- `app/Models/Cementerio/Deudor.php` — `$incrementing = false`, `$keyType = 'string'`, `$primaryKey = 'rut'`, SoftDeletes, relación contacto()
- `app/Models/Cementerio/DeudorContacto.php` — Contactos del deudor (contacto1/2: nombre, teléfono, correo), FK unique a deudor
- `app/Models/Cementerio/Cuota.php` — Cuotas de OT (monto, fechas vencimiento/pago, estado, método pago, monto pagado/recibido). $casts: fecha_vencimiento => date
- `app/Models/Cementerio/CuotaPagoMixto.php` — Pagos mixtos por cuota (múltiples métodos de pago en una misma cuota)
- `app/Models/Cementerio/OtEstado.php` — Catálogo estados de OT (Ingresada, Finalizada, Anulada). Relacionado vía FK `ot_estado_id` en Ot

**Backend — Controladores:**
- `app/Http/Controllers/Cementerio/FallecidoController.php` — CRUD + search + detalle (JSON) + buscarUbicacion (JSON) + verificarRut (JSON)
- `app/Http/Controllers/Cementerio/DeudorController.php` — CRUD con paginación + search (JSON, búsqueda por RUT o nombre para autocomplete, incluye `->with('contacto')`)
- `app/Http/Controllers/Cementerio/OtController.php` — store (crea OT + FallecidoUbicacion + cuotas), update (edita relación, contactos, ubicación, estado OT; servicios y tipo_financiamiento read-only; al anular verifica cuotas pagadas y requiere confirma_anulacion, anula todas las cuotas asociadas), detalle (JSON con todas las relaciones + relación estado + tiene_cuotas_pagadas), cuotas (JSON con método pago), pagar (pago simple o mixto con transacción DB + helper verificarOtFinalizada que cambia OT a Finalizada si todas las cuotas están pagadas), formasPago (JSON), imprimir (página Inertia), comprobante (página Inertia)

**Backend — Requests:**
- `app/Http/Requests/Cementerio/StoreFallecidoRequest.php` — Validación unique rut (nullable), archivo carta_defuncion
- `app/Http/Requests/Cementerio/StoreDeudorRequest.php` — Validación unique rut/nombre, email, teléfono string
- `app/Http/Requests/Cementerio/StoreOtRequest.php` — Validación OT: fallecido_id, deudor_id, servicios array, etc.

**Backend — Seeders:**
- `database/seeders/CementerioSexosSeeder.php`, `CementerioEstadosCivilesSeeder.php`, `CementerioFallecidosSeeder.php`, `CementerioDeudoresSeeder.php`, `CementerioRelacionesSeeder.php`, `CementerioFinanciamientoSeeder.php`, `CementerioServiciosSeeder.php`, `CementerioSectoresSeeder.php`, `CementerioTiposUbicacionSeeder.php`, `CementerioEstadosUbicacionSeeder.php`, `CementerioFormasPagoSeeder.php`, `OtEstadoSeeder.php`
- `database/seeders/PermisoSistemaSeeder.php` — Permiso `cementerio` + 7 slugs `cementerio-*` (gestion-mortuaria, registro-fallecido, historial-deudores, orden-trabajo, ingresar-ot, buscar-ot, reportes)
- `database/seeders/DatabaseSeeder.php` — Llama a seeders de Cementerio (excepto Fallecidos/Deudores que son datos manuales)

**Backend — Rutas:**
- `routes/web.php` — Grupo `prefix('cementerio')` con 28 rutas: CRUD fallecidos/deudores/OT, search, detalle, cuotas, pagar, comprobante, verificar-rut, consultar-data, imprimir

**Frontend:**
- `resources/js/Pages/Cementerio/RegistroFallecido.tsx` — Formulario registro + historial paginado + modal edición (usando EditarFallecidoModal). Inertia useForm, forceFormData, upload carta
- `resources/js/Pages/Cementerio/HistorialDeudores.tsx` — Formulario + tabla paginada + modal edición con PUT. Campos de contacto en edición. ConfirmDialog antes de guardar. Edit deshabilitado en tabla
- `resources/js/Pages/Cementerio/IngresarOt.tsx` — Búsqueda fallecido con debounce + fetch a `/cementerio/buscar-fallecidos`, panel datos fallecido desde BD, selects catálogos desde props, Contacto1/Contacto2 desde tabla cementerio_deudores_contacto, ConfirmDialog antes de guardar, success Swal con 3 botones (Cerrar/Ver OT/Imprimir). Sin botón Generar Comprobante
- `resources/js/Pages/Cementerio/BuscarOt.tsx` — SearchFilters (cols=2) + DataTable con OTs reales desde BD (N° OT, RUT/Nombre Fallecido, RUT/Nombre Deudor, Servicios, Total, Fecha, Estado badge, Acciones Ver/Imprimir). Filtros client-side. OtDetalleModal
- `resources/js/Pages/Cementerio/BuscarPorFallecido.tsx` — Búsqueda por RUT/nombre con fetch real a `/cementerio/buscar-fallecido-ubicacion`, muestra info fallecido + ubicación + OT con OtDetalleModal
- `resources/js/Pages/Cementerio/ConsultarUbicaciones.tsx` — Filtros por Tipo/Sector/Estado desde catálogos reales. Fetch a `/cementerio/ubicaciones/consultar-data`. DataTable + modal detalle con tabla de fallecidos. Botones "Ver OT" (OtDetalleModal) y "Ver Fallecido" (EditarFallecidoModal)
- `resources/js/Pages/Cementerio/ImprimirOt.tsx` — Página standalone (sin AppLayout) para impresión en tamaño legal. `window.print()` automático. Mismo layout compacto que OtDetalleModal. Badge de estado comentado
- `resources/js/Pages/Cementerio/ComprobantePago.tsx` — Página standalone (sin AppLayout) para imprimir comprobante de pago de cuota. Auto-imprime al cargar
- `resources/js/Pages/Cementerio/Documentos.tsx` — DataTable + ExpedienteModal (3 tabs)
- `resources/js/Pages/Cementerio/Reportes.tsx` — Tabs Ingresos/Cuotas + modales detalle
- `resources/js/Components/cementerio/OtDetalleModal.tsx` — Dialog shadcn con tabs (Información, Cuotas). Fetchea `/cementerio/ot/{numero_ot}/detalle` al abrir. Muestra: estado badge desde objeto relacionado (estado?.nombre) + botón Imprimir. Tab Información: Datos Fallecido (grid-cols-4), Responsable Financiero (grid-cols-3), Contactos (grid-cols-3), Ubicación (grid-cols-4), tabla Servicios + Info Financiera. Tab Cuotas: lista de cuotas con PagarCuotaModal. SweetAlert de éxito al finalizar todas las cuotas
- `resources/js/Components/cementerio/EditarFallecidoModal.tsx` — Componente compartido para editar fallecidos. Recibe fallecido, sexos, estadosCiviles. Validación inline + PUT con Inertia router. Callback onSuccess opcional
- `resources/js/Components/cementerio/EditarOtModal.tsx` — Dialog shadcn para editar OT (relación, contactos, ubicación, estado). Estado dinámico desde referencias, confirmación SweetAlert2 antes de anular
- `resources/js/Components/cementerio/ExpedienteModal.tsx` — Expediente con 3 tabs (Información, Documentos, Movimientos)
- `resources/js/Components/cementerio/ModalDetalleIngreso.tsx` — Info financiera + historial pagos
- `resources/js/Components/cementerio/ModalDetalleCuota.tsx` — Próximas cuotas + historial pagado
- `resources/js/Components/cementerio/PagarCuotaModal.tsx` — Modal de pago de cuota (pago simple o mixto con selección de métodos)
- `resources/js/Components/cementerio/ModalOT.tsx` — Modal de detalle de OT con información completa
- `resources/js/Components/shared/Breadcrumbs.tsx` — Navegación en páginas
- `resources/js/Components/shared/CardSection.tsx` — Secciones con icono
- `resources/js/Components/shared/ActionButtons.tsx` — Barra de acciones
- `resources/js/Components/shared/SearchFilters.tsx` — Contenedor de filtros
- `resources/js/Components/shared/DataTable.tsx` — Tabla genérica con onRowClick
- `resources/js/Components/shared/EmptyState.tsx` — Estado vacío con icono y mensaje
- `resources/js/Components/shared/PageHeader.tsx` — Encabezado de página con título y descripción
- `resources/js/Components/forms/FormInput.tsx` — Input con label y error
- `resources/js/Components/forms/FormSelect.tsx` — Select con label y error
- `resources/js/Components/forms/FormTextarea.tsx` — Textarea con label y error
- `resources/js/lib/mockData.ts` — Datos mock (~550 líneas, 10+ exports)
- `resources/js/lib/nacionalidades.ts` — Lista de nacionalidades para formularios
- `resources/js/lib/utils.ts` — Funciones utilitarias (cn(), formatDate(), etc.)
- `resources/js/Layouts/AppLayout.tsx` — Sidebar con submenús colapsables + permisos condicionales por ítem `cementerio-*` + backward compat, "Gestión Mortuoria" colapsable con hijos Registro Fallecido e Historial Deudores

### Rutas

| Método | URI | Controller@método / Descripción | Name |
|--------|-----|-------------------------------|------|
| GET | `/cementerio/registro-fallecido` | `FallecidoController@index` | `cementerio.registro-fallecido` |
| POST | `/cementerio/registro-fallecido` | `FallecidoController@store` | `cementerio.registro-fallecido.store` |
| GET | `/cementerio/registro-fallecido/{fallecido}` | `FallecidoController@show` | `cementerio.registro-fallecido.show` |
| PUT | `/cementerio/registro-fallecido/{fallecido}` | `FallecidoController@update` | `cementerio.registro-fallecido.update` |
| DELETE | `/cementerio/registro-fallecido/{fallecido}` | `FallecidoController@destroy` | `cementerio.registro-fallecido.destroy` |
| GET | `/cementerio/buscar-fallecidos` | `FallecidoController@search` | `cementerio.fallecidos.search` |
| GET | `/cementerio/fallecido/{fallecido}/detalle` | `FallecidoController@detalle` | `cementerio.fallecidos.detalle` |
| GET | `/cementerio/buscar-fallecido-ubicacion` | `FallecidoController@buscarUbicacion` | `cementerio.buscar-fallecido-ubicacion` |
| GET | `/cementerio/verificar-rut` | `FallecidoController@verificarRut` | `cementerio.fallecidos.verificar-rut` |
| GET | `/cementerio/historial-deudores` | `DeudorController@index` | `cementerio.historial-deudores` |
| POST | `/cementerio/historial-deudores` | `DeudorController@store` | `cementerio.historial-deudores.store` |
| PUT | `/cementerio/historial-deudores/{deudor}` | `DeudorController@update` | `cementerio.historial-deudores.update` |
| DELETE | `/cementerio/historial-deudores/{deudor}` | `DeudorController@destroy` | `cementerio.historial-deudores.destroy` |
| GET | `/cementerio/buscar-deudores` | `DeudorController@search` | `cementerio.deudores.search` |
| GET | `/cementerio/ingresar-ot` | Closure (props: relaciones, financiamientos, servicios, sectores, tipos_ubicacion, formas_pago) | `cementerio.ingresar-ot` |
| POST | `/cementerio/ingresar-ot` | `OtController@store` | `cementerio.ingresar-ot.store` |
| GET | `/cementerio/ot/{ot}/detalle` | `OtController@detalle` | `cementerio.ot.detalle` |
| GET | `/cementerio/ot/{ot}/cuotas` | `OtController@cuotas` | `cementerio.ot.cuotas` |
| PUT | `/cementerio/cuotas/{cuota}/pagar` | `OtController@pagar` | `cementerio.cuotas.pagar` |
| GET | `/cementerio/ot/{ot}/imprimir` | `OtController@imprimir` | `cementerio.ot.imprimir` |
| GET | `/cementerio/formas-pago` | `OtController@formasPago` | `cementerio.formas-pago` |
| GET | `/cementerio/cuotas/{cuota}/comprobante` | `OtController@comprobante` | `cementerio.cuotas.comprobante` |
| GET | `/cementerio/buscar-ot` | Closure (carga OTs reales con relaciones, props: ots) | `cementerio.buscar-ot` |
| GET | `/cementerio/buscar-por-fallecido` | Closure | `cementerio.buscar-por-fallecido` |
| GET | `/cementerio/consultar-ubicaciones` | Closure (props: tipos, sectores, estados, sexos, estadosCiviles) | `cementerio.consultar-ubicaciones` |
| GET | `/cementerio/ubicaciones/consultar-data` | Closure (JSON, filtros tipo/sector/estado, carga fallecidosActivos con sexo/estadoCivil + última OT) | `cementerio.ubicaciones.consultar-data` |
| GET | `/cementerio/documentos` | Closure | `cementerio.documentos` |
| GET | `/cementerio/reportes` | Closure (query de cuotasPorVencer con cálculo de días restantes y estado dinámico) | `cementerio.reportes` |

### Funcionalidades implementadas

**Fallecidos y Deudores (CRUD completo):**
- [x] RegistroFallecido: formulario con validación inline + Inertia useForm POST a BD
- [x] Edición fallecido: modal compartido EditarFallecidoModal con PUT (usado en RegistroFallecido y ConsultarUbicaciones)
- [x] Soft deletes en fallecidos y deudores
- [x] Checkbox NN + RadioGroup obligatorio: es_nn, codigo_nn autogenerado en evento created
- [x] Upload carta defunción (forceFormData)
- [x] Catálogos desde BD: sexos, estados civiles, relaciones, financiamiento, servicios, sectores, tipos_ubicacion, estados_ubicacion, formas_pago
- [x] HistorialDeudores: formulario + tabla paginada + modal edición con PUT. Campos contacto en edición. ConfirmDialog antes de guardar. autoComplete=off. Edit deshabilitado en tabla
- [x] Deudor con RUT como PK string, `$incrementing = false`
- [x] Deudor registrador_id asignable
- [x] Validación unique RUT/nombre en store y update (ignore own id)
- [x] DeudorController@search: búsqueda por RUT o nombre para autocomplete (JSON). Incluye `->with('contacto')` y mapea campos al response
- [x] FallecidoController@buscarUbicacion: búsqueda por RUT/nombre, carga ubicación actual + última OT (JSON)
- [x] FallecidoController@verificarRut: endpoint JSON para verificar si un RUT ya existe como fallecido
- [x] Fallecido model: $appends nombre_completo para serialización JSON

**Órdenes de Trabajo (OT):**
- [x] IngresarOt: wizard 3 pasos (selección fallecido → servicios/ubicación → resumen financiero) con sidebar stepper numerado y validación por paso. ConfirmDialog antes de guardar. Contacto1 y Contacto2 llenados desde tabla cementerio_deudores_contacto (no desde datos del deudor). Botón "Generar Comprobante" eliminado del formulario. autoComplete="off" en 12 inputs del formulario
- [x] Búsqueda fallecido en IngresarOt: debounce 300ms + fetch a `/cementerio/buscar-fallecidos`
- [x] Panel "Datos del Fallecido" read-only con datos desde BD vía `/cementerio/fallecido/{id}/detalle`
- [x] Selects catálogo desde BD via props (relaciones, financiamiento, servicios, sectores, tipos_ubicacion, formas_pago)
- [x] OtController@store: crea OT y automáticamente crea FallecidoUbicacion (activo) si se selecciona ubicación
- [x] OtController@detalle: endpoint JSON con todas las relaciones (fallecido.sexo, deudor, relacion, ubicacion.sector, ubicacion.tipo_ubicacion, tipoFinanciamiento, formaPago, servicios, registrador)
- [x] OtController@imprimir: página Inertia standalone para impresión tamaño legal
- [x] Ot model: `getRouteKeyName()` retorna `numero_ot` para route-model binding con formato `OT-00001`
- [x] Success alert en IngresarOt: SweetAlert2 centrado con N° OT en azul grande + 3 botones (Cerrar/Ver OT/Imprimir)
- [x] Sistema de estados OT: columna `estado` varchar reemplazada por FK `ot_estado_id` → `cementerio_ot_estados` (Ingresada default, Finalizada, Anulada)
- [x] Migración automática de datos existentes: pendiente/en_proceso → Ingresada, finalizada → Finalizada, anulada → Anulada
- [x] `OtController@update`: edita relación, contactos, ubicación y estado; servicios y tipo_financiamiento son read-only
- [x] `EditarOtModal`: Dialog shadcn con campos editables (relación, contactos, ubicación, estado OT), estado dinámico desde endpoint referencias-ot
- [x] Anulación OT en EditarOtModal: SweetAlert2 de confirmación al cambiar a Anulada (alerta fuerte si hay cuotas pagadas "¿Está seguro de anular de todas formas?", simple si no). Al confirmar, envía `confirma_anulacion: true` al backend y se anulan todas las cuotas asociadas
- [x] El botón "Guardar Cambios" cierra el Dialog antes de mostrar SweetAlert para evitar conflictos de z-index con Radix UI
- [x] Botón editar OT en BuscarOt visible solo para Superadmin y Admin (controlado por `perfil === 'superadmin' || perfil === 'admin'` desde modulo_perfiles)

**Cuotas y Pagos:**
- [x] Generación automática de cuotas al crear OT (distribución equitativa con residuo en primeras cuotas)
- [x] Vencimiento a 30 días desde la creación, escalonado por número de cuotas
- [x] Modelo `Cuota` con monto, fechas, estado (pendiente/parcial/pagada), método de pago
- [x] Modelo `CuotaPagoMixto` para pagos con múltiples métodos en una misma cuota
- [x] `OtController@cuotas`: endpoint JSON con cuotas y método de pago
- [x] `OtController@pagar`: pago simple (monto + método) o mixto (array métodos/montos) con transacción DB
- [x] Estados de cuota: pendiente → parcial (pago insuficiente) → pagada
- [x] `PagarCuotaModal`: modal con opciones de pago simple y mixto
- [x] `ModalDetalleCuota`: detalle de cuota con historial de pagos
- [x] `OtController@formasPago`: endpoint JSON con métodos de pago disponibles
- [x] `OtController@comprobante`: página Inertia standalone para imprimir comprobante de pago
- [x] `ComprobantePago.tsx`: auto-imprime al cargar, tamaño legal, incluye datos OT + cuota + métodos
- [x] Migraciones para tabla cuotas, pagos mixtos, columnas metodo_pago_id, monto_recibido, permite_pago_mixto
- [x] Reportes/Cuotas por Vencer: query real con cálculo de días restantes, filtro pendiente/parcial, paginación local en frontend
- [x] `verificarOtFinalizada()` helper en ambos flows de pago (normal y mixto): al pagar, si todas las cuotas de la OT están pagadas, OT pasa automáticamente a estado Finalizada con `numero_ot` en response
- [x] SweetAlert de éxito "Todas las cuotas de la OT N°xxx han sido pagadas!" al recibir `ot_finalizada: true` en `OtDetalleModal.handlePagoExitoso`. El Dialog de detalle se cierra antes de mostrar la alerta para evitar conflictos de z-index con Radix UI

**Búsqueda y Visualización de OTs:**
- [x] BuscarOt: carga todas las OTs reales desde BD con relaciones como props de Inertia. SearchFilters (cols=2: N° OT|Estado + Fecha Desde|Fecha Hasta). DataTable con columnas: N° OT, RUT/Nombre Fallecido, RUT/Nombre Deudor, Servicios, Total ($), Fecha (DD-MM-YYYY), Estado (badge con Ingresada/Finalizada/Anulada), Acciones (Ver OT → OtDetalleModal, Editar OT → EditarOtModal solo para Superadmin/Admin, Imprimir → nueva pestaña). Filtros client-side
- [x] BuscarPorFallecido: consulta real a `/cementerio/buscar-fallecido-ubicacion`. Muestra Info del Fallecido + Ubicación actual + botón "Ver OT" con OtDetalleModal
- [x] OtDetalleModal: componente Dialog shadcn con tabs (Información, Cuotas). Fetchea `/cementerio/ot/{numero}/detalle` al abrir. Muestra: estado badge desde objeto relacionado `estado?.nombre` (Ingresada/Finalizada/Anulada) + Imprimir. Tab Información: Datos Fallecido (grid-cols-4), Responsable Financiero (grid-cols-3), Contactos (grid-cols-3), Ubicación (grid-cols-4), tabla Servicios + Info Financiera (subtotal, IVA, total). Tab Cuotas: lista de cuotas con PagarCuotaModal. SweetAlert de éxito al finalizar todas las cuotas
- [x] ImprimirOt: página standalone sin AppLayout, auto-imprime al cargar. Tamaño legal (oficio), márgenes 0.75cm. Mismo layout compacto que OtDetalleModal (grids 4/3/3/4). Badge de estado comentado. Contactos incluido. Fecha de generación al pie

**Ubicaciones:**
- [x] Migraciones completas: sectores, tipos_ubicacion, estados_ubicacion, ubicaciones, fallecido_ubicacion
- [x] Ubicacion model: SoftDeletes, relaciones tipoUbicacion, sector, estadoUbicacion, fallecidos, fallecidosActivos (where activo=true)
- [x] Fallecido model: relación ubicacionActual (HasOne where activo=true) e historialUbicaciones (HasMany)
- [x] ConsultarUbicaciones: filtros por Tipo/Sector/Estado desde catálogos reales (props Inertia). Fetch a `/cementerio/ubicaciones/consultar-data` con 3 filtros opcionales. DataTable con columnas: Código, Tipo, Sector, Estado (badge), Ocupación (ocupados/capacidad). Modal detalle con info de ubicación + tabla de fallecidos. "Ver OT" → OtDetalleModal. "Ver Fallecido" → EditarFallecidoModal
- [x] Endpoint JSON `/cementerio/ubicaciones/consultar-data`: filtros tipo/sector/estado, carga fallecidosActivos con sexo, estadoCivil + última OT por fallecido. Retorna datos completos para edición de fallecido en un solo viaje

**Generales:**
- [x] Sidebar: "Gestión Mortuoria" colapsable con hijos "Registro Fallecido" e "Historial Deudores", icono peso para Deudores. Además: "Órdenes de Trabajo" colapsable con hijos "Ingresar OT", "Buscar OT", "Buscar por Fallecido". "Ubicaciones" con "Consultar Ubicaciones"
- [x] Permisos `cementerio-*`: control condicional por ítem individual (cada link del sidebar checa su sub-permiso específico)
- [x] Backward compat: si el usuario tiene `cementerio` pero ningún `cementerio-*`, se muestran todos los items del menú
- [x] DataTable genérica: soporta onRowClick para modales
- [x] Componentes reutilizables: Breadcrumbs, CardSection, ActionButtons, SearchFilters (con prop cols para grid variable), PageHeader, EmptyState, FormInput, FormSelect, FormTextarea
- [x] Seeders idempotentes (firstOrCreate) para todos los catálogos de Cementerio
- [x] Seeders de datos manuales (CementerioFallecidosSeeder, CementerioDeudoresSeeder) no ejecutados automáticamente
- [x] Formato fechas DD-MM-YYYY sin timezone: parseo manual desde YYYY-MM-DD
- [x] Print en tamaño legal con @page size: legal, margin: 0.75cm

### Diseño UI
- Sidebar azul con icono Cross, submenús anidados con ChevronDown animado. 3 grupos: Gestión Mortuoria, Órdenes de Trabajo, Ubicaciones
- Páginas con animate-fade-in-up, breadcrumbs (último sin href), títulos `text-2xl font-semibold tracking-tight`
- Tablas con DataTable compartida, badges de estado coloreados (Badge shadcn/ui)
- Modales con shadcn/ui Dialog + Tabs + CardSection con iconos
- PagarCuotaModal con dos modos de pago (simple / mixto con tabla de métodos)
- ComprobantePago: página standalone tamaño legal, auto-impresión al cargar
- Wizard IngresarOt con sidebar lateral numerado (1, 2, 3) + paso activo resaltado
- SweetAlert2 centrado con N° OT en azul grande + 3 botones
- Timeline Documentos con dots de colores (verde=ingreso, azul=OT, ámbar=actualización)
- Reportes con tabs shadcn/ui + DataTable onRowClick para abrir modales
- ImprimirOt: página tamaño legal (oficio), @page size: legal, margin: 0.75cm, contenido compacto en una hoja
- Shadcn/ui DataTable con filtros client-side en BuscarOt (SearchFilters con cols=2)
- SearchFilters acepta prop `cols` (1-4) para controlar grid sin afectar otras páginas

---

## Módulo: Asistencia

### Descripción
Módulo de asistencia construido **100% con datos mock** (sin backend, sin BD, sin controladores). Incluye un Dashboard de indicadores institucionales, Reportes Por Funcionario, Reportes Por Unidad (hub con flujo "Buscar", Diario y Mensual) y un módulo de Horarios laborales (maqueta estática, sin persistencia). Etapa 4 completada: reportes Por Unidad + módulo Horarios.

### Archivos involucrados

**Backend:**
- `routes/web.php` — Grupo `prefix('asistencia')` con 7 rutas Inertia (closures). Middleware: auth, verified. Sin modelos, migraciones, seeders ni controladores.

**Frontend:**
- `resources/js/Pages/Asistencia/Dashboard/Index.tsx` — Dashboard con indicadores, gráficos, rankings y alertas
- `resources/js/Pages/Asistencia/Reportes/PorFuncionario.tsx` — Reporte con buscador de funcionario por RUT/nombre
- `resources/js/Pages/Asistencia/Reportes/PorUnidad.tsx` — Hub con flujo "Buscar" por lugar de desempeño
- `resources/js/Pages/Asistencia/Reportes/PorUnidad/IntegrantesModal.tsx` — Modal de integrantes de unidad con accesos a Diario/Mensual
- `resources/js/Pages/Asistencia/Reportes/PorUnidad/Diario.tsx` — Reporte diario de una unidad (lee `?unidad=` desde URL)
- `resources/js/Pages/Asistencia/Reportes/PorUnidad/Mensual.tsx` — Reporte mensual de una unidad (lee `?unidad=` desde URL)
- `resources/js/Pages/Asistencia/Reportes/PorUnidad/VerAsistenciaModal.tsx` — Modal con detalle de asistencia del funcionario
- `resources/js/Pages/Asistencia/Horarios/Index.tsx` — Gestión de horarios laborales (maqueta estática)
- `resources/js/types/asistencia.ts` — Tipos: `IndicadorAsistencia`, `FuncionarioAsistencia`, `RegistroAsistencia`, `LugarOption`, `UnidadAsistencia`, `FuncionarioUnidad`, `RegistroDiarioUnidad`, `DatosUnidadDiario`, `DatosUnidadMensual`, `DetalleMensualFuncionario`, `DiaHorario`, `HorarioLaboral`, etc.
- `resources/js/lib/asistenciaMockData.ts` — Datos mock (~1,690 líneas, 60+ exports): `periodos`, `centrosSalud`, `unidades`, `indicadores`, `evolucionAtrasos`, `evolucionHorasExtra`, `cumplimientoCentros`, `cumplimientoUnidades`, `estadoDiario`, `tendenciaSemanal`, `comparacionMes`, `rankingCumplimiento`, `rankingAusentismo`, `alertas`, `actividadReciente`, `resumenInstitucional`, `funcionarios`, `horarios`, `horariosLaborales`, `lugaresDesempeno`, `unidadesCasaCentral`, `funcionariosUnidad`, `estadosDiarioOptions`, `datosDiarioPorUnidad`, `alertasDia`, `indicadoresCobertura`, `resumenMensualInformatica`, `detalleMensualInformatica`, `evolucionHorasInformatica`, `evolucionHorasExtraInformatica`, `evolucionAtrasosInformatica`, `distribucionMensualInformatica`, `comparacionMensualInformatica`
- `resources/js/Layouts/AppLayout.tsx` — Sidebar con ítem "Asistencia" (icono `ClipboardCheck`), condicionado por permiso `asistencia`, con submenús Dashboard, Reportes y Horarios

### Rutas

| Método | URI | Descripción | Name |
|--------|-----|-------------|------|
| GET | `/asistencia` | Redirect a dashboard | `asistencia.index` |
| GET | `/asistencia/dashboard` | Inertia `Asistencia/Dashboard/Index` | `asistencia.dashboard` |
| GET | `/asistencia/reportes/por-funcionario` | Inertia `Asistencia/Reportes/PorFuncionario` | `asistencia.reportes.por-funcionario` |
| GET | `/asistencia/reportes/por-unidad` | Inertia `Asistencia/Reportes/PorUnidad` (hub) | `asistencia.reportes.por-unidad` |
| GET | `/asistencia/reportes/por-unidad/diario` | Inertia `Asistencia/Reportes/PorUnidad/Diario` | `asistencia.reportes.por-unidad.diario` |
| GET | `/asistencia/reportes/por-unidad/mensual` | Inertia `Asistencia/Reportes/PorUnidad/Mensual` | `asistencia.reportes.por-unidad.mensual` |
| GET | `/asistencia/horarios` | Inertia `Asistencia/Horarios/Index` | `asistencia.horarios` |

> Nota: la ruta `reportes/reporte-avanzado` fue **eliminada** (era un placeholder). El archivo `ReporteAvanzado.tsx` fue borrado y el link removido del sidebar; el import `BarChart3` se conserva porque se usa en el link colapsado "Reportes".

### Funcionalidades implementadas

**Dashboard:**
- [x] 10 tarjetas de indicadores con variación y tendencia (Dotación Total 1,247, Presentes Hoy 1,089, Ausentes Hoy 158, Licencias Médicas 42, Vacaciones 87, Permisos Admin. 31, Marcaciones Pendientes 23, Horas Extra Acum. 1,245h, Atrasos del Día 67, Cumplimiento General 87.3%)
- [x] Gráficos de evolución mensual (atrasos y horas extra)
- [x] Cumplimiento por centros de salud y por unidades
- [x] Estado diario, tendencia semanal y comparación con el mes anterior
- [x] Rankings de cumplimiento y ausentismo por centro
- [x] Alertas y actividad reciente
- [x] Resumen institucional y filtros por período/centro (mock)

**Reportes Por Funcionario:**
- [x] Buscador con autocompletado por RUT o nombre del funcionario (sugerencias desplegables)
- [x] Ficha del funcionario con datos personales y laborales
- [x] Detalle de registros de asistencia por día con estado (presente, ausente, atraso, permiso, licencia, vacaciones)
- [x] Mini cartola mensual con totales (días trabajados, atrasos, horas extra)
- [x] Descarga de cartola (mock, sin backend)

**Reportes Por Unidad (hub):**
- [x] Flujo "Buscar" obligatorio: se selecciona lugar de desempeño → se habilita select de unidad (filtrado por `unidadesDelLugar` via useMemo; deshabilitado si el lugar no tiene unidades) → botón Buscar → `setBuscar(true)`
- [x] Al cambiar el lugar, se preselecciona la primera unidad y se resetea la búsqueda
- [x] Al cambiar la unidad dentro del mismo lugar, se resetea `buscar=false` (requiere volver a buscar)
- [x] Avisos condicionales: "Seleccione un lugar y unidad para comenzar" / "Sin unidades en este lugar" / "Presione Buscar para cargar los datos"
- [x] Datos mock: 6 lugares de desempeño, 5 unidades (4 en Casa Central + Asesores en DAS), 23 funcionarios por unidad
- [x] Tarjetas resumen de la unidad (dotación, presentes, ausentes, cumplimiento)
- [x] `IntegrantesModal` por fila con lista de funcionarios y accesos "Ver Diario" / "Ver Mensual" que navegan con `?unidad={id}` en la URL (no hay estado compartido entre páginas)

**Reportes Por Unidad — Diario:**
- [x] Flujo "Buscar" propio (mismo patrón del hub: lugar → unidad → buscar)
- [x] Estado inicial según `?unidad=` válido en la URL
- [x] Tarjetas resumen del día + detalle diario de funcionarios
- [x] Estados: presente, ausente, permiso, licencia, vacaciones, atraso
- [x] `VerAsistenciaModal` con detalle de marcaciones, horario utilizado, atrasos y horas extra

**Reportes Por Unidad — Mensual:**
- [x] Lee `?unidad=` desde la URL (sin flujo Buscar propio)
- [x] Tarjetas resumen mensual (asistencia, ausentismo, atrasos, horas extra)
- [x] Detalle mensual por funcionario con conteos y porcentajes
- [x] Gráficos de evolución (horas, horas extra, atrasos)
- [x] Distribución mensual por estado y comparación con el mes anterior

**Horarios:**
- [x] Buscador con autocompletado de funcionario (RUT/nombre)
- [x] Ficha del funcionario (avatar con iniciales, nombre, RUT, badge Estado, grid Cargo/Profesión/Unidad/Centro de Salud/Jornada/Estado)
- [x] Tabs "Editar Horario" y "Horarios Disponibles" (default: Horarios Disponibles)
- [x] Formulario de horario: Nombre, Descripción, Estado + tabla semanal (Día | switch Laborable | Hora Entrada | Hora Salida `type=time`)
- [x] Switch Laborable inline `role="switch"` (patrón Rrhh/Edit.tsx): OFF deshabilita inputs de hora y muestra badge "Fin de Semana"/"No Laborable"
- [x] Tabla de horarios disponibles con acciones Visualizar / Editar / Duplicar + botón "Nuevo Horario"
- [x] Modal detalle (Dialog): jornada, horas semanales, días laborales/descanso, estado, fecha de asignación y distribución semanal
- [x] **Maqueta estática**: botones "Guardar" y "Duplicar" son decorativos (no persisten cambios)
- [x] **Modelo sin horario predeterminado**: se eliminó el panel "Horario Actualmente Asignado" y el botón "Asignar" del funcionario; el campo `asignado` fue removido del tipo `HorarioLaboral` y del mock. Los funcionarios no tienen horario asignado por defecto
- [x] Mock `horariosLaborales`: **Horario CESFAM** (Jornada Completa, 43,75 h, L-V 07:45-16:30, S/D Fin de Semana, estado Activo, fecha 01-07-2026) y **Horario Administrativo** (Jornada Completa, 44 h, L-J 08:00-17:00 / V 08:00-16:00, S/D Fin de Semana, estado Disponible)
- [x] Tipos nuevos: `DiaHorario` (dia, laborable, entrada, salida) y `HorarioLaboral` (id, nombre, descripcion, jornada, horasSemanales, diasLaborales, diasDescanso, estado, fechaAsignacion, dias)

### Diseño UI
- Sidebar: ítem "Asistencia" con icono `ClipboardCheck`, expandible. Submenús: Dashboard, Reportes (colapsable → "Por Funcionario", "Por Unidad" colapsable → "Unidades", "Diario", "Mensual") y "Horarios"
- Mismo lenguaje visual del proyecto: shadcn/ui Cards, Badges, Tabs, Dialog, switch inline con `role="switch"`
- Páginas con `animate-fade-in-up space-y-6`, títulos `text-2xl font-semibold tracking-tight`
- Buscadores con autocompletado de sugerencias (RUT/nombre) con teclado y clic
- `layout = (page) => <AppLayout title=... children={page} />` — patrón con prop `children` (acepta lint `react/no-children-prop`, convención del proyecto)
- Colores de estado consistentes: presente (verde), ausente (rojo), permiso/licencia/vacaciones (ámbar/azul/violeta)
