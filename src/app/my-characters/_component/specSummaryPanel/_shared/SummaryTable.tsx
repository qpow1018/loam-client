import type { ReactNode } from 'react';

import styles from './summaryTable.module.scss';

export default function SummaryTable(props: {
  columns: {
    key: string;
    label: ReactNode;
  }[];
  gridClassName?: string;
  children: ReactNode;
}) {
  return (
    <div className={styles['summary-table']}>
      <div className={`${styles['head-grid']} ${props.gridClassName}`}>
        <div className={styles['head-cell']}>캐릭터</div>

        {props.columns.map((column) => (
          <div key={column.key} className={styles['head-cell']}>
            {column.label}
          </div>
        ))}
      </div>

      {props.children}
    </div>
  );
}
