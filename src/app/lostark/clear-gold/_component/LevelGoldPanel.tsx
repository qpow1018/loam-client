'use client';

import { useMemo, useState } from 'react';

import type {
  TLevelGoldDifficultyOption,
  TLevelGoldRaid,
  TLevelGoldRaidGroup,
} from '../_type/clearGold';
import { CLEAR_GOLD_CATEGORIES } from '../_define/clearGoldContents';
import {
  createLevelGoldDifficultyOptions,
  createLevelGoldRows,
  formatGold,
} from '../_util/clearGold';

import styles from './levelGoldPanel.module.scss';

const LEVEL_GOLD_DIFFICULTY_OPTIONS = createLevelGoldDifficultyOptions(CLEAR_GOLD_CATEGORIES);

export default function LevelGoldPanel() {
  const [excludedDifficultyIds, setExcludedDifficultyIds] = useState<string[]>([]);
  const levelGoldRows = useMemo(
    () =>
      createLevelGoldRows(CLEAR_GOLD_CATEGORIES, {
        excludedDifficultyIds,
      }),
    [excludedDifficultyIds],
  );

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
      <div className={styles['panel-header']}>
        <h2>레벨별 최대 골드</h2>
        <span>상위 3개 레이드 기준</span>
      </div>

      <section className={styles['exclude-panel']} aria-label="제외할 레이드 난이도 선택">
        <div className={styles['exclude-header']}>
          <div>
            <h3>제외 레이드</h3>
            <p>선택한 난이도는 최대 골드 계산에서 제외됩니다.</p>
          </div>
          <button
            type="button"
            className={styles['clear-button']}
            disabled={excludedDifficultyIds.length === 0}
            onClick={handleClearExcludedDifficulties}
          >
            전체 해제
          </button>
        </div>

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
      </section>

      <div className={styles['table-region']}>
        <table className={styles['level-gold-table']}>
          <caption className={styles['caption']}>
            실제 레이드 입장 레벨별 귀속 포함 및 귀속 제외 최대 골드
          </caption>
          <colgroup>
            <col className={styles['level-column']} />
            <col className={styles['gold-column']} />
            <col />
            <col className={styles['gold-column']} />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th scope="col">레벨</th>
              <th scope="col">귀속 포함</th>
              <th scope="col">레이드</th>
              <th scope="col">귀속 제외</th>
              <th scope="col">레이드</th>
            </tr>
          </thead>
          <tbody>
            {levelGoldRows.map((row) => (
              <tr key={row.level}>
                <th scope="row" className={styles['level-cell']}>
                  Lv. {row.level}
                </th>
                <GoldGroupCell group={row.withBound} />
                <RaidListCell raids={row.withBound.raids} goldKey="totalGold" />
                <GoldGroupCell group={row.withoutBound} />
                <RaidListCell raids={row.withoutBound.raids} goldKey="tradableGold" />
              </tr>
            ))}
          </tbody>
        </table>
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
    <label
      className={`${styles['exclude-option']} ${props.isChecked ? styles['is-selected'] : ''}`}
    >
      <input type="checkbox" checked={props.isChecked} onChange={handleChange} />
      <span className={styles['option-name']}>
        {props.option.contentName} {props.option.difficultyName}
      </span>
      <span className={styles['option-level']}>Lv. {props.option.entryItemLevel}</span>
    </label>
  );
}

function GoldGroupCell(props: { group: TLevelGoldRaidGroup }) {
  return <td className={styles['total-gold']}>{formatGold(props.group.totalGold)}</td>;
}

function RaidListCell(props: {
  raids: readonly TLevelGoldRaid[];
  goldKey: 'totalGold' | 'tradableGold';
}) {
  return (
    <td>
      <ol className={styles['raid-list']}>
        {props.raids.map((raid) => (
          <li key={raid.difficultyId}>
            <span className={styles['raid-name']}>
              {raid.contentName} {raid.difficultyName}
            </span>
            <span className={styles['raid-gold']}>{formatGold(raid[props.goldKey])}</span>
          </li>
        ))}
      </ol>
    </td>
  );
}
