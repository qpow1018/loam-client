'use client';

import { LOADO_ICONS } from '@/app/lostark/loado/_define/loadoIcons';

import Modal from '@/components/common/modal/Modal';

import styles from './iconPickerModal.module.scss';

export default function IconPickerModal(props: {
  isOpen: boolean;
  onClose: () => void;
  value?: string;
  onSelect: (url: string | undefined) => void;
}) {
  const { isOpen, onClose, value, onSelect } = props;

  function handleSelect(url: string | undefined) {
    onSelect(url);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="아이콘 선택" width={680}>
      <div className={styles['icon-picker-content']}>
        <button
          type="button"
          className={`${styles['icon-btn']} ${styles['none-btn']} ${value === undefined ? styles['selected'] : ''}`}
          onClick={() => handleSelect(undefined)}
        >
          없음
        </button>
        {LOADO_ICONS.map((url) => (
          <button
            key={url}
            type="button"
            className={`${styles['icon-btn']} ${value === url ? styles['selected'] : ''}`}
            onClick={() => handleSelect(url)}
          >
            <img src={url} alt="" />
          </button>
        ))}
      </div>
    </Modal>
  );
}
