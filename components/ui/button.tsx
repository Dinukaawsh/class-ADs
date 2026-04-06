import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--brand-700)] text-white hover:bg-[var(--brand-800)] focus-visible:ring-[var(--brand-500)]",
        secondary:
          "bg-[var(--surface-2)] text-[var(--ink-1)] hover:bg-[var(--surface-3)] focus-visible:ring-[var(--brand-500)]",
        ghost:
          "text-[var(--ink-1)] hover:bg-[var(--surface-2)] focus-visible:ring-[var(--brand-500)]",
        danger:
          "bg-[var(--danger-600)] text-white hover:bg-[var(--danger-700)] focus-visible:ring-[var(--danger-600)]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

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
