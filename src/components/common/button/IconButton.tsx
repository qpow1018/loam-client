import styles from './iconButton.module.scss';

type TIconButtonSize = 'small' | 'medium' | 'large';

export default function IconButton(props: {
  size?: TIconButtonSize;
  isDisabled?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const {
    size = 'medium',
    isDisabled = false,
    className,
    onClick,
    children,
  } = props;

  return (
    <button
      type="button"
      className={`
        ${styles['icon-btn']}
        ${styles[`size-${size}`]}
        ${className ?? ''}
      `}
      disabled={isDisabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
