import * as React from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "@heroicons/react/24/outline"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Componente DatePicker simplificado sem dependências de Calendar e Popover
export function DatePicker({
  className,
  onChange,
  value,
  ...props
}: {
  className?: string
  onChange?: (date: Date | undefined) => void
  value?: Date
}) {
  const [date, setDate] = React.useState<Date | undefined>(value);
  
  // Normalmente teríamos um calendário para seleção, mas para simplificar:
  const handleDateClick = () => {
    const today = new Date();
    setDate(today);
    if (onChange) {
      onChange(today);
    }
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Button
        variant={"outline"}
        className={cn(
          "w-[200px] justify-start text-left font-normal",
          !date && "text-muted-foreground"
        )}
        onClick={handleDateClick}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecionar data</span>}
      </Button>
    </div>
  )
} 