import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const floatingButtonVariants = cva(
  "fixed flex items-center justify-center rounded-full shadow-lg transition-all cursor-pointer select-none outline-none disabled:pointer-events-none disabled:opacity-50 " +
    "focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
        secondary:
          "bg-gray-600 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600",
        outline:
          "border border-blue-600 text-blue-600 bg-white hover:bg-blue-50 " +
          "dark:border-blue-400 dark:text-blue-300 dark:bg-transparent dark:hover:bg-blue-400/10",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
      },

      size: {
        sm: "size-10 text-sm",
        md: "size-12 text-base",
        lg: "size-14 text-lg",
      },

      position: {
        "bottom-right": "bottom-6 right-6",
        "bottom-left": "bottom-6 left-6",
        "top-right": "top-6 right-6",
        "top-left": "top-6 left-6",
      },

      // Slot 사용 시 대응
      asChild: {
        true: "p-0",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "md",
      position: "bottom-right",
    },
  }
);

export interface FloatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof floatingButtonVariants> {
  asChild?: boolean;
}

const FloatingButton = React.forwardRef<HTMLButtonElement, FloatingButtonProps>(
  ({ className, variant, size, position, asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          floatingButtonVariants({ variant, size, position }),
          className
        )}
        {...props}
      />
    );
  }
);

FloatingButton.displayName = "FloatingButton";

export { FloatingButton };
