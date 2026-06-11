import { storage, StorageKey } from '@/utils/storage';

import type { TTaskTableData } from '@/types/taskTable';
import { TASK_TABLE_CYCLE_POLICIES } from '@/define/taskTable';
import { syncCells } from '@/utils/taskTableCell';

import { syncRestGauge } from './restGauge';

const CYCLE_POLICY = TASK_TABLE_CYCLE_POLICIES.lostark;
const SYNC_OPTIONS = { cyclePolicy: CYCLE_POLICY, syncRestGauge };

const EMPTY_DATA: TTaskTableData = {
  columns: [],
  rows: [],
  cells: {},
};

// Storage I/O
export function getLoadoTableData(): TTaskTableData {
  const base = storage.local.get<TTaskTableData>(StorageKey.LOADO_TABLE, EMPTY_DATA);
  return syncCells(base, SYNC_OPTIONS);
}

export function saveLoadoTableData(data: TTaskTableData): void {
  storage.local.set(StorageKey.LOADO_TABLE, data);
}
