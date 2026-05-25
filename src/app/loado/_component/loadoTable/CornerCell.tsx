'use client';

import { useEffect, useRef, useState } from 'react';
import { MdAdd } from 'react-icons/md';

import type { TLoadoColumn, TLoadoDataRow } from '@/app/loado/_type/loado';
import CharacterModal from './characterModal/CharacterModal';
import TaskModal from './taskModal/TaskModal';

import styles from './cornerCell.module.scss';

export default function CornerCell(props: {
  onAddCharacter: (column: TLoadoColumn) => void;
  onAddTask: (row: TLoadoDataRow) => void;
  onAddDivider: () => void;
}) {
  const { onAddCharacter, onAddTask, onAddDivider } = props;

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
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

  function handleCharacterSubmit(next: TLoadoColumn) {
    onAddCharacter(next);
    setIsCharacterModalOpen(false);
  }

  function handleTaskSubmit(next: TLoadoDataRow) {
    onAddTask(next);
    setIsTaskModalOpen(false);
  }

  return (
    <>
      <div className={styles['corner-cell']} ref={containerRef}>
        <button
          type="button"
          className={styles['add-button']}
          onClick={() => setIsMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          aria-label="추가 메뉴 열기"
        >
          <MdAdd size={18} />
        </button>

        {isMenuOpen && (
          <ul className={styles['menu']} role="menu">
            <li>
              <button
                type="button"
                role="menuitem"
                className={styles['menu-item']}
                onClick={() => selectAndClose(() => setIsCharacterModalOpen(true))}
              >
                캐릭터 추가
              </button>
            </li>
            <li>
              <button
                type="button"
                role="menuitem"
                className={styles['menu-item']}
                onClick={() => selectAndClose(() => setIsTaskModalOpen(true))}
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

      {isCharacterModalOpen && (
        <CharacterModal
          isOpen={isCharacterModalOpen}
          onClose={() => setIsCharacterModalOpen(false)}
          onSubmit={handleCharacterSubmit}
        />
      )}

      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSubmit={handleTaskSubmit}
        />
      )}
    </>
  );
}
