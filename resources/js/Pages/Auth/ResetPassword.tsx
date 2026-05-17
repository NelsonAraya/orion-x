import GuestLayout from '@/Layouts/GuestLayout'
import { Head, useForm } from '@inertiajs/react'
import { Label } from '@/Components/ui/label'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'
import { FormEventHandler } from 'react'

export default function ResetPassword({
  token,
  email,
}: {
  token: string
  email: string
}) {
  const { data, setData, post, processing, errors, reset } = useForm({
    token,
    email,
    password: '',
    password_confirmation: '',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route('password.store'), {
      onFinish: () => reset('password', 'password_confirmation'),
    })
  }

  return (
    <GuestLayout>
      <Head title="Restablecer Contraseña" />

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={data.email}
            autoComplete="username"
            onChange={(e) => setData('email', e.target.value)}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Nueva contraseña</Label>
          <Input
            id="password"
            type="password"
            name="password"
            value={data.password}
            autoComplete="new-password"
            autoFocus
            onChange={(e) => setData('password', e.target.value)}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password_confirmation">Confirmar contraseña</Label>
          <Input
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            autoComplete="new-password"
            onChange={(e) => setData('password_confirmation', e.target.value)}
            placeholder="••••••••"
          />
          {errors.password_confirmation && (
            <p className="text-sm text-destructive">{errors.password_confirmation}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={processing}>
            Restablecer contraseña
          </Button>
        </div>
      </form>
    </GuestLayout>
  )
}
