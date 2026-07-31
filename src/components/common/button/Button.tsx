import type { MouseEventHandler, ReactNode } from 'react';

import styles from './button.module.scss';

type TButtonType = 'button' | 'submit';
export type TButtonColor = 'mint' | 'rose' | 'gray' | 'amber' | 'violet' | 'azure';
type TButtonFill = 'solid' | 'outline';
type TButtonSize = 'small' | 'medium' | 'large';

export default function Button(props: {
  type?: TButtonType;
  color?: TButtonColor;
  fill?: TButtonFill;
  size?: TButtonSize;
  className?: string;
  isFullWidth?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
}) {
  const {
    type = 'button',
    color = 'mint',
    fill = 'solid',
    size = 'medium',
    className,
    isFullWidth = false,
    isLoading = false,
    isDisabled = false,
    onClick,
    children,
  } = props;

  return (
    <button
      type={type}
      className={`${styles['btn']} ${styles[`color-${color}`]} ${styles[`fill-${fill}`]} ${styles[`size-${size}`]} ${isFullWidth ? styles['is-full-width'] : ''} ${isLoading ? styles['is-loading'] : ''} ${className ?? ''}`}
      disabled={isDisabled || isLoading}
      aria-busy={isLoading}
      onClick={onClick}
    >
      <span className={styles['content']}>{children}</span>
      {isLoading && <span className={styles['spinner']} aria-hidden="true" />}
    </button>
  );
}
