import { Label } from '@/Components/ui/label'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card'
import { useForm } from '@inertiajs/react'
import { FormEventHandler, useRef } from 'react'
import Swal from 'sweetalert2'

export default function UpdatePasswordForm() {
  const passwordInput = useRef<HTMLInputElement>(null)
  const currentPasswordInput = useRef<HTMLInputElement>(null)

  const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
    current_password: '',
    password: '',
    password_confirmation: '',
  })

  const updatePassword: FormEventHandler = async (e) => {
    e.preventDefault()
    const result = await Swal.fire({
      title: '¿Cambiar contraseña?',
      text: 'Se actualizará tu contraseña de acceso.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    })
    if (!result.isConfirmed) return
    put(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => {
        reset()
        Swal.fire({ title: 'Contraseña actualizada', icon: 'success', timer: 2000, showConfirmButton: false })
      },
      onError: (errors) => {
        if (errors.password) {
          reset('password', 'password_confirmation')
          passwordInput.current?.focus()
        }
        if (errors.current_password) {
          reset('current_password')
          currentPasswordInput.current?.focus()
        }
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actualizar Contraseña</CardTitle>
        <p className="text-sm text-muted-foreground">
          Asegúrate de usar una contraseña larga y segura.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={updatePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_password">Contraseña actual</Label>
            <Input
              id="current_password"
              ref={currentPasswordInput}
              value={data.current_password}
              onChange={(e) => setData('current_password', e.target.value)}
              type="password"
              autoComplete="current-password"
            />
            {errors.current_password && (
              <p className="text-sm text-destructive">{errors.current_password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Nueva contraseña</Label>
            <Input
              id="password"
              ref={passwordInput}
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              type="password"
              autoComplete="new-password"
            />
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
            <Input
              id="password_confirmation"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              type="password"
              autoComplete="new-password"
            />
            {errors.password_confirmation && (
              <p className="text-sm text-destructive">{errors.password_confirmation}</p>
            )}
          </div>

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
