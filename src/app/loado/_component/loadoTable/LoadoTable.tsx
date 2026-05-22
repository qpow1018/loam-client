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

import { createEmptyCell, syncCells } from '../../_util/cell';

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
  // 동시에 휴식게이지 누적도 1회 처리.
  useEffect(() => {
    const base = storage.get<TLoadoTableData>(StorageKey.LOADO_TABLE, EMPTY_DATA);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(syncCells(base));
  }, []);

  // 데이터가 바뀌면 localStorage에 저장. 로드 전(null)엔 스킵.
  useEffect(() => {
    if (data === null) return;
    storage.set(StorageKey.LOADO_TABLE, data);
  }, [data]);

  if (data === null) return null;

  return <LoadoTableContent data={data} setData={setData} />;
}

function LoadoTableContent(props: {
  data: TLoadoTableData;
  setData: (next: TLoadoTableData) => void;
}) {
  const { data, setData } = props;

  function updateColumn(next: TLoadoColumn) {
    const exists = data.columns.some((c) => c.id === next.id);
    const columns = exists
      ? data.columns.map((c) => (c.id === next.id ? next : c))
      : [...data.columns, next];
    setData({ ...data, columns });
  }

  function deleteColumn(colId: string) {
    const nextCells: typeof data.cells = {};
    for (const [rowId, rowCells] of Object.entries(data.cells)) {
      const { [colId]: _removed, ...rest } = rowCells;
      if (Object.keys(rest).length > 0) nextCells[rowId] = rest;
    }
    setData({
      ...data,
      columns: data.columns.filter((c) => c.id !== colId),
      cells: nextCells,
    });
  }

  function updateRow(next: TLoadoRow) {
    const exists = data.rows.some((r) => r.id === next.id);
    const rows = exists
      ? data.rows.map((r) => (r.id === next.id ? next : r))
      : [...data.rows, next];
    setData({ ...data, rows });
  }

  function deleteRow(rowId: string) {
    const restCells = { ...data.cells };
    delete restCells[rowId];
    setData({
      ...data,
      rows: data.rows.filter((r) => r.id !== rowId),
      cells: restCells,
    });
  }

  function updateCell(rowId: string, colId: string, next: TLoadoCellValue) {
    const prevRow = data.cells[rowId] ?? {};
    setData({
      ...data,
      cells: {
        ...data.cells,
        [rowId]: { ...prevRow, [colId]: next },
      },
    });
  }

  return (
    <div className={styles['loado-table']}>
      <div className={styles['header-row']}>
        <CornerCell
          onAddCharacter={() => updateColumn({ id: uuidv4(), name: '새 캐릭터' })}
          onAddTask={updateRow}
          onAddDivider={() => updateRow({ kind: 'divider', id: uuidv4() })}
        />

        <DraggableList<TLoadoColumn>
          items={data.columns}
          getId={(c) => c.id}
          direction="horizontal"
          onReorder={(cols) => setData({ ...data, columns: cols })}
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
        onReorder={(rows) => setData({ ...data, rows })}
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
