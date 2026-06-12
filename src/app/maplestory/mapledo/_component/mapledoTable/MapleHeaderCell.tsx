'use client';

import { useState } from 'react';

import type { TTaskTableColumn } from '@/types/taskTable';
import type { TDragHandleProps } from '@/components/common/draggableList/DraggableList';
import HeaderCell from '@/components/taskTable/HeaderCell';
import CharacterModal from './characterModal/CharacterModal';

export default function MapleHeaderCell(props: {
  column: TTaskTableColumn;
  dragHandleProps: TDragHandleProps;
  onChange: (next: TTaskTableColumn) => void;
  onDelete: () => void;
}) {
  const { column, dragHandleProps, onChange, onDelete } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleSubmit(next: TTaskTableColumn) {
    onChange(next);
    setIsModalOpen(false);
  }

  function handleDelete() {
    setIsModalOpen(false);
    onDelete();
  }

  return (
    <>
      <HeaderCell
        column={column}
        dragHandleProps={dragHandleProps}
        onEdit={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <CharacterModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingData={column}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
