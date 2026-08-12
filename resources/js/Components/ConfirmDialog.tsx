import { type ReactNode } from 'react'
import { Button } from '@/Components/ui/button'
import { AlertTriangle, HelpCircle } from 'lucide-react'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message?: string
  children?: ReactNode
  confirmText?: string
  cancelText?: string
  confirmColor?: string
  icon?: ReactNode
  className?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  children,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  confirmColor,
  icon,
  className,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div className={`relative z-10 w-full rounded-lg border bg-card p-6 shadow-lg ${className ?? 'max-w-sm'}`}>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            {icon ?? <HelpCircle className="h-6 w-6 text-muted-foreground" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            {children ?? (message && <p className="mt-1 text-sm text-muted-foreground">{message}</p>)}
          </div>
        </div>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Button variant="outline" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            style={confirmColor ? { backgroundColor: confirmColor } : undefined}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
