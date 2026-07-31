'use client';

import { useMemo, useState } from 'react';

import { CLEAR_GOLD_CATEGORIES } from '@/app/lostark/clear-gold/_define/clearGoldContents';
import type { TLevelGoldRaid, TLevelGoldRow } from '@/app/lostark/clear-gold/_type/clearGold';
import { createLevelGoldRows, formatGold } from '@/app/lostark/clear-gold/_util/clearGold';
import Button from '@/components/common/button/Button';

import styles from './levelGoldPanel.module.scss';

export default function LevelGoldPanel() {
  const [isIncludingNonPreferred, setIsIncludingNonPreferred] = useState(false);
  const levelGoldRows = useMemo(
    () =>
      createLevelGoldRows(CLEAR_GOLD_CATEGORIES, {
        includeNonPreferred: isIncludingNonPreferred,
      }),
    [isIncludingNonPreferred],
  );

  function handleToggleNonPreferred() {
    setIsIncludingNonPreferred((currentValue) => !currentValue);
  }

  return (
    <section className={styles['level-gold-panel']}>
      <section className={styles['recommendation-filter']} aria-label="레이드 추천 조건">
        <div>
          <h3>레이드 추천 조건</h3>
          <p>
            {isIncludingNonPreferred
              ? '비선호 레이드를 포함한 결과입니다.'
              : '세르카·벨가르딘 나이트메어는 기본 결과에서 제외됩니다.'}
          </p>
        </div>
        <Button
          color={isIncludingNonPreferred ? 'rose' : 'gray'}
          fill={isIncludingNonPreferred ? 'solid' : 'outline'}
          size="small"
          onClick={handleToggleNonPreferred}
        >
          {isIncludingNonPreferred ? '비선호 제외' : '비선호 포함'}
        </Button>
      </section>

      <div className={styles['level-card-list']}>
        {levelGoldRows.map((row) => (
          <LevelGoldCard key={row.level} row={row} />
        ))}
      </div>
    </section>
  );
}

function LevelGoldCard(props: { row: TLevelGoldRow }) {
  const comparedRaids = createComparedRaidRows(props.row);
  const tradableFirstSummary = createStrategyGoldSummary(props.row.withoutBound.raids);
  const totalFirstSummary = createStrategyGoldSummary(props.row.withBound.raids);

  return (
    <article className={styles['level-card']}>
      <div className={styles['level-rail']}>
        <strong>{props.row.level}</strong>
      </div>

      <div className={styles['card-main']}>
        <ol className={styles['raid-list']}>
          {comparedRaids.map((raid) => (
            <li className={styles[raid.type]} key={`${raid.type}-${raid.difficultyId}`}>
              <span className={styles['raid-meta']}>
                <span className={styles['raid-level']}>{raid.entryItemLevel}</span>
                <span className={styles['difficulty-chip']}>{raid.difficultyName}</span>
              </span>
              <span className={styles['raid-name']}>{raid.contentName}</span>
              <span className={styles['raid-gold']}>{raid.goldLabel}</span>
            </li>
          ))}
        </ol>
      </div>

      <aside className={styles['card-summary']}>
        <div className={styles['tradable-summary']}>
          <span>일반 골드 위주</span>
          <strong>{formatGold(tradableFirstSummary.totalGold)}</strong>
          <small>
            일반 {formatGold(tradableFirstSummary.tradableGold)} / 귀속{' '}
            {formatGold(tradableFirstSummary.boundGold)}
          </small>
        </div>
        <div className={styles['bound-summary']}>
          <span>총 골드 위주</span>
          <strong>{formatGold(totalFirstSummary.totalGold)}</strong>
          <small>
            일반 {formatGold(totalFirstSummary.tradableGold)} / 귀속{' '}
            {formatGold(totalFirstSummary.boundGold)}
          </small>
        </div>
      </aside>
    </article>
  );
}

type TComparedRaidRow = {
  difficultyId: string;
  contentName: string;
  difficultyName: string;
  entryItemLevel: number;
  goldLabel: string;
  rank: number;
  sortOrder: number;
  type: 'common-raid' | 'tradable-only-raid' | 'bound-only-raid';
};

function createComparedRaidRows(row: TLevelGoldRow): TComparedRaidRow[] {
  const withoutBoundRows = row.withoutBound.raids.map((raid, index) =>
    createComparedRaidRow(raid, {
      gold: raid.totalGold,
      rank: index + 1,
      sortOrder: 1,
      type: 'tradable-only-raid',
    }),
  );
  const withBoundRows = row.withBound.raids.map((raid, index) =>
    createComparedRaidRow(raid, {
      gold: raid.totalGold,
      rank: index + 1,
      sortOrder: 2,
      type: 'bound-only-raid',
    }),
  );
  const rowMap = new Map<string, TComparedRaidRow>();

  withoutBoundRows.forEach((raid) => {
    rowMap.set(raid.difficultyId, raid);
  });

  withBoundRows.forEach((raid) => {
    const existingRaid = rowMap.get(raid.difficultyId);

    if (!existingRaid) {
      rowMap.set(raid.difficultyId, raid);
      return;
    }

    rowMap.set(raid.difficultyId, {
      ...existingRaid,
      goldLabel: raid.goldLabel,
      sortOrder: 0,
      type: 'common-raid',
    });
  });

  return Array.from(rowMap.values()).sort((a, b) => {
    const sortDifference = a.sortOrder - b.sortOrder;

    if (sortDifference !== 0) {
      return sortDifference;
    }

    return a.rank - b.rank;
  });
}

function createComparedRaidRow(
  raid: TLevelGoldRaid,
  meta: Pick<TComparedRaidRow, 'rank' | 'sortOrder' | 'type'> & {
    gold: number;
  },
): TComparedRaidRow {
  return {
    difficultyId: raid.difficultyId,
    contentName: raid.contentName,
    difficultyName: raid.difficultyName,
    entryItemLevel: raid.entryItemLevel,
    goldLabel: formatGold(meta.gold),
    rank: meta.rank,
    sortOrder: meta.sortOrder,
    type: meta.type,
  };
}

function createStrategyGoldSummary(raids: readonly TLevelGoldRaid[]) {
  return raids.reduce(
    (summary, raid) => ({
      tradableGold: summary.tradableGold + raid.tradableGold,
      boundGold: summary.boundGold + raid.boundGold,
      totalGold: summary.totalGold + raid.totalGold,
    }),
    {
      tradableGold: 0,
      boundGold: 0,
      totalGold: 0,
    },
  );
}
