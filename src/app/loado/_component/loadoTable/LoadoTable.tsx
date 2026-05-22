'use client';

import { v4 as uuidv4 } from 'uuid';

import type {
  TLoadoTableData,
  TLoadoColumn,
  TLoadoRow,
  TLoadoDataRow,
  TLoadoCellValue,
} from '@/app/loado/_type/loado';

import DraggableList from '@/components/common/draggableList/DraggableList';
import { createEmptyCell } from '../../_util/createEmptyCell';
import CornerCell from './CornerCell';
import HeaderCell from './HeaderCell';
import RowLabelCell from './RowLabelCell';
import RowDivider from './RowDivider';
import ContentCell from './ContentCell';

import styles from './loadoTable.module.scss';

export default function LoadoTable(props: {
  data: TLoadoTableData;
  onChange: (next: TLoadoTableData) => void;
}) {
  const { data, onChange } = props;

  function updateCell(rowId: string, colId: string, next: TLoadoCellValue) {
    const prevRow = data.cells[rowId] ?? {};
    onChange({
      ...data,
      cells: {
        ...data.cells,
        [rowId]: { ...prevRow, [colId]: next },
      },
    });
  }

  function addCharacter() {
    const newColumn: TLoadoColumn = { id: uuidv4(), name: '새 캐릭터' };
    onChange({ ...data, columns: [...data.columns, newColumn] });
  }

  function updateColumn(next: TLoadoColumn) {
    onChange({
      ...data,
      columns: data.columns.map((c) => (c.id === next.id ? next : c)),
    });
  }

  function deleteColumn(colId: string) {
    const nextCells: typeof data.cells = {};
    for (const [rowId, rowCells] of Object.entries(data.cells)) {
      const { [colId]: _removed, ...rest } = rowCells;
      if (Object.keys(rest).length > 0) {
        nextCells[rowId] = rest;
      }
    }
    onChange({
      ...data,
      columns: data.columns.filter((c) => c.id !== colId),
      cells: nextCells,
    });
  }

  function addDivider() {
    const newRow: TLoadoRow = { kind: 'divider', id: uuidv4() };
    onChange({ ...data, rows: [...data.rows, newRow] });
  }

  function addTaskRow(row: TLoadoDataRow) {
    onChange({ ...data, rows: [...data.rows, row] });
  }

  function updateRow(next: TLoadoDataRow) {
    onChange({
      ...data,
      rows: data.rows.map((r) => (r.id === next.id ? next : r)),
    });
  }

  function deleteRow(rowId: string) {
    const restCells = { ...data.cells };
    delete restCells[rowId];
    onChange({
      ...data,
      rows: data.rows.filter((r) => r.id !== rowId),
      cells: restCells,
    });
  }

  return (
    <div className={styles['loado-table']}>
      <div className={styles['header-row']}>
        <CornerCell
          onAddCharacter={addCharacter}
          onAddTask={addTaskRow}
          onAddDivider={addDivider}
        />

        <DraggableList<TLoadoColumn>
          items={data.columns}
          getId={(c) => c.id}
          direction="horizontal"
          onReorder={(cols) => onChange({ ...data, columns: cols })}
        >
          {(col, { dragHandleProps }) => (
            <HeaderCell
              column={col}
              dragHandleProps={dragHandleProps}
              onChange={updateColumn}
              onDelete={() => deleteColumn(col.id)}
            />
          )}
        </DraggableList>
      </div>

      <DraggableList<TLoadoRow>
        items={data.rows}
        getId={(r) => r.id}
        direction="vertical"
        onReorder={(rows) => onChange({ ...data, rows })}
      >
        {(row, { dragHandleProps }) =>
          row.kind === 'divider' ? (
            <RowDivider dragHandleProps={dragHandleProps} onDelete={() => deleteRow(row.id)} />
          ) : (
            <div className={styles['row']}>
              <RowLabelCell
                dragHandleProps={dragHandleProps}
                row={row}
                onChange={updateRow}
                onDelete={() => deleteRow(row.id)}
              />
              {data.columns.map((col) => (
                <ContentCell
                  key={col.id}
                  cell={data.cells[row.id]?.[col.id] ?? createEmptyCell(row)}
                  onChange={(next) => updateCell(row.id, col.id, next)}
                />
              ))}
            </div>
          )
        }
      </DraggableList>
    </div>
  );
}
