'use client';

import type { TTaskTableCellValueRestGauge } from '@/types/taskTable';

import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import TextInput from '@/components/common/form/TextInput';
import FormRow from '@/components/taskTable/FormRow';

type TNumericField = 'restGauge' | 'restGaugeSkipThreshold';

export default function RestGaugeFields(props: {
  cell: TTaskTableCellValueRestGauge;
  onChange: (next: TTaskTableCellValueRestGauge) => void;
}) {
  const { cell, onChange } = props;

  function handleNumericChange(field: TNumericField) {
    return (raw: string) => {
      const digits = raw.replace(/[^\d]/g, '');
      const parsed = digits === '' ? 0 : Number(digits);
      onChange({ ...cell, [field]: parsed });
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
          value={cell.checkboxState}
          onChange={(checkboxState) => onChange({ ...cell, checkboxState })}
        />
      </FormRow>

      <FormRow label="휴식게이지">
        <TextInput
          value={String(cell.restGauge)}
          onChange={handleNumericChange('restGauge')}
          placeholder="0"
        />
      </FormRow>

      <FormRow label="임계값">
        <TextInput
          value={String(cell.restGaugeSkipThreshold)}
          onChange={handleNumericChange('restGaugeSkipThreshold')}
          placeholder="0"
        />
      </FormRow>
    </>
  );
}
