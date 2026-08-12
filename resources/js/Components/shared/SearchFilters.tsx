import type { ReactNode } from 'react'
import { Card, CardContent } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Search, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchFiltersProps {
  children: ReactNode
  onSearch?: () => void
  onClear?: () => void
  className?: string
  cols?: 1 | 2 | 3 | 4
}

export function SearchFilters({
  children,
  onSearch,
  onClear,
  className,
  cols = 3,
}: SearchFiltersProps) {
  const colsClass = {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
  }[cols]

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="pt-6">
        <div className={`grid gap-4 md:grid-cols-2 ${colsClass}`}>
          {children}
        </div>
        <div className="mt-4 flex items-center gap-3 border-t pt-4">
          <Button onClick={onSearch} className="gap-2">
            <Search className="h-4 w-4" />
            Buscar
          </Button>
          <Button variant="outline" onClick={onClear} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
