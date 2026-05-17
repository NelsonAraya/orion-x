import { type ReactNode } from 'react'
import { Head, usePage } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'
import type { User } from '@/types'

export default function Index() {
  const user = (usePage().props.auth as { user: User }).user

  return (
    <>
      <Head title="Dashboard" />
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Bienvenido, {user.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Panel de administración del sistema ORION-X
          </p>
        </div>
      </div>
    </>
  )
}

Index.layout = (page: ReactNode) => <AppLayout children={page} />
