import type { ReactNode } from 'react';

import styles from './itemTooltip.module.scss';

export function ItemTooltipTrigger(props: { className?: string; children: ReactNode }) {
  const { className, children } = props;

  return (
    <div className={`${styles['item-tooltip-trigger']} ${className ?? ''}`}>{children}</div>
  );
}

export function ItemTooltip(props: { children: ReactNode }) {
  const { children } = props;

  return (
    <div className={styles['item-tooltip']} role="tooltip">
      {children}
    </div>
  );
}
