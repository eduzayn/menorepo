import * as React from "react"
import { Button, type ButtonProps } from "./button"

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon: React.ReactNode
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size="icon"
        className={className}
        {...props}
      >
        {icon}
      </Button>
    )
  }
)
IconButton.displayName = "IconButton" 