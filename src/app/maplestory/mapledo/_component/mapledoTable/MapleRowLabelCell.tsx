'use client';

import { useState } from 'react';

import type { TTaskTableDataRow } from '@/types/taskTable';
import type { TDragHandleProps } from '@/components/common/draggableList/DraggableList';
import RowLabelCell from '@/components/taskTable/RowLabelCell';
import TaskModal from './taskModal/TaskModal';

export default function MapleRowLabelCell(props: {
  row: TTaskTableDataRow;
  dragHandleProps: TDragHandleProps;
  onChange: (next: TTaskTableDataRow) => void;
  onDelete: () => void;
}) {
  const { row, dragHandleProps, onChange, onDelete } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleSubmit(next: TTaskTableDataRow) {
    onChange(next);
    setIsModalOpen(false);
  }

  function handleDelete() {
    setIsModalOpen(false);
    onDelete();
  }

  return (
    <>
      <RowLabelCell
        row={row}
        dragHandleProps={dragHandleProps}
        onEdit={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingData={row}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
