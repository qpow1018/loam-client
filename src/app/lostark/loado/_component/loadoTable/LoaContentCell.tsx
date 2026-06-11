'use client';

import { useState } from 'react';

import type { TTaskTableCellValue } from '@/types/taskTable';
import { isWeekdayActive } from '@/app/lostark/loado/_util/cycleKey';
import { commitCellWrite } from '@/app/lostark/loado/_util/cell';

import ContentCell from '@/components/taskTable/ContentCell';
import CellSettingsModal from './cellSettingsModal/CellSettingsModal';

export default function LoaContentCell(props: {
  cell: TTaskTableCellValue;
  onChange: (next: TTaskTableCellValue) => void;
}) {
  const { cell, onChange } = props;

  const [isCellSettingsModalOpen, setIsCellSettingsModalOpen] = useState(false);

  const isInactiveWeekday = cell.role === 'weekdayContent' && !isWeekdayActive(cell.weekdays);
  const isRestGaugeBelowThreshold =
    cell.role === 'restGauge' && cell.restGauge < cell.restGaugeSkipThreshold;
  const isSkipped = isInactiveWeekday || isRestGaugeBelowThreshold;
  const tooltip = cell.role === 'restGauge' ? `휴식게이지 ${cell.restGauge}` : undefined;

  function handleChange(next: TTaskTableCellValue) {
    onChange(commitCellWrite(next));
  }

  function handleCellSettingsSubmit(next: TTaskTableCellValue) {
    handleChange(next);
    setIsCellSettingsModalOpen(false);
  }

  return (
    <>
      <ContentCell
        cell={cell}
        isSkipped={isSkipped}
        tooltip={tooltip}
        onChange={handleChange}
        onEdit={() => setIsCellSettingsModalOpen(true)}
      />

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
