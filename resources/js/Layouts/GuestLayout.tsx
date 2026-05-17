import { PropsWithChildren } from 'react'
import { Head } from '@inertiajs/react'

export default function GuestLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Head title="ORION-X" />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center">
            <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">ORION-X</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sistema de Gestión Empresarial</p>
          </div>
          <div className="rounded-xl border bg-card p-6 shadow-sm">{children}</div>
        </div>
      </div>
    </>
  )
}
