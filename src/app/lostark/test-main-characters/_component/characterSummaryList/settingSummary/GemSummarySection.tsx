import type { TResLostarkCharacterSummary } from '@/api/lostark/type';

import styles from './settingSummary.module.scss';

export default function GemSummarySection(props: { gems: TResLostarkCharacterSummary['gems'] }) {
  const gemCounts = getGemCounts(props.gems);

  return (
    <div className={styles['gem-list']}>
      {gemCounts.map((group) => (
        <span key={group.level}>{`${group.level}레벨 ${group.count}개`}</span>
      ))}
      {props.gems.length === 0 && <span className={styles['empty-value']}>-</span>}
    </div>
  );
}

function getGemCounts(gems: TResLostarkCharacterSummary['gems']) {
  return [10, 9, 8, 7]
    .map((level) => ({
      level,
      count:
        level === 7
          ? gems.filter((gem) => (gem.level ?? 0) <= level).length
          : gems.filter((gem) => gem.level === level).length,
    }))
    .filter((group) => group.count > 0);
}
