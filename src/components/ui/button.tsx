import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-mono font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(120_100%_50%_/_0.5)]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-ghost-border bg-transparent text-primary shadow-sm hover:bg-ghost-surface hover:shadow-[0_0_15px_hsl(120_100%_50%_/_0.3)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "text-primary hover:bg-ghost-surface hover:text-primary",
        link:
          "text-primary underline-offset-4 hover:underline",
        terminal:
          "bg-ghost-darker border border-ghost-border text-primary font-mono hover:bg-ghost-surface hover:shadow-[0_0_20px_hsl(120_100%_50%_/_0.4)] active:scale-95",
        haunt:
          "bg-primary text-primary-foreground font-bold uppercase tracking-wider hover:shadow-[0_0_30px_hsl(120_100%_50%_/_0.6)]",
        danger:
          "bg-transparent border border-destructive text-destructive hover:bg-destructive/10",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-sm",
        sm: "h-8 rounded-sm px-3 text-xs",
        lg: "h-10 rounded-sm px-8",
        xl: "h-12 rounded-sm px-10 text-base",
        icon: "h-9 w-9 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
