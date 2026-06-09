import type { ReactNode } from 'react';

import styles from './cellValueChip.module.scss';

type TCellValueGrade = 'perfect' | 'high' | 'middle' | 'low' | 'none';

export default function CellValueChip(props: {
  grade?: TCellValueGrade;
  className?: string;
  children?: ReactNode;
}) {
  const { grade = 'none', className, children } = props;
  const chipClassName = [styles['cell-value-chip'], styles[grade], className]
    .filter(Boolean)
    .join(' ');

  return <div className={chipClassName}>{children ?? '-'}</div>;
}
