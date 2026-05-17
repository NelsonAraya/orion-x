<?php

namespace App\Notifications;

use App\Models\Vacacione;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VacacionCreada extends Notification implements ShouldQueue
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
        $periodos = $this->vacacion->periodos->map(fn($p) => "Per. {$p->periodo_numero}: {$p->dias_consumidos} día(s)")->implode(', ');

        return (new MailMessage)
            ->subject("✋ [ORION-X] Nueva solicitud {$solicitud} — {$user->name}")
            ->greeting('Hola,')
            ->line("**{$user->name}** ha solicitado **{$dias} día(s)** de vacaciones.")
            ->line('')
            ->line("**Solicitud:** {$solicitud}")
            ->line("**Fechas:** {$inicio} → {$fin}")
            ->line("**Días:** {$dias}")
            ->line("**Períodos:** {$periodos}")
            ->line("**Motivo:** {$motivo}")
            ->line('')
            ->action('Revisar en RRHH', route('rrhh.edit', $user->id))
            ->salutation('Atentamente, — Equipo ORION-X');
    }
}
