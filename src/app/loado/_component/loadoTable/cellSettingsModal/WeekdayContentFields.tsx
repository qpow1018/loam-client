'use client';

import type { TLoadoCellValue } from '@/app/loado/_type/loado';

import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import TextInput from '@/components/common/form/TextInput';
import FormRow from '@/app/loado/_component/loadoTable/FormRow';

import styles from './weekdayContentFields.module.scss';

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

export default function WeekdayContentFields(props: {
  cell: TLoadoCellValue;
  onChangeTempCellValue: (updates: Partial<TLoadoCellValue>) => void;
}) {
  const { cell, onChangeTempCellValue } = props;

  const binaryValue =
    cell.checkboxState === 'checked' || cell.checkboxState === 'unchecked'
      ? cell.checkboxState
      : 'unchecked';

  function toggleDay(day: number) {
    const next = cell.weekdays.includes(day)
      ? cell.weekdays.filter((d) => d !== day)
      : [...cell.weekdays, day].sort((a, b) => a - b);
    onChangeTempCellValue({ weekdays: next });
  }

  return (
    <>
      <FormRow label="상태">
        <ButtonGroup
          options={[
            { value: 'unchecked', label: '미체크' },
            { value: 'checked', label: '체크' },
          ]}
          value={binaryValue}
          onChange={(checkboxState) => onChangeTempCellValue({ checkboxState })}
        />
      </FormRow>

      <FormRow label="라벨">
        <TextInput
          value={cell.checkboxLabel}
          onChange={(checkboxLabel) => onChangeTempCellValue({ checkboxLabel })}
        />
      </FormRow>

      <FormRow label="요일">
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
      </FormRow>
    </>
  );
}
