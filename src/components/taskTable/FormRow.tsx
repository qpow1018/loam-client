import type { ReactNode } from 'react';

import styles from './formRow.module.scss';

export default function FormRow(props: { label: string; children: ReactNode }) {
  const { label, children } = props;

  return (
    <div className={styles['form-row']}>
      <span className={styles['form-row-label']}>{label}</span>
      <div className={styles['form-row-content']}>{children}</div>
    </div>
  );
}
