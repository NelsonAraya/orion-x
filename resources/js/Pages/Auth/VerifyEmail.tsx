import GuestLayout from '@/Layouts/GuestLayout'
import { Head, Link, useForm, router } from '@inertiajs/react'
import Swal from 'sweetalert2'
import { Button } from '@/Components/ui/button'
import { FormEventHandler } from 'react'

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({})

  const submit: FormEventHandler = async (e) => {
    e.preventDefault()
    const result = await Swal.fire({
      title: '¿Reenviar verificación?',
      text: 'Se enviará un nuevo enlace a tu correo.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
    })
    if (!result.isConfirmed) return
    post(route('verification.send'), {
      onSuccess: () => Swal.fire({ title: 'Enviado', text: 'Revisa tu bandeja de entrada.', icon: 'success', timer: 2000, showConfirmButton: false }),
    })
  }

  return (
    <GuestLayout>
      <Head title="Verificar Correo" />

      <p className="mb-4 text-sm text-muted-foreground">
        Gracias por registrarte. Antes de comenzar, verifica tu dirección de correo electrónico haciendo clic en el enlace que te enviamos. Si no recibiste el correo, te enviaremos otro.
      </p>

      {status === 'verification-link-sent' && (
        <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
          Se ha enviado un nuevo enlace de verificación a la dirección de correo que proporcionaste.
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div className="flex items-center justify-between">
          <Button type="submit" disabled={processing} variant="outline">
            Reenviar verificación
          </Button>

          <button
            onClick={async () => {
              const result = await Swal.fire({
                title: '¿Cerrar sesión?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, cerrar sesión',
                cancelButtonText: 'Cancelar',
              })
              if (result.isConfirmed) router.post(route('logout'), {}, {})
            }}
            className="text-sm text-muted-foreground underline hover:text-foreground"
          >
            Cerrar sesión
          </button>
        </div>
      </form>
    </GuestLayout>
  )
}
