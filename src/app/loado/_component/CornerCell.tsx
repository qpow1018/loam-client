'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';

import styles from './cornerCell.module.scss';

export default function CornerCell(props: {
  onAddCharacter: () => void;
  onClickAddTask: () => void;
  onAddDivider: () => void;
}) {
  const { onAddCharacter, onClickAddTask, onAddDivider } = props;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handlePointerDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsMenuOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  function selectAndClose(action: () => void) {
    action();
    setIsMenuOpen(false);
  }

  return (
    <div className={styles['corner-cell']} ref={containerRef}>
      <button
        type="button"
        className={styles['add-button']}
        onClick={() => setIsMenuOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={isMenuOpen}
        aria-label="추가 메뉴 열기"
      >
        <Plus size={18} />
      </button>

      {isMenuOpen && (
        <ul className={styles['menu']} role="menu">
          <li>
            <button
              type="button"
              role="menuitem"
              className={styles['menu-item']}
              onClick={() => selectAndClose(onAddCharacter)}
            >
              캐릭터 추가
            </button>
          </li>
          <li>
            <button
              type="button"
              role="menuitem"
              className={styles['menu-item']}
              onClick={() => selectAndClose(onClickAddTask)}
            >
              할일 추가
            </button>
          </li>
          <li>
            <button
              type="button"
              role="menuitem"
              className={styles['menu-item']}
              onClick={() => selectAndClose(onAddDivider)}
            >
              할일 구분선 추가
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
