'use client';

import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import Modal from '@/components/common/modal/Modal';

import type { TLoadoDataRow } from '@/app/loado/_type/loado';

import styles from './taskModal.module.scss';

export default function TaskModal(props: {
  isOpen: boolean;
  onClose: () => void;
  editingData?: TLoadoDataRow;
  onSubmit: (row: TLoadoDataRow) => void;
  onDelete?: () => void;
}) {
  const { isOpen, onClose, editingData, onSubmit, onDelete } = props;

  const isEdit = editingData !== undefined;

  const [name, setName] = useState(editingData?.name ?? '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const trimmedName = name.trim();
  const isSaveDisabled = trimmedName === '';

  function handleSave() {
    if (isSaveDisabled) return;
    if (isEdit && editingData !== undefined) {
      onSubmit({ ...editingData, name: trimmedName });
    } else {
      onSubmit({
        kind: 'data',
        id: uuidv4(),
        name: trimmedName,
        resetPeriod: { kind: 'daily' },
        cellRole: 'checkbox',
      });
    }
  }

  function handleDelete() {
    if (onDelete !== undefined) onDelete();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? '할일 수정' : '할일 추가'} width={680}>
      <div className={styles['body']}>
        <label className={styles['field']}>
          <span className={styles['field-label']}>이름</span>
          <input
            ref={inputRef}
            type="text"
            className={styles['field-input']}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="할일 이름"
          />
        </label>
      </div>

      <div className={styles['footer']}>
        {isEdit && (
          <button
            type="button"
            className={`${styles['button']} ${styles['button-delete']}`}
            onClick={handleDelete}
          >
            삭제
          </button>
        )}
        <div className={styles['footer-spacer']} />
        <button
          type="button"
          className={`${styles['button']} ${styles['button-cancel']}`}
          onClick={onClose}
        >
          취소
        </button>
        <button
          type="button"
          className={`${styles['button']} ${styles['button-save']}`}
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          저장
        </button>
      </div>
    </Modal>
  );
}
