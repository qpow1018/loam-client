'use client';

import { useState } from 'react';

import type { TLoadoCellValue, TLoadoCheckboxState } from '@/app/loado/_type/loado';
import { getCurrentCycleKey, isWeekdayActive } from '@/app/loado/_util/cycleKey';

import CellSettingsModal from './cellSettingsModal/CellSettingsModal';
import TextEditModal from './textEditModal/TextEditModal';

import styles from './contentCell.module.scss';

import { MdCheckBox, MdCheckBoxOutlineBlank, MdPause } from 'react-icons/md';

export default function ContentCell(props: {
  cell: TLoadoCellValue;
  onChange: (next: TLoadoCellValue) => void;
}) {
  const { cell, onChange } = props;

  const [isTextEditModalOpen, setIsTextEditModalOpen] = useState(false);
  const [isCellSettingsModalOpen, setIsCellSettingsModalOpen] = useState(false);

  const isInactiveWeekday =
    cell.role === 'weekdayContent' && !isWeekdayActive(cell.weekdays);

  const displayedState: TLoadoCheckboxState = isInactiveWeekday ? 'skip' : cell.checkboxState;

  const displayedText = cell.role === 'text' ? cell.text : cell.checkboxLabel;

  function handleClick() {
    if (cell.role === 'text') {
      setIsTextEditModalOpen(true);
      return;
    }
    if (isInactiveWeekday) return;
    toggleCheckbox();
  }

  function toggleCheckbox() {
    if (cell.checkboxState !== 'checked' && cell.checkboxState !== 'unchecked') return;
    onChange({
      ...cell,
      checkboxState: cell.checkboxState === 'checked' ? 'unchecked' : 'checked',
    });
  }

  function handleSaveText(next: string) {
    onChange({
      ...cell,
      text: next,
      cycleKey: getCurrentCycleKey(cell.resetPeriod),
    });
    setIsTextEditModalOpen(false);
  }

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    setIsCellSettingsModalOpen(true);
  }

  function handleCellSettingsSubmit(next: TLoadoCellValue) {
    onChange(next);
    setIsCellSettingsModalOpen(false);
  }

  return (
    <>
      <div
        className={styles['content-cell']}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        {renderStateIcon(displayedState)}

        {displayedText && <span className={styles['text']}>{displayedText}</span>}

        {cell.role === 'restGauge' && (
          <span className={styles['tooltip']}>휴식게이지 {cell.restGauge ?? 0}</span>
        )}
      </div>

      {isTextEditModalOpen && (
        <TextEditModal
          isOpen={isTextEditModalOpen}
          onClose={() => setIsTextEditModalOpen(false)}
          initialText={cell.text}
          onSubmit={handleSaveText}
        />
      )}

      {isCellSettingsModalOpen && (
        <CellSettingsModal
          isOpen={isCellSettingsModalOpen}
          cell={cell}
          onClose={() => setIsCellSettingsModalOpen(false)}
          onSubmit={handleCellSettingsSubmit}
        />
      )}
    </>
  );
}

function renderStateIcon(state: TLoadoCheckboxState) {
  switch (state) {
    case 'checked':
      return <MdCheckBox size={20} />;
    case 'unchecked':
      return <MdCheckBoxOutlineBlank size={20} />;
    case 'skip':
      return <MdPause size={20} />;
    default:
      return null;
  }
}
