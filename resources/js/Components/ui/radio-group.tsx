import * as React from 'react'

interface RadioGroupContextValue {
  value: string
  onValueChange: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

interface RadioGroupProps {
  value: string
  onValueChange: (value: string) => void
  className?: string
  children: React.ReactNode
}

function RadioGroup({ value, onValueChange, className, children }: RadioGroupProps) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={className} role="radiogroup">
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

interface RadioGroupItemProps {
  value: string
  id: string
  disabled?: boolean
}

function RadioGroupItem({ value, id, disabled }: RadioGroupItemProps) {
  const ctx = React.useContext(RadioGroupContext)

  return (
    <button
      type="button"
      role="radio"
      id={id}
      aria-checked={ctx?.value === value}
      disabled={disabled}
      onClick={() => ctx?.onValueChange(value)}
      className={`aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
        ctx?.value === value ? 'bg-primary' : 'bg-transparent'
      }`}
    >
      {ctx?.value === value && (
        <span className="flex h-full w-full items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-primary-foreground" />
        </span>
      )}
    </button>
  )
}

export { RadioGroup, RadioGroupItem }
