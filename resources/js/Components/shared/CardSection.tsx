import type { ReactNode, ComponentType } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/card'
import { cn } from '@/lib/utils'

interface CardSectionProps {
  title: string
  description?: string
  icon?: ComponentType<{ className?: string }>
  children: ReactNode
  className?: string
  iconColor?: 'primary' | 'secondary'
}

export function CardSection({
  title,
  description,
  icon: Icon,
  children,
  className,
  iconColor = 'primary',
}: CardSectionProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center gap-3 pb-4">
        {Icon && (
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              iconColor === 'primary'
                ? 'bg-primary/10'
                : 'bg-teal-50 dark:bg-teal-950/20'
            )}
          >
            <Icon
              className={cn(
                'h-5 w-5',
                iconColor === 'primary' ? 'text-primary' : 'text-secondary'
              )}
            />
          </div>
        )}
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription className="mt-0.5">{description}</CardDescription>}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
