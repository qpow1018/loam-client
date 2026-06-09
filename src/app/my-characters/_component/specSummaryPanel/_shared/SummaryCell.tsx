import type { ReactNode } from 'react';

import styles from './summaryCell.module.scss';

export default function SummaryCell(props: {
  className: string;
  children: ReactNode;
}) {
  return (
    <div className={`${styles['summary-cell']} ${props.className}`}>
      {props.children}
    </div>
  );
}
