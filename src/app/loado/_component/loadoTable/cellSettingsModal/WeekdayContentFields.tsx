'use client';

import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import TextInput from '@/components/common/form/TextInput';

import type { TLoadoCellValue } from '@/app/loado/_type/loado';

import styles from './weekdayContentFields.module.scss';

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

export default function WeekdayContentFields(props: {
  cell: TLoadoCellValue;
  onPatch: (updates: Partial<TLoadoCellValue>) => void;
}) {
  const { cell, onPatch } = props;
  const binaryValue =
    cell.checkboxState === 'checked' || cell.checkboxState === 'unchecked'
      ? cell.checkboxState
      : 'unchecked';

  function toggleDay(day: number) {
    const next = cell.weekdays.includes(day)
      ? cell.weekdays.filter((d) => d !== day)
      : [...cell.weekdays, day].sort((a, b) => a - b);
    onPatch({ weekdays: next });
  }

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
          onChange={(checkboxState) => onPatch({ checkboxState })}
        />
      </div>

      <div className={styles['field']}>
        <span className={styles['field-label']}>라벨</span>
        <div className={styles['text-input-wrapper']}>
          <TextInput
            value={cell.checkboxLabel}
            onChange={(checkboxLabel) => onPatch({ checkboxLabel })}
          />
        </div>
      </div>

      <div className={styles['field']}>
        <span className={styles['field-label']}>요일</span>
        <div className={styles['weekday-picker']}>
          {WEEKDAY_LABELS.map((label, i) => (
            <button
              key={i}
              type="button"
              className={`${styles['weekday-button']} ${
                cell.weekdays.includes(i) ? styles['weekday-button-selected'] : ''
              }`}
              onClick={() => toggleDay(i)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
