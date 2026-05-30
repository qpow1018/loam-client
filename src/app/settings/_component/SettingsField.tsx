import type { ReactNode } from 'react';

import styles from '@/app/settings/_component/settingsField.module.scss';

export default function SettingsField(props: {
  label: string;
  value?: ReactNode;
  isPath?: boolean;
  children?: ReactNode;
}) {
  const { label, value, isPath = false, children } = props;

  return (
    <div className={styles['setting-field']}>
      <span className={styles['field-label']}>{label}</span>
      {value !== undefined && (
        <span className={`${styles['field-value']} ${isPath ? styles['is-path'] : ''}`}>
          {value}
        </span>
      )}
      {children !== undefined && <div className={styles['field-actions']}>{children}</div>}
    </div>
  );
}
