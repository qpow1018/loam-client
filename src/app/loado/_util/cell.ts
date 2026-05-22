import type {
  TLoadoCellValue,
  TLoadoDataRow,
  TLoadoTableData,
} from '@/app/loado/_type/loado';

import { cyclesBetween, getCurrentCycleKey } from './cycleKey';
import { getNextRestGauge } from './restGauge';

export function createEmptyCell(row: TLoadoDataRow): TLoadoCellValue {
  const cycleKey = getCurrentCycleKey(row.resetPeriod);

  return {
    role: row.role,
    resetPeriod: row.resetPeriod,
    checkboxState: 'none',
    checkboxLabel: '',
    text: '',
    restGauge: null,
    restGaugeSkipThreshold: null,
    weekdays: [],
    cycleKey,
    lastAccumulatedCycleKey: cycleKey,
  };
}

// state 안의 모든 셀을 현재 사이클까지 진행시킨다.
// - restGauge: 누적/소모를 사이클 수만큼 시뮬레이션
// - checkbox / weekdayContent: 사이클이 바뀌면 unchecked로 리셋
// - text: 사이클이 바뀌면 빈 문자열로 리셋
// - permanent resetPeriod: getCurrentCycleKey가 항상 같은 값을 돌려줘 자동 스킵됨
// 주의: state.rows에 없는 rowId의 cells entry는 결과에서 자동으로 제거된다.
export function syncCells(
  state: TLoadoTableData,
  now: Date = new Date(),
): TLoadoTableData {
  let changed = false;
  const nextCells: typeof state.cells = {};

  for (const row of state.rows) {
    if (row.kind !== 'data') {
      const existing = state.cells[row.id];
      if (existing) nextCells[row.id] = existing;
      continue;
    }
    const rowCells = state.cells[row.id];
    if (!rowCells) continue;

    const nextRow: Record<string, TLoadoCellValue> = {};
    let rowChanged = false;

    for (const colId of Object.keys(rowCells)) {
      const cell = rowCells[colId];
      const currentCycleKey = getCurrentCycleKey(cell.resetPeriod, now);

      if (cell.lastAccumulatedCycleKey === currentCycleKey) {
        nextRow[colId] = cell;
        continue;
      }

      nextRow[colId] = syncCell(cell, currentCycleKey);
      rowChanged = true;
    }

    if (rowChanged) {
      changed = true;
      nextCells[row.id] = nextRow;
    } else {
      nextCells[row.id] = rowCells;
    }
  }

  if (!changed) return state;
  return { ...state, cells: nextCells };
}

function syncCell(cell: TLoadoCellValue, currentCycleKey: string): TLoadoCellValue {
  switch (cell.role) {
    case 'restGauge': {
      const cycles = cyclesBetween(
        cell.lastAccumulatedCycleKey,
        currentCycleKey,
        cell.resetPeriod,
      );
      let value = cell.restGauge ?? 0;
      for (let i = 0; i < cycles; i++) {
        // 첫 사이클만 직전 수행 여부를 반영. 그 이전은 데이터 없음 → 미수행으로 가정.
        const didPerform =
          i === 0 &&
          cell.checkboxState === 'checked' &&
          cell.cycleKey === cell.lastAccumulatedCycleKey;
        value = getNextRestGauge({ current: value, didPerform });
      }
      return {
        ...cell,
        restGauge: value,
        cycleKey: currentCycleKey,
        lastAccumulatedCycleKey: currentCycleKey,
        checkboxState: 'unchecked',
      };
    }
    case 'checkbox':
    case 'weekdayContent':
      return {
        ...cell,
        checkboxState: 'unchecked',
        cycleKey: currentCycleKey,
        lastAccumulatedCycleKey: currentCycleKey,
      };
    case 'text':
      return {
        ...cell,
        text: '',
        cycleKey: currentCycleKey,
        lastAccumulatedCycleKey: currentCycleKey,
      };
  }
}
