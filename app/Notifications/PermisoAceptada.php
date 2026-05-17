<?php

namespace App\Notifications;

use App\Models\Permiso;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PermisoAceptada extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Permiso $permiso) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $user = $this->permiso->userAsignado;
        $tipo = $this->permiso->tipoPermiso?->nombre ?? '—';
        $detalle = $this->permiso->detalle;
        $motivo = $this->permiso->motivo;
        $solicitud = $this->permiso->permiso_display;
        $gestionadoEl = $this->permiso->fecha_gestion?->format('d/m/Y') ?? now()->format('d/m/Y');

        return (new MailMessage)
            ->subject("✅ [ORION-X] {$solicitud} aceptada")
            ->greeting("Hola {$user->nombres},")
            ->line("Tu solicitud **{$solicitud}** ha sido **ACEPTADA**.")
            ->line('')
            ->line("**Solicitud:** {$solicitud}")
            ->line("**Tipo:** {$tipo}")
            ->line("**Detalle:** {$detalle}")
            ->line("**Motivo:** {$motivo}")
            ->line("**Gestionado el:** {$gestionadoEl}")
            ->line("**Estado:** ✅ Aceptada")
            ->line('')
            ->action('Ir a Mi Espacio', route('portal.index'))
            ->salutation('Atentamente, — Equipo ORION-X');
    }
}
