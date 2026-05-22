'use client';

import type { TLoadoCellValueCheckbox } from '@/app/loado/_type/loado';

import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import TextInput from '@/components/common/form/TextInput';
import FormRow from '@/app/loado/_component/loadoTable/FormRow';

export default function CheckboxFields(props: {
  cell: TLoadoCellValueCheckbox;
  onChange: (next: TLoadoCellValueCheckbox) => void;
}) {
  const { cell, onChange } = props;

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
    </>
  );
}
