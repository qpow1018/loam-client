'use client';

import type { TLoadoCellValue } from '@/app/loado/_type/loado';

import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import TextInput from '@/components/common/form/TextInput';

import FormRow from './FormRow';

export default function CheckboxFields(props: {
  cell: TLoadoCellValue;
  onChangeTempCellValue: (updates: Partial<TLoadoCellValue>) => void;
}) {
  const { cell, onChangeTempCellValue } = props;

  const binaryValue =
    cell.checkboxState === 'checked' || cell.checkboxState === 'unchecked'
      ? cell.checkboxState
      : 'unchecked';

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
    </>
  );
}
