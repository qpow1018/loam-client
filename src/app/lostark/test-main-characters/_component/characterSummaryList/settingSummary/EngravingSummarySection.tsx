import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import styles from './settingSummary.module.scss';

export default function EngravingSummarySection(props: {
  engravings: TResLostarkCharacterSummary['engravings'];
}) {
  return (
    <div className={styles['engraving-list']}>
      {props.engravings.map((engraving, index) => (
        <span
          key={`${engraving.name}-${index}`}
          className={`${styles['engraving']} ${
            engraving.level === 4 ? styles['engraving-max-level'] : ''
          }`}
        >
          <span className={styles['engraving-level']}>{engraving.level ?? 0}</span>
          <span className={styles['engraving-name']}>{engraving.name ?? '-'}</span>
        </span>
      ))}
      {props.engravings.length === 0 && <span className={styles['empty-value']}>-</span>}
    </div>
  );
}
