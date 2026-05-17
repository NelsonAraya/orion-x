import AppLayout from '@/Layouts/AppLayout'
import { type ReactNode } from 'react'
import { Head } from '@inertiajs/react'
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import { PageHeader } from '@/Components/shared/PageHeader'

export default function Edit({
  mustVerifyEmail,
  status,
}: {
  mustVerifyEmail: boolean
  status?: string
}) {
  return (
    <>
      <Head title="Perfil" />
      <PageHeader title="Perfil" description="Administra tu información personal" />

      <div className="grid gap-6 lg:grid-cols-2 w-full">
        <UpdateProfileInformationForm
          mustVerifyEmail={mustVerifyEmail}
          status={status}
        />
        <UpdatePasswordForm />
      </div>
    </>
  )
}

Edit.layout = (page: ReactNode) => <AppLayout title="Perfil">{page}</AppLayout>
