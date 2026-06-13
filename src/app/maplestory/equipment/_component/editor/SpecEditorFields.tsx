import type { TMaplestoryEquipmentStatePatch } from '@/api/maplestory/type';

import TextInput from '@/components/common/form/TextInput';

import styles from './equipmentEditorModal.module.scss';

export type TEquipmentSpecForm = Required<
  Pick<
    TMaplestoryEquipmentStatePatch,
    'starforce' | 'bonusOption' | 'scroll' | 'potential' | 'additionalPotential' | 'extra'
  >
>;

const SPEC_FIELDS: readonly {
  key: keyof TEquipmentSpecForm;
  label: string;
  placeholder: string;
}[] = [
  { key: 'starforce', label: '스타포스', placeholder: '예: 18성' },
  { key: 'bonusOption', label: '추옵', placeholder: '예: 155급, 2추 보공' },
  { key: 'scroll', label: '작', placeholder: '예: 15% 완작' },
  { key: 'potential', label: '윗잠', placeholder: '예: 보보공, 21%' },
  { key: 'additionalPotential', label: '아랫잠', placeholder: '예: 공 21%, 2줄' },
  { key: 'extra', label: '기타', placeholder: '예: 리레 4, 드랍 20%' },
];

export default function SpecEditorFields(props: {
  value: TEquipmentSpecForm;
  onChange: (value: TEquipmentSpecForm) => void;
}) {
  const { value, onChange } = props;

  return (
    <div className={styles['field-list']}>
      {SPEC_FIELDS.map((field) => (
        <label key={field.key} className={styles['form-row']}>
          <span>{field.label}</span>
          <TextInput
            value={value[field.key] ?? ''}
            placeholder={field.placeholder}
            onChange={(nextValue) => onChange({ ...value, [field.key]: nextValue })}
          />
        </label>
      ))}
    </div>
  );
}
