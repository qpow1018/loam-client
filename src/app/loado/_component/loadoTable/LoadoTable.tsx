'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type {
  TLoadoTableData,
  TLoadoColumn,
  TLoadoRow,
  TLoadoCellValue,
} from '@/app/loado/_type/loado';
import { storage, StorageKey } from '@/utils/storage';
import { createEmptyCell, syncCells } from '@/app/loado/_util/cell';

import DraggableList from '@/components/common/draggableList/DraggableList';
import CornerCell from './CornerCell';
import HeaderCell from './HeaderCell';
import RowLabelCell from './RowLabelCell';
import RowDivider from './RowDivider';
import ContentCell from './ContentCell';

import styles from './loadoTable.module.scss';

const EMPTY_DATA: TLoadoTableData = {
  columns: [],
  rows: [],
  cells: {},
};

export default function LoadoTable() {
  const [data, setData] = useState<TLoadoTableData | null>(null);

  // localStorage는 클라이언트에서만 접근 가능하므로 마운트 이후에 읽어 상태에 반영한다.
  // 추가로 탭 visibility / focus / 주기적 polling으로 06:00 KST 사이클 경계를 넘었을 때 자동 재동기화.
  useEffect(() => {
    const base = storage.get<TLoadoTableData>(StorageKey.LOADO_TABLE, EMPTY_DATA);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(syncCells(base));

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
    storage.set(StorageKey.LOADO_TABLE, data);
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

  function addColumn(next: TLoadoColumn) {
    setData((prev) => ({ ...prev, columns: [...prev.columns, next] }));
  }

  function updateColumn(next: TLoadoColumn) {
    setData((prev) => {
      if (!prev.columns.some((c) => c.id === next.id)) return prev;
      return {
        ...prev,
        columns: prev.columns.map((c) => (c.id === next.id ? next : c)),
      };
    });
  }

  function deleteColumn(colId: string) {
    setData((prev) => {
      const nextCells: typeof prev.cells = {};
      for (const [rowId, rowCells] of Object.entries(prev.cells)) {
        const { [colId]: _removed, ...rest } = rowCells;
        if (Object.keys(rest).length > 0) nextCells[rowId] = rest;
      }
      return {
        ...prev,
        columns: prev.columns.filter((c) => c.id !== colId),
        cells: nextCells,
      };
    });
  }

  function addRow(next: TLoadoRow) {
    setData((prev) => ({ ...prev, rows: [...prev.rows, next] }));
  }

  function updateRow(next: TLoadoRow) {
    setData((prev) => {
      if (!prev.rows.some((r) => r.id === next.id)) return prev;
      return {
        ...prev,
        rows: prev.rows.map((r) => (r.id === next.id ? next : r)),
      };
    });
  }

  function deleteRow(rowId: string) {
    setData((prev) => {
      const restCells = { ...prev.cells };
      delete restCells[rowId];
      return {
        ...prev,
        rows: prev.rows.filter((r) => r.id !== rowId),
        cells: restCells,
      };
    });
  }

  function updateCell(rowId: string, colId: string, next: TLoadoCellValue) {
    setData((prev) => {
      const prevRow = prev.cells[rowId] ?? {};
      return {
        ...prev,
        cells: {
          ...prev.cells,
          [rowId]: { ...prevRow, [colId]: next },
        },
      };
    });
  }

  return (
    <div className={styles['loado-table']}>
      <div className={styles['header-row']}>
        <CornerCell
          onAddCharacter={() => addColumn({ id: uuidv4(), name: '새 캐릭터' })}
          onAddTask={addRow}
          onAddDivider={() => addRow({ kind: 'divider', id: uuidv4() })}
        />

        <DraggableList<TLoadoColumn>
          items={data.columns}
          getId={(c) => c.id}
          direction="horizontal"
          onReorder={(cols) => setData((prev) => ({ ...prev, columns: cols }))}
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
        onReorder={(rows) => setData((prev) => ({ ...prev, rows }))}
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
