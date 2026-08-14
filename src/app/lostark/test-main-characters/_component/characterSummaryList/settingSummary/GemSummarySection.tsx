import type { ReactNode } from 'react';

import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import SummarySection from '@/app/lostark/test-main-characters/_component/characterSummaryList/SummarySection';

import styles from './gemSummarySection.module.scss';

export default function GemSummarySection(props: { gems: TResLostarkCharacterSummary['gems'] }) {
  const gemCounts = getGemCounts(props.gems);

  return (
    <SummarySection title="보석">
      <div className={styles['gem-table']}>
        <GemTableRow label="레벨">
          {gemCounts.map((group) => (
            <span key={group.level} className={styles['gem-table-cell']}>
              {group.label}
            </span>
          ))}
        </GemTableRow>

        <GemTableRow label="개수">
          {gemCounts.map((group) => (
            <span key={group.level} className={styles['gem-table-cell']}>
              {group.count > 0 ? `${group.count}개` : '-'}
            </span>
          ))}
        </GemTableRow>
      </div>
    </SummarySection>
  );
}

function GemTableRow(props: { label: string; children: ReactNode }) {
  return (
    <div className={styles['gem-table-row']}>
      <span className={`${styles['gem-table-cell']} ${styles['gem-row-label']}`}>
        {props.label}
      </span>
      {props.children}
    </div>
  );
}

function getGemCounts(gems: TResLostarkCharacterSummary['gems']) {
  return [
    { level: 10, label: '10레벨' },
    { level: 9, label: '9레벨' },
    { level: 8, label: '8레벨' },
    { level: 7, label: '7레벨 이하' },
  ].map(({ level, label }) => ({
    label,
    level,
    count:
      level === 7
        ? gems.filter((gem) => (gem.level ?? 0) <= level).length
        : gems.filter((gem) => gem.level === level).length,
  }));
}
