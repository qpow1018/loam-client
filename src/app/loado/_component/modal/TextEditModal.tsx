'use client';

import { useState } from 'react';

import Modal from '@/components/common/modal/Modal';

import styles from './textEditModal.module.scss';

export default function TextEditModal(props: {
  isOpen: boolean;
  initialText: string;
  onClose: () => void;
  onSubmit: (next: string) => void;
}) {
  const { isOpen, initialText, onClose, onSubmit } = props;

  const [draft, setDraft] = useState(initialText);

  function handleSave() {
    onSubmit(draft);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="텍스트 수정" width={480}>
      <div className={styles['edit-content']}>
        <input
          type="text"
          autoFocus
          className={styles['edit-input']}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
          }}
        />
      </div>

      <div className={styles['edit-footer']}>
        <button
          type="button"
          className={`${styles['edit-button']} ${styles['edit-button-cancel']}`}
          onClick={onClose}
        >
          취소
        </button>
        <button
          type="button"
          className={`${styles['edit-button']} ${styles['edit-button-save']}`}
          onClick={handleSave}
        >
          저장
        </button>
      </div>
    </Modal>
  );
}
