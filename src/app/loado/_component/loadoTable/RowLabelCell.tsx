'use client';

import { useState } from 'react';

import type { TDragHandleProps } from '@/components/common/draggableList/DraggableList';

import type { TLoadoDataRow } from '../../_type/loado';
import TaskModal from './taskModal/TaskModal';

import styles from './rowLabelCell.module.scss';

export default function RowLabelCell(props: {
  dragHandleProps: TDragHandleProps;
  row: TLoadoDataRow;
  onChange: (next: TLoadoDataRow) => void;
  onDelete: () => void;
}) {
  const { dragHandleProps, row, onChange, onDelete } = props;

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    setIsTaskModalOpen(true);
  }

  function handleSubmit(next: TLoadoDataRow) {
    onChange(next);
    setIsTaskModalOpen(false);
  }

  function handleDelete() {
    setIsTaskModalOpen(false);
    onDelete();
  }

  return (
    <>
      <div
        {...dragHandleProps}
        className={styles['row-label-cell']}
        onContextMenu={handleContextMenu}
      >
        <div className={styles['icon-box']}>
          {row.iconUrl && <img src={row.iconUrl} alt="" />}
        </div>

        {row.name}
      </div>

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
