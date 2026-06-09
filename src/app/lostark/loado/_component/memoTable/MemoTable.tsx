'use client';

import { useEffect, useState } from 'react';
import { MdAdd } from 'react-icons/md';

import type { TMemo, TMemoData } from '@/app/lostark/loado/_type/memo';
import {
  getMemoData,
  saveMemoData,
  addMemo,
  updateMemo,
  deleteMemo,
  reorderMemos,
} from '@/app/lostark/loado/_util/memoData';

import DraggableList from '@/components/common/draggableList/DraggableList';
import Button from '@/components/common/button/Button';
import MemoCard from './MemoCard';
import MemoModal from './memoModal/MemoModal';

import styles from './memoTable.module.scss';

export default function MemoTable() {
  const [data, setData] = useState<TMemoData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData(getMemoData());
  }, []);

  useEffect(() => {
    if (data === null) return;
    saveMemoData(data);
  }, [data]);

  function handleAdd(next: TMemo) {
    setData((prev) => (prev === null ? prev : addMemo(prev, next)));
    setIsAddModalOpen(false);
  }

  function handleUpdate(next: TMemo) {
    setData((prev) => (prev === null ? prev : updateMemo(prev, next)));
  }

  function handleDelete(memoId: string) {
    setData((prev) => (prev === null ? prev : deleteMemo(prev, memoId)));
  }

  function handleReorder(memos: TMemo[]) {
    setData((prev) => (prev === null ? prev : reorderMemos(prev, memos)));
  }

  return (
    <div className={styles['memo-table']}>
      <div className={styles['add-btn-wrap']}>
        <Button theme="bd-gray" size="small" onClick={() => setIsAddModalOpen(true)}>
          <MdAdd size={18} />
          <span>메모 추가</span>
        </Button>
      </div>

      {data !== null && (
        <DraggableList<TMemo>
          items={data.memos}
          getId={(m) => m.id}
          direction="vertical"
          onReorder={handleReorder}
          className={styles['memo-list']}
        >
          {(memo, { dragHandleProps }) => (
            <MemoCard
              memo={memo}
              dragHandleProps={dragHandleProps}
              onChange={handleUpdate}
              onDelete={() => handleDelete(memo.id)}
            />
          )}
        </DraggableList>
      )}

      {isAddModalOpen && (
        <MemoModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAdd}
        />
      )}
    </div>
  );
}
