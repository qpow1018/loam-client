'use client';

import type { TLoadoCellValue } from '@/app/loado/_type/loado';

import TextInput from '@/components/common/form/TextInput';
import FormRow from '@/app/loado/_component/loadoTable/FormRow';

export default function TextFields(props: {
  cell: TLoadoCellValue;
  onChangeTempCellValue: (updates: Partial<TLoadoCellValue>) => void;
}) {
  const { cell, onChangeTempCellValue } = props;

  return (
    <FormRow label="텍스트">
      <TextInput value={cell.text} onChange={(text) => onChangeTempCellValue({ text })} />
    </FormRow>
  );
}
