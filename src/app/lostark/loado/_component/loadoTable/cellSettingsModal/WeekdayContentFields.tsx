'use client';

import type { TLoadoCellValueWeekdayContent } from '@/app/lostark/loado/_type/loado';

import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import TextInput from '@/components/common/form/TextInput';
import FormRow from '@/app/lostark/loado/_component/loadoTable/FormRow';

import styles from './weekdayContentFields.module.scss';

const WEEKDAY_LABELS = ['월', '화', '수', '목', '금', '토', '일'];

export default function WeekdayContentFields(props: {
  cell: TLoadoCellValueWeekdayContent;
  onChange: (next: TLoadoCellValueWeekdayContent) => void;
}) {
  const { cell, onChange } = props;

  function toggleDay(day: number) {
    const next = cell.weekdays.includes(day)
      ? cell.weekdays.filter((d) => d !== day)
      : [...cell.weekdays, day].sort((a, b) => a - b);
    onChange({ ...cell, weekdays: next });
  }

  return (
    <>
      <FormRow label="상태">
        <ButtonGroup
          options={[
            { value: 'unchecked', label: '미체크' },
            { value: 'checked', label: '체크' },
          ]}
          value={cell.checkboxState}
          onChange={(checkboxState) => onChange({ ...cell, checkboxState })}
        />
      </FormRow>

      <FormRow label="라벨">
        <TextInput
          value={cell.checkboxLabel}
          onChange={(checkboxLabel) => onChange({ ...cell, checkboxLabel })}
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
