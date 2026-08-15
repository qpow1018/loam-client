import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import SummarySection from '@/app/lostark/my-characters/_component/characterSummaryList/SummarySection';

import styles from './engravingSummarySection.module.scss';

export default function EngravingSummarySection(props: {
  engravings: TResLostarkCharacterSummary['engravings'];
}) {
  return (
    <SummarySection title="각인">
      <div className={styles['engraving-grid']}>
        {props.engravings.map((engraving, index) => (
          <span key={`${engraving.name}-${index}`} className={styles['engraving-item']}>
            <span
              className={`${styles['engraving-level']} ${
                engraving.level === 4 ? styles['engraving-level-max'] : ''
              }`}
            >
              {engraving.level ?? 0}
            </span>
            <span className={styles['engraving-name']}>{engraving.name ?? '-'}</span>
          </span>
        ))}
      </div>
    </SummarySection>
  );
}
