'use client';

import { useState } from 'react';

import type { TMemo } from '@/types/memo';

import type { TDragHandleProps } from '@/components/common/draggableList/DraggableList';
import MemoModal from './memoModal/MemoModal';

import styles from './memoCard.module.scss';

import { MdDragIndicator } from 'react-icons/md';

export default function MemoCard(props: {
  memo: TMemo;
  dragHandleProps: TDragHandleProps;
  onChange: (next: TMemo) => void;
  onDelete: () => void;
}) {
  const { memo, dragHandleProps, onChange, onDelete } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleSubmit(next: TMemo) {
    onChange(next);
    setIsModalOpen(false);
  }

  function handleDelete() {
    setIsModalOpen(false);
    onDelete();
  }

  return (
    <>
      <div className={styles['memo-card']}>
        <p className={styles['memo-content']} onClick={() => setIsModalOpen(true)}>
          {memo.content}
        </p>

        <div
          {...dragHandleProps}
          className={styles['drag-handle']}
          aria-label="드래그하여 순서 변경"
        >
          <MdDragIndicator size={18} />
        </div>
      </div>

      {isModalOpen && (
        <MemoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editingData={memo}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
