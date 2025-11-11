import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-display font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all duration-200" +
  " hover-elevate active-elevate-2 shadow-md hover:shadow-xl active:shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary via-primary to-purple-600 text-primary-foreground border-2 border-primary/30 hover:scale-105 active:scale-95",
        destructive:
          "bg-destructive text-destructive-foreground border-2 border-destructive/30 hover:scale-105 active:scale-95",
        outline:
          "border-2 border-primary/40 bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:border-primary shadow-sm",
        secondary: "border-2 bg-gradient-to-r from-secondary to-pink-200 text-secondary-foreground border-secondary/30 hover:scale-105 active:scale-95",
        ghost: "border border-transparent hover:bg-accent/20",
        magical: "bg-gradient-to-r from-purple-500 via-pink-500 to-accent text-white border-2 border-white/30 shadow-lg hover:shadow-2xl hover:scale-110 active:scale-95 magical-glow",
      },
      size: {
        default: "min-h-10 px-5 py-2.5 text-sm",
        sm: "min-h-8 px-4 text-xs",
        lg: "min-h-14 px-10 text-lg font-bold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
