'use client';

import { useMemo, useState } from 'react';

import type { TLevelGoldDifficultyOption, TLevelGoldRaid, TLevelGoldRow } from '../_type/clearGold';
import { CLEAR_GOLD_CATEGORIES } from '../_define/clearGoldContents';
import {
  createLevelGoldDifficultyOptions,
  createLevelGoldRows,
  formatGold,
} from '../_util/clearGold';
import Checkbox from '@/components/common/form/Checkbox';

import styles from './levelGoldPanel.module.scss';

const LEVEL_GOLD_DIFFICULTY_OPTIONS = createLevelGoldDifficultyOptions(CLEAR_GOLD_CATEGORIES);

export default function LevelGoldPanel() {
  const [excludedDifficultyIds, setExcludedDifficultyIds] = useState<string[]>([]);
  const [isExcludeListOpen, setIsExcludeListOpen] = useState(false);
  const levelGoldRows = useMemo(
    () =>
      createLevelGoldRows(CLEAR_GOLD_CATEGORIES, {
        excludedDifficultyIds,
      }),
    [excludedDifficultyIds],
  );
  const excludedDifficultyOptions = useMemo(
    () =>
      LEVEL_GOLD_DIFFICULTY_OPTIONS.filter((option) =>
        excludedDifficultyIds.includes(option.difficultyId),
      ),
    [excludedDifficultyIds],
  );

  function handleToggleExcludeList() {
    setIsExcludeListOpen((currentValue) => !currentValue);
  }

  function handleToggleDifficulty(difficultyId: string) {
    setExcludedDifficultyIds((currentIds) => {
      if (currentIds.includes(difficultyId)) {
        return currentIds.filter((currentId) => currentId !== difficultyId);
      }

      return [...currentIds, difficultyId];
    });
  }

  function handleClearExcludedDifficulties() {
    setExcludedDifficultyIds([]);
  }

  return (
    <section className={styles['level-gold-panel']}>
      <section className={styles['exclude-panel']} aria-label="제외할 레이드 난이도 선택">
        <div className={styles['exclude-header']}>
          <div>
            <h3>제외 레이드</h3>
            <p>
              {excludedDifficultyIds.length === 0
                ? '제외 없음'
                : `${excludedDifficultyIds.length}개 제외됨`}
            </p>
          </div>
          <div className={styles['exclude-actions']}>
            <button
              type="button"
              className={styles['select-button']}
              aria-expanded={isExcludeListOpen}
              onClick={handleToggleExcludeList}
            >
              {isExcludeListOpen ? '닫기' : '선택'}
            </button>
            <button
              type="button"
              className={styles['clear-button']}
              disabled={excludedDifficultyIds.length === 0}
              onClick={handleClearExcludedDifficulties}
            >
              전체 해제
            </button>
          </div>
        </div>

        {excludedDifficultyOptions.length > 0 && (
          <div className={styles['excluded-chip-list']} aria-label="제외된 레이드 난이도">
            {excludedDifficultyOptions.map((option) => (
              <span className={styles['excluded-chip']} key={option.difficultyId}>
                {option.contentName} {option.difficultyName}
              </span>
            ))}
          </div>
        )}

        {isExcludeListOpen && (
          <div className={styles['exclude-list']}>
            {LEVEL_GOLD_DIFFICULTY_OPTIONS.map((option) => (
              <DifficultyExcludeOption
                isChecked={excludedDifficultyIds.includes(option.difficultyId)}
                key={option.difficultyId}
                option={option}
                onToggle={handleToggleDifficulty}
              />
            ))}
          </div>
        )}
      </section>

      <div className={styles['level-card-list']}>
        {levelGoldRows.map((row) => (
          <LevelGoldCard key={row.level} row={row} />
        ))}
      </div>
    </section>
  );
}

function DifficultyExcludeOption(props: {
  isChecked: boolean;
  option: TLevelGoldDifficultyOption;
  onToggle: (difficultyId: string) => void;
}) {
  function handleChange() {
    props.onToggle(props.option.difficultyId);
  }

  return (
    <Checkbox
      isChecked={props.isChecked}
      onChange={handleChange}
      size="small"
      className={`${styles['exclude-option']} ${props.isChecked ? styles['is-selected'] : ''}`}
      label={
        <>
          <span className={styles['option-name']}>
            {props.option.contentName} {props.option.difficultyName}
          </span>
          <span className={styles['option-level']}>Lv. {props.option.entryItemLevel}</span>
        </>
      }
    />
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
