'use client';

import { useState } from 'react';

import { PERIOD_OPTIONS, TYPE_OPTIONS } from '@/app/maplestory/mapledo/_define/options';
import type { TTaskTableCellValue } from '@/types/taskTable';
import { changeCellRole } from '@/utils/taskTableCell';

import Button from '@/components/common/button/Button';
import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import Modal from '@/components/common/modal/Modal';
import Tabs from '@/components/common/tabs/Tabs';
import FormRow from '@/components/taskTable/FormRow';
import CheckboxFields from './CheckboxFields';
import TextFields from './TextFields';

import styles from './cellSettingsModal.module.scss';

export default function CellSettingsModal(props: {
  isOpen: boolean;
  cell: TTaskTableCellValue;
  onClose: () => void;
  onSubmit: (next: TTaskTableCellValue) => void;
}) {
  const { isOpen, cell, onClose, onSubmit } = props;

  const [tempCellValue, setTempCellValue] = useState<TTaskTableCellValue>(() =>
    normalizeCell(cell),
  );

  function handleSubmit() {
    onSubmit(trimCellValue(tempCellValue));
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="할 일 설정" width={600}>
      <div className={styles['cell-settings-modal-content']}>
        <FormRow label="주기">
          <ButtonGroup
            options={PERIOD_OPTIONS}
            value={tempCellValue.resetPeriod}
            onChange={(resetPeriod) => setTempCellValue((prev) => ({ ...prev, resetPeriod }))}
          />
        </FormRow>

        <div className={styles['tabs-section']}>
          <Tabs
            options={TYPE_OPTIONS}
            value={tempCellValue.role}
            onChange={(role) => setTempCellValue((prev) => changeCellRole(prev, role))}
          />
        </div>

        {tempCellValue.role === 'checkbox' && (
          <CheckboxFields cell={tempCellValue} onChange={setTempCellValue} />
        )}

        {tempCellValue.role === 'text' && (
          <TextFields cell={tempCellValue} onChange={setTempCellValue} />
        )}

        <div className={styles['action-buttons']}>
          <Button theme="bg-gray600" size="large" onClick={onClose}>
            취소
          </Button>
          <Button
            theme="bg-pri"
            size="large"
            className={styles['submit-btn']}
            onClick={handleSubmit}
          >
            수정하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function normalizeCell(cell: TTaskTableCellValue): TTaskTableCellValue {
  if (cell.role === 'checkbox' || cell.role === 'text') return cell;
  return changeCellRole(cell, 'checkbox');
}

function trimCellValue(cell: TTaskTableCellValue): TTaskTableCellValue {
  switch (cell.role) {
    case 'text':
      return { ...cell, text: cell.text.trim() };
    case 'checkbox':
      return { ...cell, checkboxLabel: cell.checkboxLabel.trim() };
    case 'restGauge':
    case 'weekdayContent':
      return cell;
  }
}
