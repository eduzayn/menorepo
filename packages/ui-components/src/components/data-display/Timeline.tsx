import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Circle } from "lucide-react"

const timelineVariants = cva(
  "flex flex-col gap-4",
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

const timelineItemVariants = cva(
  "flex gap-4",
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

const timelineDotVariants = cva(
  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
  {
    variants: {
      variant: {
        default: "border-primary bg-background",
        success: "border-success bg-success",
        warning: "border-warning bg-warning",
        error: "border-destructive bg-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const timelineLineVariants = cva(
  "w-px bg-border",
  {
    variants: {
      variant: {
        default: "",
        success: "bg-success",
        warning: "bg-warning",
        error: "bg-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const timelineContentVariants = cva(
  "flex flex-col gap-1",
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

export interface TimelineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineVariants> {
  children: React.ReactNode
}

export interface TimelineItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineItemVariants> {
  children: React.ReactNode
  dot?: React.ReactNode
  line?: boolean
}

export interface TimelineDotProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineDotVariants> {}

export interface TimelineContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineContentVariants> {
  children: React.ReactNode
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(timelineVariants({ variant }), className)}
        {...props}
      />
    )
  }
)

Timeline.displayName = "Timeline"

const TimelineItem = React.forwardRef<HTMLDivElement, TimelineItemProps>(
  ({ className, variant, dot, line = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(timelineItemVariants({ variant }), className)}
        {...props}
      >
        <div className="flex flex-col items-center">
          {dot || <TimelineDot />}
          {line && <div className="h-full w-px bg-border" />}
        </div>
        <div className="flex-1">{children}</div>
      </div>
    )
  }
)

TimelineItem.displayName = "TimelineItem"

const TimelineDot = React.forwardRef<HTMLDivElement, TimelineDotProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(timelineDotVariants({ variant }), className)}
        {...props}
      >
        <Circle className="h-2 w-2" />
      </div>
    )
  }
)

TimelineDot.displayName = "TimelineDot"

const TimelineContent = React.forwardRef<HTMLDivElement, TimelineContentProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(timelineContentVariants({ variant }), className)}
        {...props}
      />
    )
  }
)

TimelineContent.displayName = "TimelineContent"

export {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineContent,
  timelineVariants,
  timelineItemVariants,
  timelineDotVariants,
  timelineLineVariants,
  timelineContentVariants,
} 