import { type ReactNode } from 'react'
import { Head, Link, useForm } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import { Button } from '@/Components/ui/button'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/Components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select'
import { ArrowLeft, Info, UserPlus, User, Calendar, Phone, Mail, MapPin, Briefcase, Building2 } from 'lucide-react'
import Swal from 'sweetalert2'
import type { CatalogItem } from '@/types'

interface Props {
  sexos: CatalogItem[]
  nacionalidades: CatalogItem[]
  profesiones: CatalogItem[]
  previsiones: CatalogItem[]
  afps: CatalogItem[]
}

export default function Create({ sexos, nacionalidades, profesiones, previsiones, afps }: Props) {
  const { data, setData, post, processing, errors } = useForm({
    id: '',
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    sexo_id: '',
    nacionalidad_id: '',
    profesion_id: '',
    prevision_id: '',
    afp_id: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
    fecha_ingreso: '',
  })

  const handleRutChange = (value: string) => {
    setData('id', value.replace(/[^0-9kK-]/g, '').toUpperCase())
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await Swal.fire({
      title: '¿Crear usuario?',
      text: 'Se creará una nueva cuenta en el sistema.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#1a6bdb',
    })
    if (!result.isConfirmed) return

    post(route('rrhh.store'), {
      onSuccess: () => {
        Swal.fire({
          title: 'Usuario creado',
          text: 'El usuario fue registrado correctamente.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
        })
      },
    })
  }

  return (
    <>
      <Head title="RRHH - Nuevo Usuario" />

      <div className="animate-fade-in-up space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/rrhh">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Nuevo Usuario</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Ingresa los datos para registrar un nuevo usuario en el sistema.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-6" autoComplete="off">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Datos Personales</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Información básica del usuario.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800/30 dark:bg-amber-950/20 dark:text-amber-200">
                  <div className="flex items-start gap-3">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-medium">Contraseña automática</p>
                      <p className="mt-0.5 text-amber-700 dark:text-amber-300">
                        La contraseña será el RUT sin dígito verificador. Ej: <strong>17096233-8</strong> → <strong>17096233</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="id" className="flex items-center gap-1.5">
                      RUT
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="id"
                      placeholder="Ej: 17096233-8"
                      value={data.id}
                      onChange={(e) => handleRutChange(e.target.value)}
                      className="font-mono"
                      autoComplete="off"
                    />
                    {errors.id && (
                      <p className="text-xs text-destructive">{errors.id}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      Correo Electrónico
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="correo@ejemplo.cl"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      autoComplete="off"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombres" className="flex items-center gap-1.5">
                      Nombres
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="nombres"
                      placeholder="Nombres del usuario"
                      value={data.nombres}
                      onChange={(e) => setData('nombres', e.target.value)}
                      autoComplete="off"
                    />
                    {errors.nombres && (
                      <p className="text-xs text-destructive">{errors.nombres}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apellido_paterno" className="flex items-center gap-1.5">
                      Apellido Paterno
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="apellido_paterno"
                      placeholder="Apellido paterno"
                      value={data.apellido_paterno}
                      onChange={(e) => setData('apellido_paterno', e.target.value)}
                      autoComplete="off"
                    />
                    {errors.apellido_paterno && (
                      <p className="text-xs text-destructive">{errors.apellido_paterno}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="apellido_materno">Apellido Materno</Label>
                    <Input
                      id="apellido_materno"
                      placeholder="Apellido materno (opcional)"
                      value={data.apellido_materno}
                      onChange={(e) => setData('apellido_materno', e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="telefono" className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      Teléfono
                    </Label>
                    <Input
                      id="telefono"
                      placeholder="+56 9 1234 5678"
                      value={data.telefono}
                      onChange={(e) => setData('telefono', e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sexo_id">Sexo</Label>
                    <Select
                      value={data.sexo_id}
                      onValueChange={(v) => setData('sexo_id', v)}
                    >
                      <SelectTrigger id="sexo_id">
                        <SelectValue placeholder="Seleccionar sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        {sexos.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nacionalidad_id">Nacionalidad</Label>
                    <Select
                      value={data.nacionalidad_id}
                      onValueChange={(v) => setData('nacionalidad_id', v)}
                    >
                      <SelectTrigger id="nacionalidad_id">
                        <SelectValue placeholder="Seleccionar nacionalidad" />
                      </SelectTrigger>
                      <SelectContent>
                        {nacionalidades.map((n) => (
                          <SelectItem key={n.id} value={String(n.id)}>
                            {n.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fecha_nacimiento" className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                      Fecha de Nacimiento
                    </Label>
                    <Input
                      id="fecha_nacimiento"
                      type="date"
                      value={data.fecha_nacimiento}
                      onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="direccion" className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      Dirección
                    </Label>
                    <textarea
                      id="direccion"
                      placeholder="Dirección del usuario"
                      value={data.direccion}
                      onChange={(e) => setData('direccion', e.target.value)}
                      rows={2}
                      className="flex min-h-[36px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card>
              <CardHeader className="flex flex-row items-center gap-3 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/20">
                  <Briefcase className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <CardTitle>Información Laboral</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Datos relacionados al ámbito laboral del usuario.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="profesion_id">Profesión</Label>
                    <Select
                      value={data.profesion_id}
                      onValueChange={(v) => setData('profesion_id', v)}
                    >
                      <SelectTrigger id="profesion_id">
                        <SelectValue placeholder="Seleccionar profesión" />
                      </SelectTrigger>
                      <SelectContent>
                        {profesiones.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prevision_id">Previsión</Label>
                    <Select
                      value={data.prevision_id}
                      onValueChange={(v) => setData('prevision_id', v)}
                    >
                      <SelectTrigger id="prevision_id">
                        <SelectValue placeholder="Seleccionar previsión" />
                      </SelectTrigger>
                      <SelectContent>
                        {previsiones.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="afp_id">
                      <Building2 className="mr-1.5 inline h-3.5 w-3.5 text-muted-foreground" />
                      AFP
                    </Label>
                    <Select
                      value={data.afp_id}
                      onValueChange={(v) => setData('afp_id', v)}
                    >
                      <SelectTrigger id="afp_id">
                        <SelectValue placeholder="Seleccionar AFP" />
                      </SelectTrigger>
                      <SelectContent>
                        {afps.map((a) => (
                          <SelectItem key={a.id} value={String(a.id)}>
                            {a.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 md:max-w-xs">
                  <Label htmlFor="fecha_ingreso" className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    Fecha de Ingreso
                  </Label>
                  <Input
                    id="fecha_ingreso"
                    type="date"
                    value={data.fecha_ingreso}
                    onChange={(e) => setData('fecha_ingreso', e.target.value)}
                    autoComplete="off"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex items-center gap-3 border-t pt-6">
            <Button type="submit" disabled={processing} className="gap-2 min-w-[160px]">
              {processing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creando...
                </span>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Crear Usuario
                </>
              )}
            </Button>
            <Link href="/rrhh">
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}

Create.layout = (page: ReactNode) => <AppLayout title="Nuevo Usuario" children={page} />
