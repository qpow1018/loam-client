'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MdDeleteOutline } from 'react-icons/md';

import type { TMemo } from '@/app/loado/_type/memo';

import Modal from '@/components/common/modal/Modal';
import Confirm from '@/components/common/modal/Confirm';
import Button from '@/components/common/button/Button';
import IconButton from '@/components/common/button/IconButton';
import Textarea from '@/components/common/form/Textarea';

import styles from './memoModal.module.scss';

export default function MemoModal(props: {
  isOpen: boolean;
  onClose: () => void;
  editingData?: TMemo;
  onSubmit: (memo: TMemo) => void;
  onDelete?: () => void;
}) {
  const { isOpen, onClose, editingData, onSubmit, onDelete } = props;

  const [content, setContent] = useState(editingData?.content ?? '');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isEditMode = editingData !== undefined;
  const isSaveDisabled = content.trim() === '';

  function handleSave() {
    if (isSaveDisabled) return;
    const trimmedContent = content.trim();
    onSubmit({
      id: editingData?.id ?? uuidv4(),
      content: trimmedContent,
    });
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEditMode ? '메모 수정' : '메모 추가'}
        width={480}
      >
        <div className={styles['memo-modal-content']}>
          <Textarea
            autoFocus
            rows={8}
            placeholder="메모를 입력하세요"
            value={content}
            onChange={setContent}
          />

          <div className={styles['action-buttons']}>
            {isEditMode && onDelete !== undefined && (
              <IconButton
                size="large"
                className={styles['delete-btn']}
                onClick={() => setIsConfirmOpen(true)}
              >
                <MdDeleteOutline />
              </IconButton>
            )}

            <Button theme="bg-gray600" size="large" onClick={onClose}>
              취소
            </Button>
            <Button
              theme="bg-pri"
              size="large"
              className={styles['submit-btn']}
              onClick={handleSave}
              isDisabled={isSaveDisabled}
            >
              저장
            </Button>
          </div>
        </div>
      </Modal>

      {isEditMode && onDelete !== undefined && (
        <Confirm
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          title="메모 삭제"
          message="이 메모를 삭제하시겠어요?"
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
      )}
    </>
  );
}
