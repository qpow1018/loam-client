'use client';

import { useEffect, useRef, useState } from 'react';

import type { TLoadoCellValue, TLoadoDataRow } from '../_type/loado';
import { getCurrentCycleKey, isWeekdayActive } from '../_util/cycleKey';
import { DEFAULT_REST_GAUGE_CONFIG } from '../_util/restGauge';

import styles from './cellView.module.scss';

type TProps = {
  row: TLoadoDataRow;
  cell: TLoadoCellValue | undefined;
  onChange: (next: TLoadoCellValue) => void;
};

export default function CellView({ row, cell, onChange }: TProps) {
  const currentCycleKey = getCurrentCycleKey(row.resetPeriod);
  const isInactiveDay =
    row.resetPeriod.kind === 'special' && !isWeekdayActive(row.resetPeriod.weekdays);

  if (row.cellRole === 'checkbox') {
    const checked =
      cell?.kind === 'checkbox' && cell.cycleKey === currentCycleKey ? cell.checked : false;
    return (
      <button
        type="button"
        className={`${styles['cell']} ${styles['checkbox']} ${
          isInactiveDay ? styles['inactive'] : ''
        }`}
        disabled={isInactiveDay}
        onClick={() =>
          onChange({ kind: 'checkbox', checked: !checked, cycleKey: currentCycleKey })
        }
      >
        {checked ? '✓' : ''}
      </button>
    );
  }

  if (row.cellRole === 'text') {
    const text = cell?.kind === 'text' && cell.cycleKey === currentCycleKey ? cell.text : '';
    return (
      <TextCell
        value={text}
        disabled={isInactiveDay}
        onCommit={(next) => onChange({ kind: 'text', text: next, cycleKey: currentCycleKey })}
      />
    );
  }

  // restGauge
  const config = row.restGaugeConfig ?? DEFAULT_REST_GAUGE_CONFIG;
  const gauge =
    cell?.kind === 'restGauge'
      ? cell
      : {
          kind: 'restGauge' as const,
          value: 0,
          lastAccumulatedCycleKey: currentCycleKey,
          doneCycleKey: null,
        };
  const isDone = gauge.doneCycleKey === currentCycleKey;
  return (
    <button
      type="button"
      className={`${styles['cell']} ${styles['gauge']} ${
        isInactiveDay ? styles['inactive'] : ''
      }`}
      disabled={isInactiveDay}
      onClick={() =>
        onChange({
          ...gauge,
          doneCycleKey: isDone ? null : currentCycleKey,
        })
      }
      title={isDone ? '오늘 수행 표시됨 (다시 클릭하면 해제)' : '클릭하면 오늘 수행 표시'}
    >
      {gauge.value}/{config.max}
      {isDone ? ' ✓' : ''}
    </button>
  );
}

function TextCell({
  value,
  disabled,
  onCommit,
}: {
  value: string;
  disabled: boolean;
  onCommit: (next: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const lastValueRef = useRef(value);

  useEffect(() => {
    if (value !== lastValueRef.current) {
      setDraft(value);
      lastValueRef.current = value;
    }
  }, [value]);

  return (
    <input
      type="text"
      className={`${styles['cell']} ${styles['text']} ${disabled ? styles['inactive'] : ''}`}
      value={draft}
      disabled={disabled}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={() => {
        if (draft !== value) onCommit(draft);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
      }}
    />
  );
}
