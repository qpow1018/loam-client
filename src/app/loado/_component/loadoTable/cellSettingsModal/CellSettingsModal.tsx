'use client';

import { useState } from 'react';

import type { TLoadoResetPeriod, TLoadoCellRole, TLoadoCellValue } from '@/app/loado/_type/loado';

import Modal from '@/components/common/modal/Modal';
import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import Tabs from '@/components/common/tabs/Tabs';
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

  const [pendingCell, setPendingCell] = useState<TLoadoCellValue>(cell);
  const patch = (updates: Partial<TLoadoCellValue>) =>
    setPendingCell((prev) => ({ ...prev, ...updates }));

  function handleSubmit() {
    onSubmit(pendingCell);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="할 일 설정" width={800}>
      <div className={styles['cell-settings-modal-content']}>
        <div className={styles['field']}>
          <span className={styles['field-label']}>주기</span>
          <ButtonGroup
            options={PERIOD_OPTIONS}
            value={pendingCell.resetPeriod}
            onChange={(resetPeriod) => patch({ resetPeriod })}
          />
        </div>

        <div className={styles['tabs-section']}>
          <Tabs
            options={TYPE_OPTIONS}
            value={pendingCell.role}
            onChange={(role) => patch({ role })}
          />
        </div>

        {pendingCell.role === 'checkbox' && (
          <CheckboxFields cell={pendingCell} onPatch={patch} />
        )}

        {pendingCell.role === 'text' && <TextFields cell={pendingCell} onPatch={patch} />}

        {pendingCell.role === 'restGauge' && (
          <RestGaugeFields cell={pendingCell} onPatch={patch} />
        )}

        {pendingCell.role === 'weekdayContent' && (
          <WeekdayContentFields cell={pendingCell} onPatch={patch} />
        )}

        <div className={styles['footer']}>
          <button
            type="button"
            className={`${styles['button']} ${styles['button-cancel']}`}
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className={`${styles['button']} ${styles['button-submit']}`}
            onClick={handleSubmit}
          >
            수정
          </button>
        </div>
      </div>
    </Modal>
  );
}
