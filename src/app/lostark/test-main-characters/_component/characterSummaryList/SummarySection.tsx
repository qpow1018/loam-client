import type { ReactNode } from 'react';

import styles from './summarySection.module.scss';

export default function SummarySection(props: { title: string; children: ReactNode }) {
  return (
    <section className={styles['summary-section']}>
      <h2>{props.title}</h2>
      {props.children}
    </section>
  );
}
