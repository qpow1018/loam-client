'use client';

import { useState } from 'react';

import type { TLoadoCellValue } from '@/app/loado/_type/loado';
import { getCurrentCycleKey, isWeekdayActive } from '@/app/loado/_util/cycleKey';

import CellSettingsModal from './cellSettingsModal/CellSettingsModal';
import TextEditModal from './textEditModal/TextEditModal';

import styles from './contentCell.module.scss';

import { MdCheckBox, MdCheckBoxOutlineBlank, MdPause } from 'react-icons/md';

type TDisplayState = 'checked' | 'unchecked' | 'skip' | null;

export default function ContentCell(props: {
  cell: TLoadoCellValue;
  onChange: (next: TLoadoCellValue) => void;
}) {
  const { cell, onChange } = props;

  const [isTextEditModalOpen, setIsTextEditModalOpen] = useState(false);
  const [isCellSettingsModalOpen, setIsCellSettingsModalOpen] = useState(false);

  const isInactiveWeekday = cell.role === 'weekdayContent' && !isWeekdayActive(cell.weekdays);
  const isRestGaugeBelowThreshold =
    cell.role === 'restGauge' && cell.restGauge < cell.restGaugeSkipThreshold;

  const shouldSkip = isInactiveWeekday || isRestGaugeBelowThreshold;
  const displayedState: TDisplayState =
    cell.role === 'text' ? null : shouldSkip ? 'skip' : cell.checkboxState;

  const displayedText = cell.role === 'text' ? cell.text : cell.checkboxLabel;

  function handleClick() {
    if (cell.role === 'text') {
      setIsTextEditModalOpen(true);
      return;
    }
    if (shouldSkip) return;
    onChange({
      ...cell,
      checkboxState: cell.checkboxState === 'checked' ? 'unchecked' : 'checked',
    });
  }

  function handleSaveText(next: string) {
    if (cell.role !== 'text') return;
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
          <span className={styles['tooltip']}>휴식게이지 {cell.restGauge}</span>
        )}
      </div>

      {isTextEditModalOpen && cell.role === 'text' && (
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

function renderStateIcon(state: TDisplayState) {
  switch (state) {
    case 'checked':
      return <MdCheckBox size={20} />;
    case 'unchecked':
      return <MdCheckBoxOutlineBlank size={20} />;
    case 'skip':
      return <MdPause size={20} />;
    case null:
      return null;
  }
}
