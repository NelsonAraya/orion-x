import type { ComponentType } from 'react'
import { Button } from '@/Components/ui/button'
import { cn } from '@/lib/utils'

interface ActionButton {
  label: string
  icon?: ComponentType<{ className?: string }>
  onClick?: () => void
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  type?: 'button' | 'submit'
  disabled?: boolean
}

interface ActionButtonsProps {
  primary: ActionButton
  secondary?: ActionButton[]
  className?: string
}

export function ActionButtons({
  primary,
  secondary = [],
  className,
}: ActionButtonsProps) {
  const PrimaryIcon = primary.icon
  return (
    <div className={cn('flex items-center justify-end gap-3 border-t pt-6', className)}>
      {secondary.map((btn, i) => {
        const Icon = btn.icon
        return (
          <Button
            key={i}
            type={btn.type ?? 'button'}
            variant={btn.variant ?? 'outline'}
            onClick={btn.onClick}
            disabled={btn.disabled}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {btn.label}
          </Button>
        )
      })}
      <Button
        type={primary.type ?? 'button'}
        onClick={primary.onClick}
        disabled={primary.disabled}
        className="gap-2 min-w-[140px]"
      >
        {PrimaryIcon && <PrimaryIcon className="h-4 w-4" />}
        {primary.label}
      </Button>
    </div>
  )
}
