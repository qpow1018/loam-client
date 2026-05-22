import type {
  TLoadoCellRole,
  TLoadoCellValue,
  TLoadoCheckboxState,
  TLoadoDataRow,
  TLoadoTableData,
} from '@/app/loado/_type/loado';

import { cyclesBetween, getCurrentCycleKey } from './cycleKey';
import { getNextRestGauge } from './restGauge';

// 사용자 write 시점에 cycleKey/lastAccumulatedCycleKey를 모두 현재 사이클로 맞춰주는 헬퍼.
// 둘 중 하나만 갱신하면 다음 syncCells가 셀을 "사이클 미스매치"로 보고 wipe해버린다.
export function commitCellWrite<T extends TLoadoCellValue>(updated: T): T {
  const cycleKey = getCurrentCycleKey(updated.resetPeriod);
  return { ...updated, cycleKey, lastAccumulatedCycleKey: cycleKey };
}

export function createEmptyCell(row: TLoadoDataRow): TLoadoCellValue {
  const cycleKey = getCurrentCycleKey(row.resetPeriod);
  const base = {
    cycleKey,
    lastAccumulatedCycleKey: cycleKey,
    resetPeriod: row.resetPeriod,
  };
  switch (row.role) {
    case 'text':
      return { ...base, role: 'text', text: '' };
    case 'restGauge':
      return {
        ...base,
        role: 'restGauge',
        checkboxState: 'unchecked',
        checkboxLabel: '',
        restGauge: 0,
        restGaugeSkipThreshold: 0,
      };
    case 'weekdayContent':
      return {
        ...base,
        role: 'weekdayContent',
        checkboxState: 'unchecked',
        checkboxLabel: '',
        weekdays: [],
      };
    case 'checkbox':
      return {
        ...base,
        role: 'checkbox',
        checkboxState: 'unchecked',
        checkboxLabel: '',
      };
  }
}

// 셀의 role을 다른 role로 변경하면서 가능한 한 기존 필드 값을 유지한다.
// 사용자가 CellSettingsModal에서 role을 바꿀 때, 라벨 같은 정보가 날아가지 않게 함.
export function changeCellRole(cell: TLoadoCellValue, newRole: TLoadoCellRole): TLoadoCellValue {
  if (cell.role === newRole) return cell;
  const base = {
    cycleKey: cell.cycleKey,
    lastAccumulatedCycleKey: cell.lastAccumulatedCycleKey,
    resetPeriod: cell.resetPeriod,
  };
  const checkboxState: TLoadoCheckboxState =
    cell.role === 'text' ? 'unchecked' : cell.checkboxState;
  const checkboxLabel = cell.role === 'text' ? '' : cell.checkboxLabel;
  switch (newRole) {
    case 'text':
      return { ...base, role: 'text', text: '' };
    case 'restGauge':
      return {
        ...base,
        role: 'restGauge',
        checkboxState,
        checkboxLabel,
        restGauge: 0,
        restGaugeSkipThreshold: 0,
      };
    case 'weekdayContent':
      return {
        ...base,
        role: 'weekdayContent',
        checkboxState,
        checkboxLabel,
        weekdays: [],
      };
    case 'checkbox':
      return { ...base, role: 'checkbox', checkboxState, checkboxLabel };
  }
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
      let value = cell.restGauge;
      for (let i = 0; i < cycles; i++) {
        // 첫 사이클만 직전 수행 여부를 반영. 그 이전은 데이터 없음 → 미수행으로 가정.
        const didPerform = i === 0 && cell.checkboxState === 'checked';
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

