import { cva } from "class-variance-authority";

export const modalContainerVariants = cva(
  "ui-modal fixed inset-0 flex items-center justify-center transition-opacity duration-150",
  {
    variants: {
      overlay: {
        default: "bg-black/50 backdrop-blur-sm",
        light: "bg-black/30",
        none: "bg-transparent",
      },
      size: {
        sm: "w-[360px]",
        md: "w-[480px]",
        lg: "w-[640px]",
      },
      radius: {
        sm: "rounded-md",
        md: "rounded-lg",
        lg: "rounded-xl",
      },
    },
    defaultVariants: {
      overlay: "default",
      size: "md",
      radius: "md",
    },
  }
);

export const modalPanelClasses =
  "bg-white dark:bg-neutral-900 shadow-xl p-6 transition-transform duration-150";
