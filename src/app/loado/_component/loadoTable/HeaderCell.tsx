'use client';

import { useState } from 'react';

import type { TLoadoColumn } from '@/app/loado/_type/loado';

import type { TDragHandleProps } from '@/components/common/draggableList/DraggableList';
import CharacterModal from './characterModal/CharacterModal';

import styles from './headerCell.module.scss';

export default function HeaderCell(props: {
  column: TLoadoColumn;
  dragHandleProps: TDragHandleProps;
  onChange: (next: TLoadoColumn) => void;
  onDelete: () => void;
}) {
  const { column, dragHandleProps, onChange, onDelete } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    setIsModalOpen(true);
  }

  function handleSubmit(next: TLoadoColumn) {
    onChange(next);
    setIsModalOpen(false);
  }

  function handleDelete() {
    setIsModalOpen(false);
    onDelete();
  }

  return (
    <>
      <div {...dragHandleProps} className={styles['header-cell']} onContextMenu={handleContextMenu}>
        {column.imageUrl && (
          <div className={styles['icon-box']}>
            <img src={column.imageUrl} alt="" />
          </div>
        )}
        {column.name}
      </div>

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
