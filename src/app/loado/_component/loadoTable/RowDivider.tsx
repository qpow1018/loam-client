'use client';

import { useState } from 'react';

import type { TDragHandleProps } from '@/components/common/draggableList/DraggableList';
import Confirm from '@/components/common/modal/Confirm';

import styles from './rowDivider.module.scss';

export default function RowDivider(props: {
  dragHandleProps: TDragHandleProps;
  onDelete: () => void;
}) {
  const { dragHandleProps, onDelete } = props;

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    setIsConfirmOpen(true);
  }

  return (
    <>
      <div
        {...dragHandleProps}
        className={styles['row-divider']}
        onContextMenu={handleContextMenu}
      />

      <Confirm
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="구분선 삭제"
        message="이 구분선을 삭제하시겠어요?"
        buttons={[
          {
            label: '취소',
            theme: 'bg-gray600',
            onClick: () => setIsConfirmOpen(false),
          },
          {
            label: '삭제',
            theme: 'bg-sec',
            onClick: () => {
              setIsConfirmOpen(false);
              onDelete();
            },
          },
        ]}
      />
    </>
  );
}
