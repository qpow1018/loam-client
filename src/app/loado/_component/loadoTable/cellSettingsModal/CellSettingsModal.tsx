'use client';

import { useState } from 'react';

import type { TLoadoResetPeriod, TLoadoCellRole, TLoadoCellValue } from '@/app/loado/_type/loado';

import Modal from '@/components/common/modal/Modal';
import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import Tabs from '@/components/common/tabs/Tabs';
import Button from '@/components/common/button/Button';
import FormRow from './FormRow';
import CheckboxFields from './CheckboxFields';
import TextFields from './TextFields';
import RestGaugeFields from './RestGaugeFields';
import WeekdayContentFields from './WeekdayContentFields';

import styles from './cellSettingsModal.module.scss';

const PERIOD_OPTIONS: { value: TLoadoResetPeriod; label: string }[] = [
  { value: 'permanent', label: '무기한' },
  { value: 'daily', label: '일일' },
  { value: 'weekly', label: '주간' },
];

const TYPE_OPTIONS: { value: TLoadoCellRole; label: string }[] = [
  { value: 'checkbox', label: '체크박스' },
  { value: 'text', label: '텍스트' },
  { value: 'restGauge', label: '휴식게이지' },
  { value: 'weekdayContent', label: '요일 컨텐츠' },
];

export default function CellSettingsModal(props: {
  isOpen: boolean;
  cell: TLoadoCellValue;
  onClose: () => void;
  onSubmit: (next: TLoadoCellValue) => void;
}) {
  const { isOpen, cell, onClose, onSubmit } = props;

  const [tempCellValue, setTempCellValue] = useState<TLoadoCellValue>(cell);

  function handleChangeTempCellValue(updates: Partial<TLoadoCellValue>) {
    setTempCellValue((prev) => ({ ...prev, ...updates }));
  }

  function handleSubmit() {
    onSubmit(tempCellValue);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="할 일 설정" width={600}>
      <div className={styles['cell-settings-modal-content']}>
        <FormRow label="주기">
          <ButtonGroup
            options={PERIOD_OPTIONS}
            value={tempCellValue.resetPeriod}
            onChange={(resetPeriod) => handleChangeTempCellValue({ resetPeriod })}
          />
        </FormRow>

        <div className={styles['tabs-section']}>
          <Tabs
            options={TYPE_OPTIONS}
            value={tempCellValue.role}
            onChange={(role) => handleChangeTempCellValue({ role })}
          />
        </div>

        {tempCellValue.role === 'checkbox' && (
          <CheckboxFields cell={tempCellValue} onChangeTempCellValue={handleChangeTempCellValue} />
        )}

        {tempCellValue.role === 'text' && (
          <TextFields cell={tempCellValue} onChangeTempCellValue={handleChangeTempCellValue} />
        )}

        {tempCellValue.role === 'restGauge' && (
          <RestGaugeFields cell={tempCellValue} onChangeTempCellValue={handleChangeTempCellValue} />
        )}

        {tempCellValue.role === 'weekdayContent' && (
          <WeekdayContentFields
            cell={tempCellValue}
            onChangeTempCellValue={handleChangeTempCellValue}
          />
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
