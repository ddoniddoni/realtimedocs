"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";
import ReactModal from "react-modal";

import { X } from "lucide-react";
import { AbstractModalProps } from "../../types";

type ModalRef = any;

function CModal(props: AbstractModalProps, ref: React.Ref<ModalRef>) {
  const {
    className,
    open = false,
    title,
    description,
    children,
    footer = null,
    closeOnESC = true,
    closeOverlayClick = false,
    close = true,
    onClose,
  } = props;

  const handleClose = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.stopPropagation();
    onClose?.();
  };

  return (
    <ReactModal
      isOpen={open}
      ariaHideApp={false}
      shouldCloseOnEsc={closeOnESC}
      shouldCloseOnOverlayClick={closeOverlayClick}
      onRequestClose={handleClose}
      closeTimeoutMS={150}
      ref={ref as any}
      portalClassName={clsx("ui-modal", className)}
      overlayClassName={clsx(
        "ReactModal__Overlay fixed inset-0 z-[9999] overflow-y-auto overflow-x-hidden flex items-center justify-center p-[18px]",
        "bg-[rgba(var(--black-rgb),0.7)] backdrop-blur-[4px] backdrop-saturate-[1.5]"
      )}
      className={clsx(
        "ReactModal__Content relative overflow-hidden flex flex-col",
        "mx-auto min-w-[320px] max-w-[780px] h-[400px] p-0 px-5",
        "border-2 border-blue-300 rounded-[15px] bg-background"
      )}
      onAfterClose={() => {
        document.body.classList.remove("ReactModal__Body--open");
        document.body.removeAttribute("aria-hidden");
      }}
    >
      {/* HEADER */}
      <div className="ui-modal-header relative flex justify-center px-[30px] py-[15px]">
        <h2 className="title text-[24px] font-bold text-blue-400 leading-[30px] text-center">
          {title}
        </h2>

        {description && (
          <p className="description text-center text-sm text-white/80 mt-1">
            {description}
          </p>
        )}

        {close && (
          <button
            type="button"
            className="h-[30px] w-[30px] flex items-center justify-center text-neutral-300 hover:text-white"
            onClick={handleClose}
          >
            <X className="size-5" />
          </button>
        )}
      </div>

      {children && (
        <div
          className="ui-modal-contents flex-1 -mx-5 px-5 py-[30px] 
                        tablet-over:overflow-y-auto tablet-over:px-[60px] tablet-over:max-h-[463px] tablet-over:min-h-[130px]"
        >
          {children}
        </div>
      )}

      {footer && (
        <div className="ui-modal-footer flex justify-center gap-5 px-0 pb-[30px] tablet-over:px-[40px]">
          {footer}
        </div>
      )}
    </ReactModal>
  );
}

export const Modal = React.memo(
  forwardRef<ModalRef, AbstractModalProps>(CModal)
);
Modal.displayName = "Modal";
