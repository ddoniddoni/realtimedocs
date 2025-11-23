export type UIControlProps = {
  /** display block(flex) */
  block?: boolean;

  /** 추가 classname */
  className?: string;

  /** 추가 style */
  style?: React.CSSProperties;
};

export interface IOption {
  label: string | React.ReactNode;
  value: string | number;
  disabled?: boolean;
}

export type AbstractModalProps = {
  /** open 여부 */
  open?: boolean;

  /** 제목 */
  title?: string | React.ReactNode;

  /** 설명 */
  description?: string | React.JSX.Element;

  /** 본문 컨텐츠 */
  children?: React.ReactNode;

  /** 푸터 컨텐츠 */
  footer?: React.ReactNode;

  /** ESC Close */
  closeOnESC?: boolean;

  /** Overlay Click Close */
  closeOverlayClick?: boolean;

  /** 닫기 버튼 여부 */
  close?: boolean;

  /** 닫기 버튼 callback */
  onClose?: () => void;
} & UIControlProps;

export type ModalContainerProps = {
  open?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onChange?: () => void;
} & AbstractModalProps;
