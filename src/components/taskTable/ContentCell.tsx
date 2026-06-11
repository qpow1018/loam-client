'use client';

import { useState } from 'react';

import type { TTaskTableCellValue } from '@/types/taskTable';

import TextEditModal from './textEditModal/TextEditModal';

import styles from './contentCell.module.scss';

import { MdCheckBox, MdCheckBoxOutlineBlank, MdPause } from 'react-icons/md';

type TDisplayState = 'checked' | 'unchecked' | 'skip' | null;

export default function ContentCell(props: {
  cell: TTaskTableCellValue;
  isSkipped: boolean;
  tooltip?: string;
  onChange: (next: TTaskTableCellValue) => void;
  onEdit: () => void;
}) {
  const { cell, isSkipped, tooltip, onChange, onEdit } = props;

  const [isTextEditModalOpen, setIsTextEditModalOpen] = useState(false);

  const displayedState: TDisplayState =
    cell.role === 'text' ? null : isSkipped ? 'skip' : cell.checkboxState;
  const displayedText = cell.role === 'text' ? cell.text : cell.checkboxLabel;

  function handleClick() {
    if (cell.role === 'text') {
      setIsTextEditModalOpen(true);
      return;
    }
    if (isSkipped) return;

    onChange({
      ...cell,
      checkboxState: cell.checkboxState === 'checked' ? 'unchecked' : 'checked',
    });
  }

  function handleSaveText(next: string) {
    if (cell.role !== 'text') return;
    onChange({ ...cell, text: next });
    setIsTextEditModalOpen(false);
  }

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    onEdit();
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

        {tooltip && <span className={styles['tooltip']}>{tooltip}</span>}
      </div>

      {isTextEditModalOpen && cell.role === 'text' && (
        <TextEditModal
          isOpen={isTextEditModalOpen}
          onClose={() => setIsTextEditModalOpen(false)}
          initialText={cell.text}
          onSubmit={handleSaveText}
        />
      )}
    </>
  );
}

function renderStateIcon(state: TDisplayState) {
  switch (state) {
    case 'checked':
      return <MdCheckBox size={18} />;
    case 'unchecked':
      return <MdCheckBoxOutlineBlank size={18} />;
    case 'skip':
      return <MdPause size={18} />;
    case null:
      return null;
  }
}
