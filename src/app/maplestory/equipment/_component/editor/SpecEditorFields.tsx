import { useState } from 'react';

import type { TMaplestoryEquipmentStatePatch } from '@/api/maplestory/type';

import {
  ADDITIONAL_POTENTIAL_PRESETS,
  POTENTIAL_PRESETS,
  SCROLL_PRESETS,
  STARFORCE_PRESETS,
  calculateBonusOption,
} from '@/app/maplestory/equipment/_util/equipmentSpec';

import Button from '@/components/common/button/Button';
import TextInput from '@/components/common/form/TextInput';

import styles from './equipmentEditorModal.module.scss';

export type TEquipmentSpecForm = Required<
  Pick<
    TMaplestoryEquipmentStatePatch,
    'starforce' | 'bonusOption' | 'scroll' | 'potential' | 'additionalPotential' | 'extra'
  >
>;

export default function SpecEditorFields(props: {
  value: TEquipmentSpecForm;
  onChange: (value: TEquipmentSpecForm) => void;
}) {
  const { value, onChange } = props;

  return (
    <div className={styles['field-list']}>
      <PresetField
        label="스타포스"
        value={value.starforce ?? ''}
        placeholder="예: 18성"
        presets={STARFORCE_PRESETS}
        onChange={(starforce) => onChange({ ...value, starforce })}
      />
      <BonusOptionField
        value={value.bonusOption ?? ''}
        onChange={(bonusOption) => onChange({ ...value, bonusOption })}
      />
      <PresetField
        label="작"
        value={value.scroll ?? ''}
        placeholder="예: 15% 완작"
        presets={SCROLL_PRESETS}
        onChange={(scroll) => onChange({ ...value, scroll })}
      />
      <PresetField
        label="윗잠"
        value={value.potential ?? ''}
        placeholder="예: 보보공, 21%"
        presets={POTENTIAL_PRESETS}
        onChange={(potential) => onChange({ ...value, potential })}
      />
      <PresetField
        label="아랫잠"
        value={value.additionalPotential ?? ''}
        placeholder="예: 공 21%, 2줄"
        presets={ADDITIONAL_POTENTIAL_PRESETS}
        onChange={(additionalPotential) => onChange({ ...value, additionalPotential })}
      />
      <label className={styles['form-row']}>
        <span>기타</span>
        <TextInput
          className={styles['main-input']}
          value={value.extra ?? ''}
          placeholder="예: 리레 4, 드랍 20%"
          onChange={(extra) => onChange({ ...value, extra })}
        />
      </label>
    </div>
  );
}

function PresetField(props: {
  label: string;
  value: string;
  placeholder: string;
  presets: readonly string[];
  onChange: (value: string) => void;
}) {
  const { label, value, placeholder, presets, onChange } = props;

  return (
    <div className={styles['form-row']}>
      <span>{label}</span>
      <div className={styles['field-controls']}>
        <TextInput
          className={styles['main-input']}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
        <div className={styles['helper-area']}>
          {presets.map((preset) => (
            <Button
              key={preset}
              className={styles['helper-button']}
              color="gray"
              fill="outline"
              size="small"
              onClick={() => onChange(preset)}
            >
              {preset}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BonusOptionField(props: { value: string; onChange: (value: string) => void }) {
  const { value, onChange } = props;
  const [calculator, setCalculator] = useState({ mainStat: '', allStat: '', attackPower: '' });

  function handleCalculatorChange(key: keyof typeof calculator, nextValue: string) {
    const nextCalculator = { ...calculator, [key]: nextValue };
    setCalculator(nextCalculator);
    onChange(calculateBonusOption(nextCalculator));
  }

  return (
    <div className={styles['form-row']}>
      <span>추옵</span>
      <div className={styles['field-controls']}>
        <TextInput
          className={styles['main-input']}
          value={value}
          placeholder="예: 155급, 2추 보공"
          onChange={onChange}
        />
        <div className={styles['helper-area']}>
          <CalculatorInput
            label="주스탯"
            value={calculator.mainStat}
            onChange={(mainStat) => handleCalculatorChange('mainStat', mainStat)}
          />
          <CalculatorInput
            label="올스탯"
            value={calculator.allStat}
            onChange={(allStat) => handleCalculatorChange('allStat', allStat)}
          />
          <CalculatorInput
            label="공마"
            value={calculator.attackPower}
            onChange={(attackPower) => handleCalculatorChange('attackPower', attackPower)}
          />
        </div>
      </div>
    </div>
  );
}

function CalculatorInput(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { label, value, onChange } = props;

  return (
    <label className={styles['calculator-input']}>
      <span>{label}</span>
      <TextInput className={styles['helper-input']} value={value} onChange={onChange} />
    </label>
  );
}
