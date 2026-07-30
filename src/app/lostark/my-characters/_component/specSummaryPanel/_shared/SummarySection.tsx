import type { ReactNode } from 'react';

import styles from './summarySection.module.scss';

type TSummaryLegendTier = 'high' | 'middle' | 'low';

type TSummaryLegendItem = {
  label: string;
} & ({ tier: TSummaryLegendTier; color?: never } | { color: string; tier?: never });

export default function SummarySection(props: {
  title: string;
  className?: string;
  legendItems?: TSummaryLegendItem[];
  legend?: ReactNode;
  children: ReactNode;
}) {
  const sectionClassName = props.className
    ? `${styles['summary-section']} ${props.className}`
    : styles['summary-section'];

  return (
    <section className={sectionClassName}>
      <div className={styles['section-header']}>
        <h2 className={styles['section-title']}>{props.title}</h2>
        {props.legendItems ? <SummaryLegend items={props.legendItems} /> : props.legend}
      </div>

      {props.children}
    </section>
  );
}

function SummaryLegend(props: { items: TSummaryLegendItem[] }) {
  return (
    <div className={styles['section-legend']}>
      {props.items.map((item) => (
        <span key={item.label} className={styles['legend-item']}>
          <span
            className={
              item.tier ? `${styles['legend-dot']} ${styles[item.tier]}` : styles['legend-dot']
            }
            style={item.color ? { backgroundColor: item.color } : undefined}
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}
