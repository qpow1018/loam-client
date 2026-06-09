import type { ReactNode } from 'react';

import styles from './summaryTable.module.scss';

type TSummaryTableColumn = {
  key: string;
  label: ReactNode;
};

export default function SummaryTable(props: {
  columns: TSummaryTableColumn[];
  className: string;
  headCellClassName: string;
  children: ReactNode;
}) {
  return (
    <div className={`${styles['summary-table']} ${props.className}`}>
      {props.columns.map((column) => (
        <div key={column.key} className={`${styles['head-cell']} ${props.headCellClassName}`}>
          {column.label}
        </div>
      ))}

      {props.children}
    </div>
  );
}
