'use client';

import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import TextInput from '@/components/common/form/TextInput';

import type { TLoadoCellValue } from '@/app/loado/_type/loado';

import styles from './checkboxFields.module.scss';

export default function CheckboxFields(props: {
  cell: TLoadoCellValue;
  onPatch: (updates: Partial<TLoadoCellValue>) => void;
}) {
  const { cell, onPatch } = props;
  const binaryValue =
    cell.checkboxState === 'checked' || cell.checkboxState === 'unchecked'
      ? cell.checkboxState
      : 'unchecked';

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
    </>
  );
}
