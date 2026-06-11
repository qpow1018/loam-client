'use client';

import { useState } from 'react';

import type { TTaskTableColumn, TTaskTableDataRow } from '@/types/taskTable';

import IconButton from '@/components/common/button/IconButton';
import DropdownMenu from '@/components/common/dropdownMenu/DropdownMenu';
import CharacterModal from './characterModal/CharacterModal';
import TaskModal from './taskModal/TaskModal';

import styles from './cornerCell.module.scss';

import { MdAdd } from 'react-icons/md';

export default function CornerCell(props: {
  onAddCharacter: (column: TTaskTableColumn) => void;
  onAddTask: (row: TTaskTableDataRow) => void;
  onAddDivider: () => void;
}) {
  const { onAddCharacter, onAddTask, onAddDivider } = props;

  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  function handleCharacterSubmit(next: TTaskTableColumn) {
    onAddCharacter(next);
    setIsCharacterModalOpen(false);
  }

  function handleTaskSubmit(next: TTaskTableDataRow) {
    onAddTask(next);
    setIsTaskModalOpen(false);
  }

  return (
    <>
      <div className={styles['corner-cell']}>
        <DropdownMenu
          trigger={({ toggle }) => (
            <IconButton size="small" onClick={toggle}>
              <MdAdd />
            </IconButton>
          )}
          items={[
            { label: '캐릭터 추가', onClick: () => setIsCharacterModalOpen(true) },
            { label: '할일 추가', onClick: () => setIsTaskModalOpen(true) },
            { label: '할일 구분선 추가', onClick: onAddDivider },
          ]}
        />
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
