'use client';

import { useEffect, useRef } from 'react';
import { MdClose } from 'react-icons/md';

import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

import styles from './modal.module.scss';

// ESC 시 가장 최근에 열린 dismissable Modal 하나만 닫기 위해 열린 순서대로 추적
const openModalStack: symbol[] = [];

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

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen || !isDismissable) return;

    const token = Symbol();
    openModalStack.push(token);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      if (openModalStack[openModalStack.length - 1] !== token) return;
      onCloseRef.current();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const idx = openModalStack.indexOf(token);
      if (idx !== -1) openModalStack.splice(idx, 1);
    };
  }, [isOpen, isDismissable]);

  if (!isOpen) return null;

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!isDismissable) return;
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className={styles['modal-backdrop']} onClick={handleBackdropClick}>
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
            <MdClose size={20} />
          </button>
        )}

        <div className={styles['body']}>{children}</div>
      </div>
    </div>
  );
}
