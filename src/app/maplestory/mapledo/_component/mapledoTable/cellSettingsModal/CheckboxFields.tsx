'use client';

import type { TTaskTableCellValueCheckbox } from '@/types/taskTable';

import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import TextInput from '@/components/common/form/TextInput';
import FormRow from '@/components/taskTable/FormRow';

export default function CheckboxFields(props: {
  cell: TTaskTableCellValueCheckbox;
  onChange: (next: TTaskTableCellValueCheckbox) => void;
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
