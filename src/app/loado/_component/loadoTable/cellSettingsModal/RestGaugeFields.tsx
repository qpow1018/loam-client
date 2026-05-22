'use client';

import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import TextInput from '@/components/common/form/TextInput';

import type { TLoadoCellValue } from '@/app/loado/_type/loado';

import styles from './restGaugeFields.module.scss';

type TNumericField = 'restGauge' | 'restGaugeSkipThreshold';

export default function RestGaugeFields(props: {
  cell: TLoadoCellValue;
  onPatch: (updates: Partial<TLoadoCellValue>) => void;
}) {
  const { cell, onPatch } = props;
  const binaryValue =
    cell.checkboxState === 'checked' || cell.checkboxState === 'unchecked'
      ? cell.checkboxState
      : 'unchecked';

  function handleNumericChange(field: TNumericField) {
    return (raw: string) => {
      const digits = raw.replace(/[^\d]/g, '');
      onPatch({ [field]: digits === '' ? null : Number(digits) });
    };
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
        <span className={styles['field-label']}>휴식게이지</span>
        <div className={styles['text-input-wrapper']}>
          <TextInput
            value={cell.restGauge !== null ? String(cell.restGauge) : ''}
            onChange={handleNumericChange('restGauge')}
            placeholder="0"
          />
        </div>
      </div>

      <div className={styles['field']}>
        <span className={styles['field-label']}>임계값</span>
        <div className={styles['text-input-wrapper']}>
          <TextInput
            value={cell.restGaugeSkipThreshold !== null ? String(cell.restGaugeSkipThreshold) : ''}
            onChange={handleNumericChange('restGaugeSkipThreshold')}
            placeholder="0"
          />
        </div>
      </div>
    </>
  );
}
