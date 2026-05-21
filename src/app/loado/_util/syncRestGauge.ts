import type { TLoadoCellValue, TLoadoTableData } from '../_type/loado';
import { cyclesBetween, getCurrentCycleKey } from './cycleKey';
import { transitionRestGauge } from './restGauge';

// state 안의 휴식게이지 셀들을 현재 사이클까지 진행시킨다.
// 직전 사이클에서의 수행 여부는 cell.doneCycleKey === lastAccumulatedCycleKey로 판정.
// 그 이전 사이클들은 미수행으로 가정(데이터 없음).
export function syncRestGaugeCycles(
  state: TLoadoTableData,
  now: Date = new Date(),
): TLoadoTableData {
  let changed = false;
  const nextCells: typeof state.cells = {};

  for (const row of state.rows) {
    if (row.kind !== 'data' || row.cellRole !== 'restGauge') {
      const existing = state.cells[row.id];
      if (existing) nextCells[row.id] = existing;
      continue;
    }
    const currentCycleKey = getCurrentCycleKey(row.resetPeriod, now);
    const rowCells = state.cells[row.id];
    if (!rowCells) continue;

    const nextRow: Record<string, TLoadoCellValue> = {};
    let rowChanged = false;

    for (const colId of Object.keys(rowCells)) {
      const cell = rowCells[colId];
      if (cell.kind !== 'restGauge') {
        nextRow[colId] = cell;
        continue;
      }
      if (cell.lastAccumulatedCycleKey === currentCycleKey) {
        nextRow[colId] = cell;
        continue;
      }

      const cycles = cyclesBetween(
        cell.lastAccumulatedCycleKey,
        currentCycleKey,
        row.resetPeriod,
      );
      let value = cell.value;
      for (let i = 0; i < cycles; i++) {
        const didPerform =
          i === 0 && cell.doneCycleKey === cell.lastAccumulatedCycleKey;
        value = transitionRestGauge({ current: value, didPerform });
      }

      nextRow[colId] = {
        kind: 'restGauge',
        value,
        lastAccumulatedCycleKey: currentCycleKey,
        doneCycleKey: null,
      };
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
