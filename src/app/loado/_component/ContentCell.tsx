'use client';

import { useState } from 'react';

import type { TLoadoCellValue, TLoadoDataRow } from '@/app/loado/_type/loado';
import { getCurrentCycleKey } from '@/app/loado/_util/cycleKey';

import CellSettingsModal from './modal/CellSettingsModal';
import TextEditModal from './modal/TextEditModal';

import styles from './contentCell.module.scss';

import { MdCheckBox, MdCheckBoxOutlineBlank, MdPause } from 'react-icons/md';

export default function ContentCell(props: {
  row: TLoadoDataRow;
  cell: TLoadoCellValue;
  onChange: (next: TLoadoCellValue) => void;
}) {
  const { row, cell, onChange } = props;

  const [isTextEditModalOpen, setIsTextEditModalOpen] = useState(false);
  const [isCellSettingsModalOpen, setIsCellSettingsModalOpen] = useState(false);

  function handleClick() {
    switch (row.cellRole) {
      case 'checkbox':
      case 'restGauge':
        toggleCheckbox();
        break;
      case 'text':
        setIsTextEditModalOpen(true);
        break;
    }
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
      cycleKey: getCurrentCycleKey(row.resetPeriod),
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
        {renderStateIcon(cell.checkboxState)}

        {cell.text && <span className={styles['text']}>{cell.text}</span>}

        {row.cellRole === 'restGauge' && (
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
          row={row}
          cell={cell}
          onClose={() => setIsCellSettingsModalOpen(false)}
          onSubmit={handleCellSettingsSubmit}
        />
      )}
    </>
  );
}

function renderStateIcon(state: TLoadoCellValue['checkboxState']) {
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
