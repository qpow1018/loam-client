import styles from './button.module.scss';

type TButtonTheme = 'bg-pri' | 'bg-sec' | 'bg-gray600' | 'bd-gray';

type TButtonSize = 'small' | 'medium' | 'large';

export default function Button(props: {
  theme: TButtonTheme;
  size?: TButtonSize;
  isFullWidth?: boolean;
  isRound?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  const {
    theme,
    size = 'medium',
    isFullWidth = false,
    isRound = false,
    isLoading = false,
    isDisabled = false,
    className,
    onClick,
    children,
  } = props;

  return (
    <button
      type="button"
      className={`
        ${styles['btn']}
        ${styles[`theme-${theme}`]}
        ${styles[`size-${size}`]}
        ${isRound ? styles['is-round'] : ''}
        ${isFullWidth ? styles['is-full-width'] : ''}
        ${isLoading ? styles['is-loading'] : ''}
        ${className ?? ''}
      `}
      disabled={isDisabled || isLoading}
      onClick={onClick}
    >
      {children}
      {isLoading && <span className={styles['spinner']} aria-hidden="true" />}
    </button>
  );
}
