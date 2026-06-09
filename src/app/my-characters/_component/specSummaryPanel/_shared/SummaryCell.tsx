import type { ReactNode } from 'react';

import styles from './summaryCell.module.scss';

export default function SummaryCell(props: { className?: string; children: ReactNode }) {
  const cellClassName = [styles['summary-cell'], props.className].filter(Boolean).join(' ');

  return <div className={cellClassName}>{props.children}</div>;
}
