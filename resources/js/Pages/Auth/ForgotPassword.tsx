import GuestLayout from '@/Layouts/GuestLayout'
import { Head, useForm } from '@inertiajs/react'
import { Input } from '@/Components/ui/input'
import { Button } from '@/Components/ui/button'
import { FormEventHandler } from 'react'

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  })

  const submit: FormEventHandler = (e) => {
    e.preventDefault()
    post(route('password.email'))
  }

  return (
    <GuestLayout>
      <Head title="Recuperar Contraseña" />

      <p className="mb-4 text-sm text-muted-foreground">
        ¿Olvidaste tu contraseña? Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
      </p>

      {status && (
        <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
          {status}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Input
            id="email"
            type="email"
            name="email"
            value={data.email}
            autoFocus
            onChange={(e) => setData('email', e.target.value)}
            placeholder="correo@ejemplo.cl"
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={processing}>
            Enviar enlace
          </Button>
        </div>
      </form>
    </GuestLayout>
  )
}
