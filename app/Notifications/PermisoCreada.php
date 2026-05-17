<?php

namespace App\Notifications;

use App\Models\Permiso;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PermisoCreada extends Notification implements ShouldQueue
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

        return (new MailMessage)
            ->subject("✋ [ORION-X] Nueva solicitud {$solicitud} — {$user->name}")
            ->greeting('Hola,')
            ->line("**{$user->name}** ha solicitado un permiso.")
            ->line('')
            ->line("**Solicitud:** {$solicitud}")
            ->line("**Tipo:** {$tipo}")
            ->line("**Detalle:** {$detalle}")
            ->line("**Motivo:** {$motivo}")
            ->line('')
            ->action('Revisar en RRHH', route('rrhh.edit', $user->id))
            ->salutation('Atentamente, — Equipo ORION-X');
    }
}
