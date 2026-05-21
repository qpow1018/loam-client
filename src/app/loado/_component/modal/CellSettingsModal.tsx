'use client';

import Modal from '@/components/common/modal/Modal';

import type { TLoadoCellValue, TLoadoDataRow } from '@/app/loado/_type/loado';

import styles from './cellSettingsModal.module.scss';

export default function CellSettingsModal(props: {
  isOpen: boolean;
  row: TLoadoDataRow;
  cell: TLoadoCellValue;
  onClose: () => void;
  onSubmit: (next: TLoadoCellValue) => void;
}) {
  const { isOpen, onClose } = props;

  function handleSubmit() {
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="할 일 설정" width={800}>
      <div className={styles['content']}>{/* 필드 추가 영역 */}</div>

      <div className={styles['footer']}>
        <button
          type="button"
          className={`${styles['button']} ${styles['button-cancel']}`}
          onClick={onClose}
        >
          취소
        </button>
        <button
          type="button"
          className={`${styles['button']} ${styles['button-submit']}`}
          onClick={handleSubmit}
        >
          수정
        </button>
      </div>
    </Modal>
  );
}
