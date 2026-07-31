'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { MdDeleteOutline } from 'react-icons/md';

import type { TMemo } from '@/types/memo';

import Modal from '@/components/common/modal/Modal';
import Confirm from '@/components/common/modal/Confirm';
import Button from '@/components/common/button/Button';
import IconButton from '@/components/common/button/IconButton';
import TextInput from '@/components/common/form/TextInput';
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

  const [title, setTitle] = useState(editingData?.title ?? '');
  const [content, setContent] = useState(editingData?.content ?? '');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isEditMode = editingData !== undefined;
  const isSaveDisabled = content.trim() === '';

  function handleSave() {
    if (isSaveDisabled) return;
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    onSubmit({
      id: editingData?.id ?? uuidv4(),
      title: trimmedTitle || undefined,
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
          <TextInput
            value={title}
            onChange={setTitle}
            placeholder="제목을 입력하세요 (선택)"
            className={styles['title-input']}
          />

          <Textarea
            autoFocus
            isCursorAtEndOnAutoFocus
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

            <Button color="gray" fill="solid" size="large" onClick={onClose}>
              취소
            </Button>
            <Button
              color="mint"
              fill="solid"
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
              color: 'gray',
              fill: 'solid',
              onClick: () => setIsConfirmOpen(false),
            },
            {
              label: '삭제',
              color: 'rose',
              fill: 'solid',
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
