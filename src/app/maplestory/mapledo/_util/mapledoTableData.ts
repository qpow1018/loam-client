import { v4 as uuidv4 } from 'uuid';

import { TASK_TABLE_CYCLE_POLICIES } from '@/define/taskTable';
import type { TTaskTableData } from '@/types/taskTable';
import { syncCells } from '@/utils/taskTableCell';
import { storage, StorageKey } from '@/utils/storage';

const CYCLE_POLICY = TASK_TABLE_CYCLE_POLICIES.maplestory;

const EMPTY_DATA: TTaskTableData = {
  columns: [],
  rows: [],
  cells: {},
};

export function getMapledoTableData(): TTaskTableData {
  const base = storage.local.get<TTaskTableData>(StorageKey.MAPLEDO_TABLE, EMPTY_DATA);
  return syncCells(normalizeDuplicateColumnIds(base), { cyclePolicy: CYCLE_POLICY });
}

export function saveMapledoTableData(data: TTaskTableData): void {
  storage.local.set(StorageKey.MAPLEDO_TABLE, data);
}

function normalizeDuplicateColumnIds(data: TTaskTableData): TTaskTableData {
  const seenIds = new Set<string>();
  let hasDuplicate = false;

  const columns = data.columns.map((column) => {
    if (!seenIds.has(column.id)) {
      seenIds.add(column.id);
      return column;
    }

    hasDuplicate = true;
    return { ...column, id: uuidv4() };
  });

  if (!hasDuplicate) return data;

  const cells: TTaskTableData['cells'] = {};
  for (const [rowId, rowCells] of Object.entries(data.cells)) {
    cells[rowId] = {};
    data.columns.forEach((column, index) => {
      const cell = rowCells[column.id];
      if (cell !== undefined) cells[rowId][columns[index].id] = cell;
    });
  }

  return { ...data, columns, cells };
}
