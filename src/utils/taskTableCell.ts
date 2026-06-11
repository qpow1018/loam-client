import type {
  TTaskTableCellRole,
  TTaskTableCellValue,
  TTaskTableCellValueRestGauge,
  TTaskTableCheckboxState,
  TTaskTableCyclePolicy,
  TTaskTableData,
  TTaskTableDataRow,
} from '@/types/taskTable';
import { cyclesBetween, getCurrentCycleKey } from '@/utils/taskTableCycle';

type TSyncRestGauge = (cell: TTaskTableCellValueRestGauge, cycles: number) => number;

type TSyncCellsOptions = {
  cyclePolicy: TTaskTableCyclePolicy;
  syncRestGauge?: TSyncRestGauge;
};

export function commitCellWrite<T extends TTaskTableCellValue>(
  updated: T,
  cyclePolicy: TTaskTableCyclePolicy,
): T {
  const cycleKey = getCurrentCycleKey(updated.resetPeriod, cyclePolicy);
  return { ...updated, cycleKey, lastAccumulatedCycleKey: cycleKey };
}

export function createEmptyCell(
  row: TTaskTableDataRow,
  cyclePolicy: TTaskTableCyclePolicy,
  now: Date = new Date(),
): TTaskTableCellValue {
  const cycleKey = getCurrentCycleKey(row.resetPeriod, cyclePolicy, now);
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

export function changeCellRole(
  cell: TTaskTableCellValue,
  newRole: TTaskTableCellRole,
): TTaskTableCellValue {
  if (cell.role === newRole) return cell;

  const base = {
    cycleKey: cell.cycleKey,
    lastAccumulatedCycleKey: cell.lastAccumulatedCycleKey,
    resetPeriod: cell.resetPeriod,
  };
  const checkboxState: TTaskTableCheckboxState =
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

export function syncCells(
  state: TTaskTableData,
  options: TSyncCellsOptions,
  now: Date = new Date(),
): TTaskTableData {
  const { cyclePolicy, syncRestGauge } = options;
  let changed = false;
  const nextCells: typeof state.cells = {};

  for (const row of state.rows) {
    if (row.kind !== 'data') {
      const existing = state.cells[row.id];
      if (existing) nextCells[row.id] = existing;
      continue;
    }

    const rowCells = state.cells[row.id] ?? {};
    const colIds = new Set(state.columns.map((col) => col.id));
    const nextRow: Record<string, TTaskTableCellValue> = {};
    let rowChanged = Object.keys(rowCells).some((colId) => !colIds.has(colId));

    for (const col of state.columns) {
      const cell = rowCells[col.id] ?? createEmptyCell(row, cyclePolicy, now);
      if (rowCells[col.id] === undefined) rowChanged = true;

      const currentCycleKey = getCurrentCycleKey(cell.resetPeriod, cyclePolicy, now);
      if (cell.lastAccumulatedCycleKey === currentCycleKey) {
        nextRow[col.id] = cell;
        continue;
      }

      nextRow[col.id] = syncCell(cell, currentCycleKey, syncRestGauge);
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

function syncCell(
  cell: TTaskTableCellValue,
  currentCycleKey: string,
  syncRestGauge?: TSyncRestGauge,
): TTaskTableCellValue {
  switch (cell.role) {
    case 'restGauge': {
      const cycles = cyclesBetween(cell.lastAccumulatedCycleKey, currentCycleKey, cell.resetPeriod);
      return {
        ...cell,
        restGauge: syncRestGauge?.(cell, cycles) ?? cell.restGauge,
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
