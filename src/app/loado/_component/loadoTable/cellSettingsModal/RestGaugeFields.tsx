'use client';

import type { TLoadoCellValue } from '@/app/loado/_type/loado';

import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import TextInput from '@/components/common/form/TextInput';
import FormRow from './FormRow';

type TNumericField = 'restGauge' | 'restGaugeSkipThreshold';

export default function RestGaugeFields(props: {
  cell: TLoadoCellValue;
  onChangeTempCellValue: (updates: Partial<TLoadoCellValue>) => void;
}) {
  const { cell, onChangeTempCellValue } = props;

  const binaryValue =
    cell.checkboxState === 'checked' || cell.checkboxState === 'unchecked'
      ? cell.checkboxState
      : 'unchecked';

  function handleNumericChange(field: TNumericField) {
    return (raw: string) => {
      const digits = raw.replace(/[^\d]/g, '');
      onChangeTempCellValue({ [field]: digits === '' ? null : Number(digits) });
    };
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

      <FormRow label="휴식게이지">
        <TextInput
          value={cell.restGauge !== null ? String(cell.restGauge) : ''}
          onChange={handleNumericChange('restGauge')}
          placeholder="0"
        />
      </FormRow>

      <FormRow label="임계값">
        <TextInput
          value={cell.restGaugeSkipThreshold !== null ? String(cell.restGaugeSkipThreshold) : ''}
          onChange={handleNumericChange('restGaugeSkipThreshold')}
          placeholder="0"
        />
      </FormRow>
    </>
  );
}
