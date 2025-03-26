import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

const calendarVariants = cva(
  "flex flex-col gap-2 rounded-lg border bg-background p-4",
  {
    variants: {
      variant: {
        default: "",
        ghost: "border-0 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const calendarHeaderVariants = cva(
  "flex items-center justify-between",
  {
    variants: {
      variant: {
        default: "",
        ghost: "border-0 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const calendarGridVariants = cva(
  "grid grid-cols-7 gap-1",
  {
    variants: {
      variant: {
        default: "",
        ghost: "border-0 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const calendarCellVariants = cva(
  "flex h-9 w-9 items-center justify-center rounded-md text-sm transition-colors hover:bg-muted",
  {
    variants: {
      variant: {
        default: "",
        selected: "bg-primary text-primary-foreground hover:bg-primary/90",
        today: "bg-muted font-medium",
        disabled: "text-muted-foreground/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CalendarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof calendarVariants> {
  value?: Date
  onChange?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  disabled?: boolean
}

const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  (
    {
      className,
      variant,
      value = new Date(),
      onChange,
      minDate,
      maxDate,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [currentMonth, setCurrentMonth] = React.useState(value)

    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate()

    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay()

    const days = Array.from({ length: 42 }, (_, i) => {
      const day = i - firstDayOfMonth + 1
      return day > 0 && day <= daysInMonth ? day : null
    })

    const handlePrevMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
      )
    }

    const handleNextMonth = () => {
      setCurrentMonth(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
      )
    }

    const handleSelect = (day: number) => {
      if (disabled) return

      const selectedDate = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      )

      if (
        (!minDate || selectedDate >= minDate) &&
        (!maxDate || selectedDate <= maxDate)
      ) {
        onChange?.(selectedDate)
      }
    }

    const isToday = (day: number) => {
      const today = new Date()
      return (
        day === today.getDate() &&
        currentMonth.getMonth() === today.getMonth() &&
        currentMonth.getFullYear() === today.getFullYear()
      )
    }

    const isSelected = (day: number) => {
      return (
        day === value.getDate() &&
        currentMonth.getMonth() === value.getMonth() &&
        currentMonth.getFullYear() === value.getFullYear()
      )
    }

    const isDisabled = (day: number) => {
      if (disabled) return true

      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      )

      return (
        (minDate && date < minDate) ||
        (maxDate && date > maxDate)
      )
    }

    return (
      <div
        ref={ref}
        className={cn(calendarVariants({ variant }), className)}
        {...props}
      >
        <div className={cn(calendarHeaderVariants({ variant }))}>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
            onClick={handlePrevMonth}
            disabled={disabled}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="font-medium">
            {currentMonth.toLocaleString("pt-BR", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleNextMonth}
            disabled={disabled}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className={cn(calendarGridVariants({ variant }))}>
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div
              key={day}
              className="flex h-9 items-center justify-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
          {days.map((day, i) => (
            <button
              key={i}
              type="button"
              className={cn(
                calendarCellVariants({
                  variant: day
                    ? isSelected(day)
                      ? "selected"
                      : isToday(day)
                      ? "today"
                      : isDisabled(day)
                      ? "disabled"
                      : "default"
                    : "disabled",
                })
              )}
              onClick={() => day && handleSelect(day)}
              disabled={!day || isDisabled(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
    )
  }
)

Calendar.displayName = "Calendar"

export {
  Calendar,
  calendarVariants,
  calendarHeaderVariants,
  calendarGridVariants,
  calendarCellVariants,
} 