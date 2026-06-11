'use client';

import { useState } from 'react';

import type { TTaskTableDataRow } from '@/types/taskTable';

import type { TDragHandleProps } from '@/components/common/draggableList/DraggableList';
import RowLabelCell from '@/components/taskTable/RowLabelCell';
import TaskModal from './taskModal/TaskModal';

export default function LoaRowLabelCell(props: {
  dragHandleProps: TDragHandleProps;
  row: TTaskTableDataRow;
  onChange: (next: TTaskTableDataRow) => void;
  onDelete: () => void;
}) {
  const { dragHandleProps, row, onChange, onDelete } = props;

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  function handleSubmit(next: TTaskTableDataRow) {
    onChange(next);
    setIsTaskModalOpen(false);
  }

  function handleDelete() {
    setIsTaskModalOpen(false);
    onDelete();
  }

  return (
    <>
      <RowLabelCell
        dragHandleProps={dragHandleProps}
        row={row}
        onEdit={() => setIsTaskModalOpen(true)}
      />

      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          editingData={row}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
