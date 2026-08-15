import type { TLostarkCharacterStat } from '@/api/lostark/type';

import DetailPanel from './DetailPanel';

import styles from './combatStatSection.module.scss';

const COMBAT_STAT_TYPES = ['치명', '특화', '신속', '제압', '인내', '숙련'];

export default function CombatStatSection(props: {
  stats: TLostarkCharacterStat[];
}) {
  const { stats } = props;
  const combatStats = getStatsByType(stats, COMBAT_STAT_TYPES);
  const statRankByType = getStatRankByType(combatStats);

  return (
    <DetailPanel title="특성" className={styles['combat-stat-section']}>
      <div className={styles['combat-stat-list']}>
        {combatStats.map((stat) => (
          <div
            key={stat.type}
            className={`${styles['combat-stat']} ${getStatRankClassName(stat, statRankByType)}`}
            title={stat.tooltip ?? ''}
          >
            <span className={styles['stat-type']}>{stat.type ?? '-'}</span>
            <span className={styles['stat-value']}>{stat.value ?? '-'}</span>
          </div>
        ))}
      </div>
    </DetailPanel>
  );
}

function getStatsByType(stats: TLostarkCharacterStat[], types: string[]) {
  return types
    .map((type) => stats.find((stat) => stat.type === type))
    .filter((stat): stat is TLostarkCharacterStat => stat !== undefined);
}

function getStatRankByType(stats: TLostarkCharacterStat[]) {
  return new Map(
    [...stats]
      .sort((left, right) => getStatValue(right.value) - getStatValue(left.value))
      .map((stat, index) => [stat.type, index]),
  );
}

function getStatRankClassName(
  stat: TLostarkCharacterStat,
  statRankByType: Map<string | null, number>,
) {
  const rank = statRankByType.get(stat.type);

  if (rank === 0) return styles['highest'];
  if (rank === 1) return styles['second-highest'];

  return '';
}

function getStatValue(value: string | null) {
  return Number(value?.replace(/[^\d.-]/g, '') ?? 0);
}
