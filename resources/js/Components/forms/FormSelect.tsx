import { Label } from '@/Components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/Components/ui/select'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps {
  label: string
  error?: string
  required?: boolean
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  options: SelectOption[]
  id?: string
  className?: string
  disabled?: boolean
}

export function FormSelect({
  label,
  error,
  required,
  value,
  onValueChange,
  placeholder = 'Seleccionar...',
  options,
  id,
  className,
  disabled,
}: FormSelectProps) {
  const selectId = id || label.toLowerCase().replace(/\s+/g, '_')
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={selectId} className="flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={selectId}
          className={cn(
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
