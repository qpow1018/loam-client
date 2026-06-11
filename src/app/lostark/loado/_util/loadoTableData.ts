import { storage, StorageKey } from '@/utils/storage';

import type {
  TTaskTableData,
  TTaskTableColumn,
  TTaskTableRow,
  TTaskTableCellValue,
} from '@/types/taskTable';
import { createEmptyCell, syncCells } from './cell';

const EMPTY_DATA: TTaskTableData = {
  columns: [],
  rows: [],
  cells: {},
};

// Storage I/O
export function getLoadoTableData(): TTaskTableData {
  const base = storage.local.get<TTaskTableData>(StorageKey.LOADO_TABLE, EMPTY_DATA);
  return syncCells(base);
}

export function saveLoadoTableData(data: TTaskTableData): void {
  storage.local.set(StorageKey.LOADO_TABLE, data);
}

// Column mutations
export function addColumn(data: TTaskTableData, next: TTaskTableColumn): TTaskTableData {
  const nextCells = { ...data.cells };
  for (const row of data.rows) {
    if (row.kind !== 'data') continue;
    nextCells[row.id] = {
      ...(nextCells[row.id] ?? {}),
      [next.id]: createEmptyCell(row),
    };
  }

  return { ...data, columns: [...data.columns, next], cells: nextCells };
}

export function updateColumn(data: TTaskTableData, next: TTaskTableColumn): TTaskTableData {
  if (!data.columns.some((c) => c.id === next.id)) return data;
  return {
    ...data,
    columns: data.columns.map((c) => (c.id === next.id ? next : c)),
  };
}

export function deleteColumn(data: TTaskTableData, colId: string): TTaskTableData {
  const nextCells: typeof data.cells = {};
  for (const [rowId, rowCells] of Object.entries(data.cells)) {
    const { [colId]: _removed, ...rest } = rowCells;
    if (Object.keys(rest).length > 0) nextCells[rowId] = rest;
  }
  return {
    ...data,
    columns: data.columns.filter((c) => c.id !== colId),
    cells: nextCells,
  };
}

export function reorderColumns(data: TTaskTableData, columns: TTaskTableColumn[]): TTaskTableData {
  return { ...data, columns };
}

// Row mutations
export function addRow(data: TTaskTableData, next: TTaskTableRow): TTaskTableData {
  if (next.kind !== 'data') return { ...data, rows: [...data.rows, next] };

  const nextRowCells: Record<string, TTaskTableCellValue> = {};
  for (const col of data.columns) {
    nextRowCells[col.id] = createEmptyCell(next);
  }

  return {
    ...data,
    rows: [...data.rows, next],
    cells: { ...data.cells, [next.id]: nextRowCells },
  };
}

export function updateRow(data: TTaskTableData, next: TTaskTableRow): TTaskTableData {
  if (!data.rows.some((r) => r.id === next.id)) return data;
  return {
    ...data,
    rows: data.rows.map((r) => (r.id === next.id ? next : r)),
  };
}

export function deleteRow(data: TTaskTableData, rowId: string): TTaskTableData {
  const restCells = { ...data.cells };
  delete restCells[rowId];
  return {
    ...data,
    rows: data.rows.filter((r) => r.id !== rowId),
    cells: restCells,
  };
}

export function reorderRows(data: TTaskTableData, rows: TTaskTableRow[]): TTaskTableData {
  return { ...data, rows };
}

// Cell mutations
export function updateCell(
  data: TTaskTableData,
  rowId: string,
  colId: string,
  next: TTaskTableCellValue,
): TTaskTableData {
  const prevRow = data.cells[rowId] ?? {};
  return {
    ...data,
    cells: {
      ...data.cells,
      [rowId]: { ...prevRow, [colId]: next },
    },
  };
}
