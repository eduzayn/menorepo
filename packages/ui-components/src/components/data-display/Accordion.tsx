import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

const accordionVariants = cva(
  "flex flex-col gap-2",
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

const accordionItemVariants = cva(
  "rounded-lg border bg-background",
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

const accordionTriggerVariants = cva(
  "flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-all hover:bg-muted [&[data-state=open]>svg]:rotate-180",
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

const accordionContentVariants = cva(
  "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
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

export interface AccordionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionVariants> {
  children: React.ReactNode
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  type?: "single" | "multiple"
  collapsible?: boolean
}

export interface AccordionItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionItemVariants> {
  value: string
  children: React.ReactNode
}

export interface AccordionTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof accordionTriggerVariants> {
  children: React.ReactNode
}

export interface AccordionContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionContentVariants> {
  children: React.ReactNode
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      variant,
      defaultValue,
      value,
      onValueChange,
      type = "single",
      collapsible = false,
      ...props
    },
    ref
  ) => {
    const [openItems, setOpenItems] = React.useState<string[]>(
      defaultValue ? [defaultValue] : []
    )

    const handleValueChange = (itemValue: string) => {
      if (type === "single") {
        setOpenItems(collapsible && openItems[0] === itemValue ? [] : [itemValue])
        onValueChange?.(itemValue)
      } else {
        setOpenItems((prev) => {
          const newValue = prev.includes(itemValue)
            ? prev.filter((v) => v !== itemValue)
            : [...prev, itemValue]
          onValueChange?.(newValue.join(","))
          return newValue
        })
      }
    }

    return (
      <div
        ref={ref}
        className={cn(accordionVariants({ variant }), className)}
        {...props}
      />
    )
  }
)

Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, variant, value, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(accordionItemVariants({ variant }), className)}
        {...props}
      />
    )
  }
)

AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(accordionTriggerVariants({ variant }), className)}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </button>
    )
  }
)

AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(accordionContentVariants({ variant }), className)}
        {...props}
      >
        <div className="px-4 pb-4">{children}</div>
      </div>
    )
  }
)

AccordionContent.displayName = "AccordionContent"

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  accordionContentVariants,
} 