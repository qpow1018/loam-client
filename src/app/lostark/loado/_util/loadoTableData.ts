import { storage, StorageKey } from '@/utils/storage';

import type {
  TLoadoTableData,
  TLoadoColumn,
  TLoadoRow,
  TLoadoCellValue,
} from '@/app/lostark/loado/_type/loado';
import { createEmptyCell, syncCells } from './cell';

const EMPTY_DATA: TLoadoTableData = {
  columns: [],
  rows: [],
  cells: {},
};

// Storage I/O
export function getLoadoTableData(): TLoadoTableData {
  const base = storage.local.get<TLoadoTableData>(StorageKey.LOADO_TABLE, EMPTY_DATA);
  return syncCells(base);
}

export function saveLoadoTableData(data: TLoadoTableData): void {
  storage.local.set(StorageKey.LOADO_TABLE, data);
}

// Column mutations
export function addColumn(data: TLoadoTableData, next: TLoadoColumn): TLoadoTableData {
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

export function updateColumn(data: TLoadoTableData, next: TLoadoColumn): TLoadoTableData {
  if (!data.columns.some((c) => c.id === next.id)) return data;
  return {
    ...data,
    columns: data.columns.map((c) => (c.id === next.id ? next : c)),
  };
}

export function deleteColumn(data: TLoadoTableData, colId: string): TLoadoTableData {
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

export function reorderColumns(data: TLoadoTableData, columns: TLoadoColumn[]): TLoadoTableData {
  return { ...data, columns };
}

// Row mutations
export function addRow(data: TLoadoTableData, next: TLoadoRow): TLoadoTableData {
  if (next.kind !== 'data') return { ...data, rows: [...data.rows, next] };

  const nextRowCells: Record<string, TLoadoCellValue> = {};
  for (const col of data.columns) {
    nextRowCells[col.id] = createEmptyCell(next);
  }

  return {
    ...data,
    rows: [...data.rows, next],
    cells: { ...data.cells, [next.id]: nextRowCells },
  };
}

export function updateRow(data: TLoadoTableData, next: TLoadoRow): TLoadoTableData {
  if (!data.rows.some((r) => r.id === next.id)) return data;
  return {
    ...data,
    rows: data.rows.map((r) => (r.id === next.id ? next : r)),
  };
}

export function deleteRow(data: TLoadoTableData, rowId: string): TLoadoTableData {
  const restCells = { ...data.cells };
  delete restCells[rowId];
  return {
    ...data,
    rows: data.rows.filter((r) => r.id !== rowId),
    cells: restCells,
  };
}

export function reorderRows(data: TLoadoTableData, rows: TLoadoRow[]): TLoadoTableData {
  return { ...data, rows };
}

// Cell mutations
export function updateCell(
  data: TLoadoTableData,
  rowId: string,
  colId: string,
  next: TLoadoCellValue,
): TLoadoTableData {
  const prevRow = data.cells[rowId] ?? {};
  return {
    ...data,
    cells: {
      ...data.cells,
      [rowId]: { ...prevRow, [colId]: next },
    },
  };
}
