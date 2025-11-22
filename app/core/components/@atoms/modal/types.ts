import React from "react";
import { VariantProps } from "class-variance-authority";
import { modalContainerVariants } from "./modal.styles";

export interface ModalProps
  extends React.ComponentPropsWithRef<"div">,
    VariantProps<typeof modalContainerVariants> {
  open: boolean;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  closeOnESC?: boolean;
  closeOverlayClick?: boolean;
  close?: boolean;
  onClose?: () => void;
}
