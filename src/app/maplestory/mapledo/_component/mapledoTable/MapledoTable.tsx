'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { TASK_TABLE_CYCLE_POLICIES } from '@/define/taskTable';
import type {
  TTaskTableCellValue,
  TTaskTableColumn,
  TTaskTableData,
  TTaskTableRow,
} from '@/types/taskTable';
import { createEmptyCell, syncCells } from '@/utils/taskTableCell';
import {
  addColumn,
  addRow,
  deleteColumn,
  deleteRow,
  reorderColumns,
  reorderRows,
  updateCell,
  updateColumn,
  updateRow,
} from '@/utils/taskTableData';
import {
  getMapledoTableData,
  saveMapledoTableData,
} from '@/app/maplestory/mapledo/_util/mapledoTableData';
import DraggableList from '@/components/common/draggableList/DraggableList';
import RowDivider from '@/components/taskTable/RowDivider';
import MapleCornerCell from './MapleCornerCell';
import MapleHeaderCell from './MapleHeaderCell';
import MapleRowLabelCell from './MapleRowLabelCell';
import MapleContentCell from './MapleContentCell';

import styles from './mapledoTable.module.scss';

const CYCLE_POLICY = TASK_TABLE_CYCLE_POLICIES.maplestory;

export default function MapledoTable() {
  const [data, setData] = useState<TTaskTableData | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(getMapledoTableData());

    function resync() {
      setData((prev) => (prev === null ? prev : syncCells(prev, { cyclePolicy: CYCLE_POLICY })));
    }

    document.addEventListener('visibilitychange', resync);
    window.addEventListener('focus', resync);
    const intervalId = window.setInterval(resync, 5 * 60 * 1000);

    return () => {
      document.removeEventListener('visibilitychange', resync);
      window.removeEventListener('focus', resync);
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (data === null) return;
    saveMapledoTableData(data);
  }, [data]);

  function setNonNullData(action: React.SetStateAction<TTaskTableData>) {
    setData((prev) => {
      if (prev === null) return prev;
      return typeof action === 'function'
        ? (action as (current: TTaskTableData) => TTaskTableData)(prev)
        : action;
    });
  }

  if (data === null) return null;

  return <MapledoTableContent data={data} setData={setNonNullData} />;
}

function MapledoTableContent(props: {
  data: TTaskTableData;
  setData: React.Dispatch<React.SetStateAction<TTaskTableData>>;
}) {
  const { data, setData } = props;

  function handleAddColumn(next: TTaskTableColumn) {
    setData((prev) => addColumn(prev, next, CYCLE_POLICY));
  }

  function handleUpdateColumn(next: TTaskTableColumn) {
    setData((prev) => updateColumn(prev, next));
  }

  function handleDeleteColumn(columnId: string) {
    setData((prev) => deleteColumn(prev, columnId));
  }

  function handleAddDivider() {
    setData((prev) => addRow(prev, { kind: 'divider', id: uuidv4() }, CYCLE_POLICY));
  }

  function handleAddRow(next: TTaskTableRow) {
    setData((prev) => addRow(prev, next, CYCLE_POLICY));
  }

  function handleUpdateRow(next: TTaskTableRow) {
    setData((prev) => updateRow(prev, next));
  }

  function handleReorderColumns(columns: TTaskTableColumn[]) {
    setData((prev) => reorderColumns(prev, columns));
  }

  function handleDeleteRow(rowId: string) {
    setData((prev) => deleteRow(prev, rowId));
  }

  function handleReorderRows(rows: TTaskTableRow[]) {
    setData((prev) => reorderRows(prev, rows));
  }

  function handleUpdateCell(rowId: string, columnId: string, next: TTaskTableCellValue) {
    setData((prev) => updateCell(prev, rowId, columnId, next));
  }

  return (
    <div className={styles['mapledo-table']}>
      <div className={styles['header-row']}>
        <MapleCornerCell
          onAddCharacter={handleAddColumn}
          onAddTask={handleAddRow}
          onAddDivider={handleAddDivider}
        />

        <DraggableList<TTaskTableColumn>
          items={data.columns}
          getId={(column) => column.id}
          direction="horizontal"
          onReorder={handleReorderColumns}
        >
          {(column, { dragHandleProps }) => (
            <MapleHeaderCell
              column={column}
              dragHandleProps={dragHandleProps}
              onChange={handleUpdateColumn}
              onDelete={() => handleDeleteColumn(column.id)}
            />
          )}
        </DraggableList>
      </div>

      <DraggableList<TTaskTableRow>
        items={data.rows}
        getId={(row) => row.id}
        direction="vertical"
        onReorder={handleReorderRows}
      >
        {(row, { dragHandleProps }) =>
          row.kind === 'divider' ? (
            <RowDivider
              dragHandleProps={dragHandleProps}
              onDelete={() => handleDeleteRow(row.id)}
            />
          ) : (
            <div className={styles['row']}>
              <MapleRowLabelCell
                row={row}
                dragHandleProps={dragHandleProps}
                onChange={handleUpdateRow}
                onDelete={() => handleDeleteRow(row.id)}
              />
              {data.columns.map((column) => (
                <MapleContentCell
                  key={column.id}
                  cell={data.cells[row.id]?.[column.id] ?? createEmptyCell(row, CYCLE_POLICY)}
                  onChange={(next) => handleUpdateCell(row.id, column.id, next)}
                />
              ))}
            </div>
          )
        }
      </DraggableList>
    </div>
  );
}
