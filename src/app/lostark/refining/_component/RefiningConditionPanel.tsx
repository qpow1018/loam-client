import type { ReactNode } from 'react';

import { getRefiningLevels } from '@/app/lostark/refining/_define/refiningSteps';
import type {
  TEquipmentGrade,
  TEquipmentType,
  TRefiningCondition,
} from '@/app/lostark/refining/_type/refining';

import styles from '@/app/lostark/refining/_component/refiningConditionPanel.module.scss';

type TErrors = Partial<Record<string, string>>;

const EQUIPMENT_GRADE_OPTIONS: { value: TEquipmentGrade; label: string }[] = [
  { value: 'aegir', label: '에기르' },
  { value: 'serka', label: '세르카' },
];
const EQUIPMENT_TYPE_OPTIONS: { value: TEquipmentType; label: string }[] = [
  { value: 'weapon', label: '무기' },
  { value: 'armor', label: '방어구' },
];

export default function RefiningConditionPanel(props: {
  condition: TRefiningCondition;
  errors: TErrors;
  onChange: (condition: TRefiningCondition) => void;
}) {
  const { condition, errors, onChange } = props;
  const { equipmentGrade, equipmentType, fromLevel, failureCount, artisanEnergy } = condition;

  const availableLevels = getRefiningLevels(equipmentGrade, equipmentType);

  function handleEquipmentGradeChange(value: TEquipmentGrade) {
    const nextLevel = getRefiningLevels(value, equipmentType)[0]!;
    onChange({ ...condition, equipmentGrade: value, fromLevel: nextLevel });
  }

  function handleEquipmentTypeChange(value: TEquipmentType) {
    const nextLevel = getRefiningLevels(equipmentGrade, value)[0]!;
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

        <ConditionBox label="현재 단계">
          <select
            aria-label="현재 단계"
            value={fromLevel}
            onChange={(event) => onChange({ ...condition, fromLevel: Number(event.target.value) })}
          >
            {availableLevels.map((level) => (
              <option key={level} value={level}>
                +{level} → +{level + 1}
              </option>
            ))}
          </select>
        </ConditionBox>

        <ConditionBox label="실패 횟수">
          <input
            aria-label="실패 횟수"
            aria-describedby={errors.failureCount ? 'failure-count-error' : undefined}
            aria-invalid={Boolean(errors.failureCount)}
            inputMode="numeric"
            min="0"
            value={failureCount}
            onChange={(event) => onChange({ ...condition, failureCount: event.target.value })}
          />
          {errors.failureCount && (
            <span id="failure-count-error" className={styles['field-error']}>
              {errors.failureCount}
            </span>
          )}
        </ConditionBox>

        <ConditionBox label="장인의 기운 (%)">
          <input
            aria-label="장인의 기운"
            aria-describedby={errors.artisanEnergy ? 'artisan-energy-error' : undefined}
            aria-invalid={Boolean(errors.artisanEnergy)}
            inputMode="decimal"
            value={artisanEnergy}
            onChange={(event) => onChange({ ...condition, artisanEnergy: event.target.value })}
          />
          {errors.artisanEnergy && (
            <span id="artisan-energy-error" className={styles['field-error']}>
              {errors.artisanEnergy}
            </span>
          )}
        </ConditionBox>
      </div>
    </section>
  );
}

function ConditionBox(props: { label: string; children: ReactNode }) {
  const { label, children } = props;

  return (
    <div className={styles['condition-box']} role="group" aria-label={label}>
      <p className={styles['label']}>{label}</p>
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
