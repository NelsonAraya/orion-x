<?php

namespace App\Notifications;

use App\Models\Vacacione;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VacacionAnulada extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Vacacione $vacacion) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $user = $this->vacacion->user;
        $solicitud = 'VAC-' . $this->vacacion->id;
        $inicio = $this->vacacion->fecha_inicio?->format('d/m/Y') ?? '—';
        $fin = $this->vacacion->fecha_termino?->format('d/m/Y') ?? '—';
        $dias = $this->vacacion->dias_solicitados;
        $motivo = $this->vacacion->motivo;
        $gestionadoEl = $this->vacacion->fecha_gestion?->format('d/m/Y') ?? now()->format('d/m/Y');
        $observacion = $this->vacacion->observacion_anulacion;

        return (new MailMessage)
            ->subject("🔄 [ORION-X] {$solicitud} anulada")
            ->greeting("Hola {$user->nombres},")
            ->line("Tu solicitud **{$solicitud}** ha sido **ANULADA**.")
            ->line('')
            ->line("**Solicitud:** {$solicitud}")
            ->line("**Fechas:** {$inicio} → {$fin}")
            ->line("**Días:** {$dias}")
            ->line("**Motivo:** {$motivo}")
            ->line("**Gestionado el:** {$gestionadoEl}")
            ->line("**Estado:** 🔄 Anulada")
            ->line("**Observación:** {$observacion}")
            ->line('')
            ->line('Si tienes dudas, contacta al departamento de RRHH.')
            ->action('Ir a Mi Espacio', route('portal.index'))
            ->salutation('Atentamente, — Equipo ORION-X');
    }
}
