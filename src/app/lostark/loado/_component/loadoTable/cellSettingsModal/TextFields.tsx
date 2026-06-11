'use client';

import type { TTaskTableCellValueText } from '@/types/taskTable';

import TextInput from '@/components/common/form/TextInput';
import FormRow from '@/app/lostark/loado/_component/loadoTable/FormRow';

export default function TextFields(props: {
  cell: TTaskTableCellValueText;
  onChange: (next: TTaskTableCellValueText) => void;
}) {
  const { cell, onChange } = props;

  return (
    <FormRow label="텍스트">
      <TextInput value={cell.text} onChange={(text) => onChange({ ...cell, text })} />
    </FormRow>
  );
}
