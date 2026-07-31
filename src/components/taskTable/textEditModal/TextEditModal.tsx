'use client';

import { useState } from 'react';

import Button from '@/components/common/button/Button';
import Textarea from '@/components/common/form/Textarea';
import Modal from '@/components/common/modal/Modal';

import styles from './textEditModal.module.scss';

export default function TextEditModal(props: {
  isOpen: boolean;
  initialText: string;
  onClose: () => void;
  onSubmit: (next: string) => void;
}) {
  const { isOpen, initialText, onClose, onSubmit } = props;

  const [value, setValue] = useState(initialText);

  function handleSave() {
    onSubmit(value.trim());
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="텍스트 수정" width={480}>
      <div className={styles['text-edit-modal-content']}>
        <Textarea
          autoFocus
          isCursorAtEndOnAutoFocus
          isAutoHeight
          rows={2}
          value={value}
          onChange={setValue}
        />

        <div className={styles['action-buttons']}>
          <Button color="gray" fill="solid" size="large" onClick={onClose}>
            취소
          </Button>
          <Button
            color="mint"
            fill="solid"
            size="large"
            className={styles['submit-btn']}
            onClick={handleSave}
          >
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}
