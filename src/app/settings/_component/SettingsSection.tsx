import type { ReactNode } from 'react';

import styles from '@/app/settings/_component/settingsSection.module.scss';

export default function SettingsSection(props: {
  id?: string;
  title: string;
  description: string;
  status?: string;
  actions?: ReactNode;
  children?: ReactNode;
  variant?: 'default' | 'primary';
}) {
  const { id, title, description, status, actions, children, variant = 'default' } = props;

  return (
    <section
      id={id}
      className={`${styles['settings-section']} ${variant === 'primary' ? styles['is-primary'] : ''}`}
    >
      <div className={styles['section-header']}>
        <div className={styles['title-group']}>
          <h2>{title}</h2>
          <p>{description}</p>
          {status !== undefined && <p className={styles['section-status']}>{status}</p>}
        </div>
        {actions !== undefined && <div className={styles['section-actions']}>{actions}</div>}
      </div>

      {children !== undefined && <div className={styles['section-body']}>{children}</div>}
    </section>
  );
}
