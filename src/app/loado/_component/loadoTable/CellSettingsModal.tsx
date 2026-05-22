'use client';

import { useState } from 'react';

import Modal from '@/components/common/modal/Modal';
import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import Tabs from '@/components/common/tabs/Tabs';
import TextInput from '@/components/common/form/TextInput';

import type {
  TLoadoCellRole,
  TLoadoCellValue,
  TLoadoDataRow,
  TLoadoResetPeriod,
} from '@/app/loado/_type/loado';

import styles from './cellSettingsModal.module.scss';

const PERIOD_OPTIONS: { value: TLoadoResetPeriod['kind']; label: string }[] = [
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
  row: TLoadoDataRow;
  cell: TLoadoCellValue;
  onClose: () => void;
  onSubmit: (next: TLoadoCellValue) => void;
}) {
  const { isOpen, cell, onClose, onSubmit } = props;

  const [periodKind, setPeriodKind] = useState<TLoadoResetPeriod['kind']>(cell.resetPeriod.kind);
  const [cellKind, setCellKind] = useState<TLoadoCellRole>(cell.kind);
  const [checkboxState, setCheckboxState] = useState<TLoadoCellValue['checkboxState']>(
    cell.checkboxState,
  );
  const [text, setText] = useState(cell.text);

  function handleSubmit() {
    onSubmit({
      ...cell,
      kind: cellKind,
      resetPeriod: { kind: periodKind },
      checkboxState,
      text,
    });
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="할 일 설정" width={800}>
      <div className={styles['cell-settings-modal-content']}>
        <div className={styles['field']}>
          <span className={styles['field-label']}>주기</span>
          <ButtonGroup options={PERIOD_OPTIONS} value={periodKind} onChange={setPeriodKind} />
        </div>

        <div className={styles['tabs-section']}>
          <Tabs options={TYPE_OPTIONS} value={cellKind} onChange={setCellKind} />
        </div>

        {cellKind === 'checkbox' && (
          <CheckboxFields
            checkboxState={checkboxState}
            onCheckboxStateChange={setCheckboxState}
            text={text}
            onTextChange={setText}
          />
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

function CheckboxFields(props: {
  checkboxState: TLoadoCellValue['checkboxState'];
  onCheckboxStateChange: (next: TLoadoCellValue['checkboxState']) => void;
  text: string;
  onTextChange: (next: string) => void;
}) {
  const { checkboxState, onCheckboxStateChange, text, onTextChange } = props;
  const binaryValue =
    checkboxState === 'checked' || checkboxState === 'unchecked' ? checkboxState : 'unchecked';

  return (
    <>
      <div className={styles['field']}>
        <span className={styles['field-label']}>상태</span>
        <ButtonGroup
          options={[
            { value: 'unchecked', label: '미체크' },
            { value: 'checked', label: '체크' },
          ]}
          value={binaryValue}
          onChange={onCheckboxStateChange}
        />
      </div>

      <div className={styles['field']}>
        <span className={styles['field-label']}>텍스트</span>
        <div className={styles['text-input-wrapper']}>
          <TextInput value={text} onChange={onTextChange} />
        </div>
      </div>
    </>
  );
}
