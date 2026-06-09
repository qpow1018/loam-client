'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type {
  TLoadoTableData,
  TLoadoColumn,
  TLoadoRow,
  TLoadoCellValue,
} from '@/app/lostark/loado/_type/loado';
import { createEmptyCell, syncCells } from '@/app/lostark/loado/_util/cell';
import {
  getLoadoTableData,
  saveLoadoTableData,
  addColumn,
  updateColumn,
  deleteColumn,
  reorderColumns,
  addRow,
  updateRow,
  deleteRow,
  reorderRows,
  updateCell,
} from '@/app/lostark/loado/_util/loadoTableData';

import DraggableList from '@/components/common/draggableList/DraggableList';
import CornerCell from './CornerCell';
import HeaderCell from './HeaderCell';
import RowLabelCell from './RowLabelCell';
import RowDivider from './RowDivider';
import ContentCell from './ContentCell';

import styles from './loadoTable.module.scss';

export default function LoadoTable() {
  const [data, setData] = useState<TLoadoTableData | null>(null);

  // localStorage는 클라이언트에서만 접근 가능하므로 마운트 이후에 읽어 상태에 반영한다.
  // 추가로 탭 visibility / focus / 주기적 polling으로 06:00 KST 사이클 경계를 넘었을 때 자동 재동기화.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(getLoadoTableData());

    function resync() {
      setData((prev) => (prev === null ? prev : syncCells(prev)));
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
  function setNonNullData(action: React.SetStateAction<TLoadoTableData>) {
    setData((prev) => {
      if (prev === null) return prev;
      return typeof action === 'function'
        ? (action as (p: TLoadoTableData) => TLoadoTableData)(prev)
        : action;
    });
  }

  if (data === null) return null;

  return <LoadoTableContent data={data} setData={setNonNullData} />;
}

function LoadoTableContent(props: {
  data: TLoadoTableData;
  setData: React.Dispatch<React.SetStateAction<TLoadoTableData>>;
}) {
  const { data, setData } = props;

  const handleAddColumn = (next: TLoadoColumn) => setData((prev) => addColumn(prev, next));
  const handleUpdateColumn = (next: TLoadoColumn) => setData((prev) => updateColumn(prev, next));
  const handleDeleteColumn = (colId: string) => setData((prev) => deleteColumn(prev, colId));
  const handleReorderColumns = (columns: TLoadoColumn[]) =>
    setData((prev) => reorderColumns(prev, columns));

  const handleAddRow = (next: TLoadoRow) => setData((prev) => addRow(prev, next));
  const handleUpdateRow = (next: TLoadoRow) => setData((prev) => updateRow(prev, next));
  const handleDeleteRow = (rowId: string) => setData((prev) => deleteRow(prev, rowId));
  const handleReorderRows = (rows: TLoadoRow[]) => setData((prev) => reorderRows(prev, rows));

  const handleUpdateCell = (rowId: string, colId: string, next: TLoadoCellValue) =>
    setData((prev) => updateCell(prev, rowId, colId, next));

  return (
    <div className={styles['loado-table']}>
      <div className={styles['header-row']}>
        <CornerCell
          onAddCharacter={handleAddColumn}
          onAddTask={handleAddRow}
          onAddDivider={() => handleAddRow({ kind: 'divider', id: uuidv4() })}
        />

        <DraggableList<TLoadoColumn>
          items={data.columns}
          getId={(c) => c.id}
          direction="horizontal"
          onReorder={handleReorderColumns}
        >
          {(col, { dragHandleProps }) => (
            <HeaderCell
              column={col}
              dragHandleProps={dragHandleProps}
              onChange={handleUpdateColumn}
              onDelete={() => handleDeleteColumn(col.id)}
            />
          )}
        </DraggableList>
      </div>

      <DraggableList<TLoadoRow>
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
              <RowLabelCell
                dragHandleProps={dragHandleProps}
                row={row}
                onChange={handleUpdateRow}
                onDelete={() => handleDeleteRow(row.id)}
              />
              {data.columns.map((col) => (
                <ContentCell
                  key={col.id}
                  cell={data.cells[row.id]?.[col.id] ?? createEmptyCell(row)}
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
