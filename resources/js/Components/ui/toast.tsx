import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'destructive'
  onClose: (id: string) => void
}

export function Toast({ id, title, description, variant, onClose }: ToastProps) {
  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-top-2',
        variant === 'destructive'
          ? 'border-destructive/30 bg-destructive/10 text-destructive'
          : 'border-border bg-card text-card-foreground'
      )}
    >
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <button
        onClick={() => onClose(id)}
        className="shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: { id: string; title: string; description?: string; variant?: 'default' | 'destructive' }[]
  onClose: (id: string) => void
}) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} {...t} onClose={onClose} />
      ))}
    </div>
  )
}
