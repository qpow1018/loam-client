import type { ReactNode } from 'react';

import styles from './summaryCharacterRow.module.scss';

export default function SummaryCharacterRow(props: {
  name: string;
  className: string;
  children?: ReactNode;
}) {
  const rowClassName = [styles['character-row'], props.className].filter(Boolean).join(' ');

  return (
    <div className={rowClassName}>
      <div className={styles['character-name']}>{props.name}</div>

      {props.children}
    </div>
  );
}
