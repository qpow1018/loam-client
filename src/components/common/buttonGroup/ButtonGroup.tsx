'use client';

import styles from './buttonGroup.module.scss';

export default function ButtonGroup<T extends string>(props: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (next: T) => void;
  isDisabled?: boolean;
}) {
  const { options, value, onChange, isDisabled = false } = props;

  return (
    <div className={styles['button-group']}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`${styles['option']} ${
            value === option.value ? styles['option-selected'] : ''
          }`}
          disabled={isDisabled}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
