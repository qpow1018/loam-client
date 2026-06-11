'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type {
  TTaskTableData,
  TTaskTableColumn,
  TTaskTableRow,
  TTaskTableCellValue,
} from '@/types/taskTable';
import { TASK_TABLE_CYCLE_POLICIES } from '@/define/taskTable';
import { createEmptyCell, syncCells } from '@/utils/taskTableCell';
import {
  addColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
  addRow,
  updateRow,
  deleteRow,
  reorderRows,
  updateCell,
} from '@/utils/taskTableData';
import { syncRestGauge } from '@/app/lostark/loado/_util/restGauge';
import { getLoadoTableData, saveLoadoTableData } from '@/app/lostark/loado/_util/loadoTableData';

import DraggableList from '@/components/common/draggableList/DraggableList';
import RowDivider from '@/components/taskTable/RowDivider';
import LoaCornerCell from './LoaCornerCell';
import LoaHeaderCell from './LoaHeaderCell';
import LoaRowLabelCell from './LoaRowLabelCell';
import LoaContentCell from './LoaContentCell';

import styles from './loadoTable.module.scss';

const CYCLE_POLICY = TASK_TABLE_CYCLE_POLICIES.lostark;
const SYNC_OPTIONS = { cyclePolicy: CYCLE_POLICY, syncRestGauge };

export default function LoadoTable() {
  const [data, setData] = useState<TTaskTableData | null>(null);

  // localStorage는 클라이언트에서만 접근 가능하므로 마운트 이후에 읽어 상태에 반영한다.
  // 추가로 탭 visibility / focus / 주기적 polling으로 06:00 KST 사이클 경계를 넘었을 때 자동 재동기화.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(getLoadoTableData());

    function resync() {
      setData((prev) => (prev === null ? prev : syncCells(prev, SYNC_OPTIONS)));
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

  // 데이터가 바뀌면 localStorage에 저장. 로드 전(null)엔 스킵.
  useEffect(() => {
    if (data === null) return;
    saveLoadoTableData(data);
  }, [data]);

  // children에는 non-null setter를 노출 — 핸들러마다 null 가드를 반복하지 않기 위함.
  function setNonNullData(action: React.SetStateAction<TTaskTableData>) {
    setData((prev) => {
      if (prev === null) return prev;
      return typeof action === 'function'
        ? (action as (p: TTaskTableData) => TTaskTableData)(prev)
        : action;
    });
  }

  if (data === null) return null;

  return <LoadoTableContent data={data} setData={setNonNullData} />;
}

function LoadoTableContent(props: {
  data: TTaskTableData;
  setData: React.Dispatch<React.SetStateAction<TTaskTableData>>;
}) {
  const { data, setData } = props;

  const handleAddColumn = (next: TTaskTableColumn) =>
    setData((prev) => addColumn(prev, next, CYCLE_POLICY));
  const handleUpdateColumn = (next: TTaskTableColumn) =>
    setData((prev) => updateColumn(prev, next));
  const handleDeleteColumn = (colId: string) => setData((prev) => deleteColumn(prev, colId));
  const handleReorderColumns = (columns: TTaskTableColumn[]) =>
    setData((prev) => reorderColumns(prev, columns));

  const handleAddRow = (next: TTaskTableRow) => setData((prev) => addRow(prev, next, CYCLE_POLICY));
  const handleUpdateRow = (next: TTaskTableRow) => setData((prev) => updateRow(prev, next));
  const handleDeleteRow = (rowId: string) => setData((prev) => deleteRow(prev, rowId));
  const handleReorderRows = (rows: TTaskTableRow[]) => setData((prev) => reorderRows(prev, rows));

  const handleUpdateCell = (rowId: string, colId: string, next: TTaskTableCellValue) =>
    setData((prev) => updateCell(prev, rowId, colId, next));

  return (
    <div className={styles['loado-table']}>
      <div className={styles['header-row']}>
        <LoaCornerCell
          onAddCharacter={handleAddColumn}
          onAddTask={handleAddRow}
          onAddDivider={() => handleAddRow({ kind: 'divider', id: uuidv4() })}
        />

        <DraggableList<TTaskTableColumn>
          items={data.columns}
          getId={(c) => c.id}
          direction="horizontal"
          onReorder={handleReorderColumns}
        >
          {(col, { dragHandleProps }) => (
            <LoaHeaderCell
              column={col}
              dragHandleProps={dragHandleProps}
              onChange={handleUpdateColumn}
              onDelete={() => handleDeleteColumn(col.id)}
            />
          )}
        </DraggableList>
      </div>

      <DraggableList<TTaskTableRow>
        items={data.rows}
        getId={(r) => r.id}
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
              <LoaRowLabelCell
                dragHandleProps={dragHandleProps}
                row={row}
                onChange={handleUpdateRow}
                onDelete={() => handleDeleteRow(row.id)}
              />
              {data.columns.map((col) => (
                <LoaContentCell
                  key={col.id}
                  cell={data.cells[row.id]?.[col.id] ?? createEmptyCell(row, CYCLE_POLICY)}
                  onChange={(next) => handleUpdateCell(row.id, col.id, next)}
                />
              ))}
            </div>
          )
        }
      </DraggableList>
    </div>
  );
}
