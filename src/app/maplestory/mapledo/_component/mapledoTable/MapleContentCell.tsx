'use client';

import { useState } from 'react';

import { TASK_TABLE_CYCLE_POLICIES } from '@/define/taskTable';
import type { TTaskTableCellValue } from '@/types/taskTable';
import { commitCellWrite } from '@/utils/taskTableCell';
import { isWeekdayActive } from '@/utils/taskTableCycle';
import ContentCell from '@/components/taskTable/ContentCell';
import CellSettingsModal from './cellSettingsModal/CellSettingsModal';

const CYCLE_POLICY = TASK_TABLE_CYCLE_POLICIES.maplestory;

export default function MapleContentCell(props: {
  cell: TTaskTableCellValue;
  onChange: (next: TTaskTableCellValue) => void;
}) {
  const { cell, onChange } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isSkipped = cell.role === 'weekdayContent' && !isWeekdayActive(cell.weekdays, CYCLE_POLICY);

  function handleChange(next: TTaskTableCellValue) {
    onChange(commitCellWrite(next, CYCLE_POLICY));
  }

  function handleCellSettingsSubmit(next: TTaskTableCellValue) {
    handleChange(next);
    setIsModalOpen(false);
  }

  return (
    <>
      <ContentCell
        cell={cell}
        isSkipped={isSkipped}
        onChange={handleChange}
        onEdit={() => setIsModalOpen(true)}
      />
      {isModalOpen && (
        <CellSettingsModal
          isOpen={isModalOpen}
          cell={cell}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCellSettingsSubmit}
        />
      )}
    </>
  );
}
