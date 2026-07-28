import type { ReactNode } from 'react';

import type {
  TEquipmentGrade,
  TEquipmentType,
  TRefiningCondition,
} from '@/app/lostark/refining/_type/refining';
import {
  getAvailableRefiningLevels,
  getRefiningRule,
} from '@/app/lostark/refining/_util/refiningRules';

import TextInput from '@/components/common/form/TextInput';
import Select from '@/components/common/form/Select';

import styles from '@/app/lostark/refining/_component/refiningConditionPanel.module.scss';

const EQUIPMENT_GRADE_OPTIONS: { value: TEquipmentGrade; label: string }[] = [
  { value: 'serka', label: '세르카' },
  { value: 'aegir', label: '에기르' },
];
const EQUIPMENT_TYPE_OPTIONS: { value: TEquipmentType; label: string }[] = [
  { value: 'weapon', label: '무기' },
  { value: 'armor', label: '방어구' },
];

export default function RefiningConditionPanel(props: {
  condition: TRefiningCondition;
  onChange: (condition: TRefiningCondition) => void;
}) {
  const { condition, onChange } = props;
  const { equipmentGrade, equipmentType, fromLevel, failureBonusRate, artisanEnergy } = condition;

  const availableLevels = getAvailableRefiningLevels(equipmentGrade, equipmentType);
  const baseSuccessRate = (
    getRefiningRule(equipmentGrade, equipmentType, fromLevel).initialRate / 100
  ).toFixed(2);

  function handleEquipmentGradeChange(value: TEquipmentGrade) {
    const nextLevel = getAvailableRefiningLevels(value, equipmentType)[0]!;
    onChange({ ...condition, equipmentGrade: value, fromLevel: nextLevel });
  }

  function handleEquipmentTypeChange(value: TEquipmentType) {
    const nextLevel = getAvailableRefiningLevels(equipmentGrade, value)[0]!;
    onChange({ ...condition, equipmentType: value, fromLevel: nextLevel });
  }

  return (
    <section className={styles['condition-panel']}>
      <h2>재련 조건</h2>

      <div className={styles['condition-grid']}>
        <ConditionBox label="장비 등급">
          <RadioButtons
            options={EQUIPMENT_GRADE_OPTIONS.map((option) => ({
              label: option.label,
              isSelected: equipmentGrade === option.value,
              onClick: () => handleEquipmentGradeChange(option.value),
            }))}
          />
        </ConditionBox>

        <ConditionBox label="장비 부위">
          <RadioButtons
            options={EQUIPMENT_TYPE_OPTIONS.map((option) => ({
              label: option.label,
              isSelected: equipmentType === option.value,
              onClick: () => handleEquipmentTypeChange(option.value),
            }))}
          />
        </ConditionBox>

        <ConditionBox label="재련 단계" labelId="refining-level-label">
          <Select
            id="refining-level"
            labelId="refining-level-label"
            value={String(fromLevel)}
            options={availableLevels.map((level) => ({
              value: String(level),
              label: `${level} → ${level + 1}`,
            }))}
            onChange={(value) => onChange({ ...condition, fromLevel: Number(value) })}
          />
        </ConditionBox>

        <ConditionBox label="기본 성공률">
          <PercentageInput value={baseSuccessRate} isReadonly />
        </ConditionBox>

        <ConditionBox label="실패로 추가된 확률">
          <PercentageInput
            value={failureBonusRate}
            onChange={(value) => onChange({ ...condition, failureBonusRate: value })}
          />
        </ConditionBox>

        <ConditionBox label="장인의 기운">
          <PercentageInput
            value={artisanEnergy}
            onChange={(value) => onChange({ ...condition, artisanEnergy: value })}
          />
        </ConditionBox>
      </div>
    </section>
  );
}

function ConditionBox(props: { label: string; labelId?: string; children: ReactNode }) {
  const { label, labelId, children } = props;

  return (
    <div className={styles['condition-box']} role="group" aria-label={label}>
      {labelId ? (
        <p id={labelId} className={styles['label']}>
          {label}
        </p>
      ) : (
        <p className={styles['label']}>{label}</p>
      )}
      {children}
    </div>
  );
}

function RadioButtons(props: {
  options: readonly { label: string; isSelected: boolean; onClick: () => void }[];
}) {
  const { options } = props;

  return (
    <div className={styles['radio-buttons']}>
      {options.map((option) => (
        <button
          key={option.label}
          className={`${styles['radio-button']} ${option.isSelected ? styles['is-selected'] : ''}`}
          onClick={option.onClick}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function PercentageInput(props: {
  value: string;
  onChange?: (value: string) => void;
  isReadonly?: boolean;
}) {
  const { value, onChange, isReadonly = false } = props;

  return (
    <div className={styles['percentage-input']}>
      <TextInput
        className={styles['percentage-value']}
        value={value}
        isReadonly={isReadonly}
        inputMode="decimal"
        onChange={onChange}
      />
      <span aria-hidden="true">%</span>
    </div>
  );
}
