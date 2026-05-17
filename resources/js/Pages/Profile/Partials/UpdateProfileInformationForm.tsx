import { Label } from '@/Components/ui/label'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { Link, useForm, usePage, router } from '@inertiajs/react'
import { FormEventHandler, useRef } from 'react'
import Swal from 'sweetalert2'
import type { User } from '@/types'

export default function UpdateProfileInformation({
  mustVerifyEmail,
  status,
}: {
  mustVerifyEmail: boolean
  status?: string
}) {
  const user = usePage().props.auth.user as User
  const photoInput = useRef<HTMLInputElement>(null)

  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
    nombres: user.nombres,
    apellido_paterno: user.apellido_paterno,
    apellido_materno: user.apellido_materno ?? '',
    email: user.email,
    foto_perfil: null as File | null,
  })

  const submit: FormEventHandler = async (e) => {
    e.preventDefault()
    const result = await Swal.fire({
      title: '¿Guardar cambios?',
      text: 'Se actualizarán tus datos personales.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
    })
    if (!result.isConfirmed) return
    patch(route('profile.update'), {
      forceFormData: true,
      onSuccess: () => Swal.fire({ title: 'Guardado', text: 'Datos actualizados correctamente.', icon: 'success', timer: 2000, showConfirmButton: false }),
    })
  }

  const previewUrl = data.foto_perfil
    ? URL.createObjectURL(data.foto_perfil)
    : user.foto_perfil_url

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del Perfil</CardTitle>
        <p className="text-sm text-muted-foreground">
          Actualiza tus datos personales.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted md:h-28 md:w-28">
              {previewUrl ? (
                <img src={previewUrl} alt="Foto" className="h-full w-full object-cover" />
              ) : (
                <span className="text-lg font-semibold text-muted-foreground">
                  {user.nombres.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <Button type="button" variant="outline" size="sm" onClick={() => photoInput.current?.click()}>
                {user.foto_perfil_url ? 'Cambiar foto' : 'Subir foto'}
              </Button>
              <input
                ref={photoInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => setData('foto_perfil', e.target.files?.[0] ?? null)}
              />
              <p className="mt-1 text-xs text-muted-foreground">JPG, PNG o WEBP. Máx 2 MB.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombres">Nombres</Label>
              <Input
                id="nombres"
                value={data.nombres}
                onChange={(e) => setData('nombres', e.target.value)}
                required
              />
              {errors.nombres && <p className="text-sm text-destructive">{errors.nombres}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="apellido_paterno">Apellido Paterno</Label>
              <Input
                id="apellido_paterno"
                value={data.apellido_paterno}
                onChange={(e) => setData('apellido_paterno', e.target.value)}
                required
              />
              {errors.apellido_paterno && <p className="text-sm text-destructive">{errors.apellido_paterno}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="apellido_materno">Apellido Materno</Label>
            <Input
              id="apellido_materno"
              value={data.apellido_materno}
              onChange={(e) => setData('apellido_materno', e.target.value)}
            />
            {errors.apellido_materno && <p className="text-sm text-destructive">{errors.apellido_materno}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              required
              autoComplete="username"
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          {mustVerifyEmail && user.email_verified_at === null && (
            <div>
              <p className="text-sm text-muted-foreground">
                Tu correo electrónico no está verificado.{' '}
                <button
                  onClick={async () => {
                    const result = await Swal.fire({
                      title: '¿Reenviar verificación?',
                      text: 'Se enviará un nuevo enlace a tu correo.',
                      icon: 'question',
                      showCancelButton: true,
                      confirmButtonText: 'Sí, enviar',
                      cancelButtonText: 'Cancelar',
                    })
                    if (result.isConfirmed) {
                      router.post(route('verification.send'), {}, {
                        onSuccess: () => Swal.fire({ title: 'Enviado', text: 'Revisa tu bandeja de entrada.', icon: 'success', timer: 2000, showConfirmButton: false }),
                      })
                    }
                  }}
                  className="text-primary underline hover:text-primary/80"
                >
                  Haz clic aquí para reenviar el correo de verificación.
                </button>
              </p>
              {status === 'verification-link-sent' && (
                <p className="mt-1 text-sm font-medium text-green-600 dark:text-green-400">
                  Se ha enviado un nuevo enlace de verificación a tu correo.
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={processing}>
              Guardar
            </Button>
            {recentlySuccessful && (
              <p className="text-sm text-muted-foreground">Guardado.</p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
