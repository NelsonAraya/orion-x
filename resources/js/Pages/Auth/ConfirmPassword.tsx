import GuestLayout from '@/Layouts/GuestLayout'
import { Head, useForm } from '@inertiajs/react'
import { Label } from '@/Components/ui/label'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'
import { FormEventHandler } from 'react'

export default function ConfirmPassword() {
  const { data, setData, post, processing, errors, reset } = useForm({
    password: '',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route('password.confirm'), {
      onFinish: () => reset('password'),
    })
  }

  return (
    <GuestLayout>
      <Head title="Confirmar Contraseña" />

      <p className="mb-4 text-sm text-muted-foreground">
        Esta es un área segura de la aplicación. Por favor confirma tu contraseña antes de continuar.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            name="password"
            value={data.password}
            autoFocus
            onChange={(e) => setData('password', e.target.value)}
            placeholder="••••••••"
          />
          {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={processing}>
            Confirmar
          </Button>
        </div>
      </form>
    </GuestLayout>
  )
}
