'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

import styles from './modal.module.scss';

export default function Modal(props: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  isShowCloseButton?: boolean;
  isDismissable?: boolean;
  width?: number;
}) {
  const {
    isOpen,
    onClose,
    children,
    title,
    isShowCloseButton = true,
    isDismissable = true,
    width = 480,
  } = props;

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen || !isDismissable) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isDismissable, onClose]);

  if (!isOpen) return null;

  function handleBackdropMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    if (!isDismissable) return;
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className={styles['modal-backdrop']} onMouseDown={handleBackdropMouseDown}>
      <div className={styles['modal']} style={{ width }}>
        {title !== undefined && (
          <div className={styles['header']}>
            <p className={styles['header-title']}>{title}</p>
          </div>
        )}

        {isShowCloseButton && (
          <button
            type="button"
            className={styles['close-button']}
            onClick={onClose}
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        )}

        {children}
      </div>
    </div>
  );
}
