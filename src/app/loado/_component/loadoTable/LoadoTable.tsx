'use client';

import { useState } from 'react';
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
import ContentCell from './ContentCell';
import TaskModal from './TaskModal';

import styles from './loadoTable.module.scss';

export default function LoadoTable(props: {
  data: TLoadoTableData;
  onChange: (next: TLoadoTableData) => void;
}) {
  const { data, onChange } = props;

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [targetTaskRowId, setTargetTaskRowId] = useState<string | null>(null);

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

  function openTaskModal(rowId: string | null) {
    setTargetTaskRowId(rowId);
    setIsTaskModalOpen(true);
  }

  function closeTaskModal() {
    setIsTaskModalOpen(false);
    setTargetTaskRowId(null);
  }

  function addDivider() {
    const newRow: TLoadoRow = { kind: 'divider', id: uuidv4() };
    onChange({ ...data, rows: [...data.rows, newRow] });
  }

  function handleTaskSubmit(row: TLoadoDataRow) {
    if (targetTaskRowId === null) {
      onChange({ ...data, rows: [...data.rows, row] });
    } else {
      onChange({
        ...data,
        rows: data.rows.map((r) => (r.id === row.id ? row : r)),
      });
    }
    closeTaskModal();
  }

  function handleTaskDelete() {
    if (targetTaskRowId === null) return;
    const rowId = targetTaskRowId;
    const restCells = { ...data.cells };
    delete restCells[rowId];
    onChange({
      ...data,
      rows: data.rows.filter((r) => r.id !== rowId),
      cells: restCells,
    });
    closeTaskModal();
  }

  return (
    <div className={styles['loado-table']}>
      <div className={styles['header-row']}>
        <CornerCell
          onAddCharacter={addCharacter}
          onClickAddTask={() => openTaskModal(null)}
          onAddDivider={addDivider}
        />

        <DraggableList<TLoadoColumn>
          items={data.columns}
          getId={(c) => c.id}
          direction="horizontal"
          onReorder={(cols) => onChange({ ...data, columns: cols })}
        >
          {(col, { dragHandleProps }) => (
            <HeaderCell column={col} dragHandleProps={dragHandleProps} />
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
            <div className={styles['row-divider']} {...dragHandleProps} />
          ) : (
            <div className={styles['row']}>
              <RowLabelCell
                row={row}
                dragHandleProps={dragHandleProps}
                onEdit={() => openTaskModal(row.id)}
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

      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={closeTaskModal}
          editingData={data.rows.find(
            (r): r is TLoadoDataRow => r.id === targetTaskRowId && r.kind === 'data',
          )}
          onSubmit={handleTaskSubmit}
          onDelete={targetTaskRowId !== null ? handleTaskDelete : undefined}
        />
      )}
    </div>
  );
}
