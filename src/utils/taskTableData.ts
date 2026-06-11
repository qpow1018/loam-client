import type {
  TTaskTableCellValue,
  TTaskTableColumn,
  TTaskTableCyclePolicy,
  TTaskTableData,
  TTaskTableRow,
} from '@/types/taskTable';
import { createEmptyCell } from '@/utils/taskTableCell';

export function addColumn(
  data: TTaskTableData,
  next: TTaskTableColumn,
  cyclePolicy: TTaskTableCyclePolicy,
): TTaskTableData {
  const nextCells = { ...data.cells };
  for (const row of data.rows) {
    if (row.kind !== 'data') continue;
    nextCells[row.id] = {
      ...(nextCells[row.id] ?? {}),
      [next.id]: createEmptyCell(row, cyclePolicy),
    };
  }

  return { ...data, columns: [...data.columns, next], cells: nextCells };
}

export function updateColumn(data: TTaskTableData, next: TTaskTableColumn): TTaskTableData {
  if (!data.columns.some((column) => column.id === next.id)) return data;
  return {
    ...data,
    columns: data.columns.map((column) => (column.id === next.id ? next : column)),
  };
}

export function deleteColumn(data: TTaskTableData, columnId: string): TTaskTableData {
  const nextCells: typeof data.cells = {};
  for (const [rowId, rowCells] of Object.entries(data.cells)) {
    const { [columnId]: _removed, ...rest } = rowCells;
    if (Object.keys(rest).length > 0) nextCells[rowId] = rest;
  }

  return {
    ...data,
    columns: data.columns.filter((column) => column.id !== columnId),
    cells: nextCells,
  };
}

export function reorderColumns(data: TTaskTableData, columns: TTaskTableColumn[]): TTaskTableData {
  return { ...data, columns };
}

export function addRow(
  data: TTaskTableData,
  next: TTaskTableRow,
  cyclePolicy: TTaskTableCyclePolicy,
): TTaskTableData {
  if (next.kind !== 'data') return { ...data, rows: [...data.rows, next] };

  const nextRowCells: Record<string, TTaskTableCellValue> = {};
  for (const column of data.columns) {
    nextRowCells[column.id] = createEmptyCell(next, cyclePolicy);
  }

  return {
    ...data,
    rows: [...data.rows, next],
    cells: { ...data.cells, [next.id]: nextRowCells },
  };
}

export function updateRow(data: TTaskTableData, next: TTaskTableRow): TTaskTableData {
  if (!data.rows.some((row) => row.id === next.id)) return data;
  return {
    ...data,
    rows: data.rows.map((row) => (row.id === next.id ? next : row)),
  };
}

export function deleteRow(data: TTaskTableData, rowId: string): TTaskTableData {
  const nextCells = { ...data.cells };
  delete nextCells[rowId];

  return {
    ...data,
    rows: data.rows.filter((row) => row.id !== rowId),
    cells: nextCells,
  };
}

export function reorderRows(data: TTaskTableData, rows: TTaskTableRow[]): TTaskTableData {
  return { ...data, rows };
}

export function updateCell(
  data: TTaskTableData,
  rowId: string,
  columnId: string,
  next: TTaskTableCellValue,
): TTaskTableData {
  const previousRow = data.cells[rowId] ?? {};
  return {
    ...data,
    cells: {
      ...data.cells,
      [rowId]: { ...previousRow, [columnId]: next },
    },
  };
}
