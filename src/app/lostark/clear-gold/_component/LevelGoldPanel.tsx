'use client';

import { useMemo, useState } from 'react';

import { CLEAR_GOLD_CATEGORIES } from '@/app/lostark/clear-gold/_define/clearGoldContents';
import type {
  TLevelGoldRaid,
  TLevelGoldRaidGroup,
  TLevelGoldRow,
} from '@/app/lostark/clear-gold/_type/clearGold';
import { createLevelGoldRows, formatGold } from '@/app/lostark/clear-gold/_util/clearGold';
import Button from '@/components/common/button/Button';

import styles from './levelGoldPanel.module.scss';

type TLevelGoldStrategyTone = 'tradable' | 'total';

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
      <section className={styles['recommendation-filter']} aria-label="비선호 레이드 설정">
        <div className={styles['filter-summary']}>
          <h3
            className={`${styles['filter-status']} ${
              isIncludingNonPreferred ? styles['is-including'] : styles['is-default']
            }`}
          >
            {isIncludingNonPreferred ? '비선호 포함 추천' : '기본 추천'}
          </h3>
          <p>벨가르딘·세르카 나이트메어</p>
        </div>
        <Button
          color="gray"
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
  return (
    <article className={styles['level-card']}>
      <div className={styles['level-rail']}>
        <strong>{props.row.level}</strong>
      </div>

      <div className={styles['strategy-list']}>
        <LevelGoldStrategy group={props.row.withoutBound} label="일반 골드 위주" tone="tradable" />
        <LevelGoldStrategy group={props.row.withBound} label="총 골드 위주" tone="total" />
      </div>
    </article>
  );
}

function LevelGoldStrategy(props: {
  group: TLevelGoldRaidGroup;
  label: string;
  tone: TLevelGoldStrategyTone;
}) {
  const summary = createStrategyGoldSummary(props.group.raids);

  return (
    <section className={`${styles['strategy-panel']} ${styles[`tone-${props.tone}`]}`}>
      <header className={styles['strategy-header']}>
        <div>
          <span>{props.label}</span>
          <strong>{formatGold(props.group.totalGold)} G</strong>
        </div>
        <p className={styles['gold-breakdown']}>
          <span>
            일반 <em>{formatGold(summary.tradableGold)}</em>
          </span>
          <span>
            귀속 <em>{formatGold(summary.boundGold)}</em>
          </span>
        </p>
      </header>

      <ol className={styles['raid-list']}>
        {props.group.raids.map((raid) => (
          <li key={raid.difficultyId}>
            <span className={styles['raid-meta']}>
              <span className={styles['raid-level']}>{raid.entryItemLevel}</span>
              <span className={styles['difficulty-chip']}>{raid.difficultyName}</span>
            </span>
            <span className={styles['raid-name']}>{raid.contentName}</span>
            <span className={styles['raid-gold']}>{formatGold(raid.totalGold)}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function createStrategyGoldSummary(raids: readonly TLevelGoldRaid[]) {
  return raids.reduce(
    (summary, raid) => ({
      tradableGold: summary.tradableGold + raid.tradableGold,
      boundGold: summary.boundGold + raid.boundGold,
    }),
    {
      tradableGold: 0,
      boundGold: 0,
    },
  );
}
