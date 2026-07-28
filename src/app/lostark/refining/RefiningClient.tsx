'use client';

import { useState } from 'react';

import Tabs from '@/components/common/tabs/Tabs';

import RefiningConditionPanel from '@/app/lostark/refining/_component/RefiningConditionPanel';
import RefiningMaterialInputPanel from '@/app/lostark/refining/_component/RefiningMaterialInputPanel';
import RefiningResultPanel from '@/app/lostark/refining/_component/RefiningResultPanel';
import { getRefiningRule } from '@/app/lostark/refining/_util/refiningRules';
import type {
  TMaterialForm,
  TMaterialForms,
  TMarketMaterialId,
  TRefiningCondition,
} from '@/app/lostark/refining/_type/refining';
import {
  createDefaultMaterialForm,
  createMaterialForms,
  getRelevantMaterialIds,
  hasRefiningInputErrors,
} from '@/app/lostark/refining/_util/refiningInput';
import type { TRefiningInputErrors } from '@/app/lostark/refining/_util/refiningInput';
import styles from '@/app/lostark/refining/refiningClient.module.scss';

const REFINING_TABS: { value: string; label: string }[] = [
  { value: 'standard-refining', label: '일반재련' },
  { value: 'advanced-refining', label: '상급재련' },
];
const INITIAL_CONDITION: TRefiningCondition = {
  equipmentGrade: 'serka',
  equipmentType: 'weapon',
  fromLevel: 11,
  failureBonusRate: '0',
  artisanEnergy: '0',
};

export default function RefiningClient() {
  const [activeTab, setActiveTab] = useState<string>(REFINING_TABS[0].value);
  const [condition, setCondition] = useState<TRefiningCondition>(INITIAL_CONDITION);

  const selectedRefiningStep = getRefiningRule(
    condition.equipmentGrade,
    condition.equipmentType,
    condition.fromLevel,
  );

  const [materials, setMaterials] = useState<TMaterialForms>(() =>
    createMaterialForms(
      getRelevantMaterialIds(
        getRefiningRule(
          INITIAL_CONDITION.equipmentGrade,
          INITIAL_CONDITION.equipmentType,
          INITIAL_CONDITION.fromLevel,
        ),
      ),
    ),
  );
  const [errors, setErrors] = useState<TRefiningInputErrors>({});
  const hasErrors = hasRefiningInputErrors(errors);

  function handleConditionChange(nextCondition: TRefiningCondition) {
    setCondition(nextCondition);
    setErrors((current) => ({ ...current, failureBonusRate: undefined, artisanEnergy: undefined }));
  }

  function handleMaterialChange(
    id: TMarketMaterialId,
    next: Partial<TMaterialForm>,
    errorField?: 'price' | 'owned',
  ) {
    setMaterials((current) => ({
      ...current,
      [id]: { ...(current[id] ?? createDefaultMaterialForm()), ...next },
    }));
    if (errorField) {
      setErrors((current) => ({
        ...current,
        materials: {
          ...current.materials,
          [id]: { ...current.materials?.[id], [errorField]: undefined },
        },
      }));
    }
  }

  return (
    <main className={styles['refining-page']}>
      <div className={styles['tab-section']}>
        <Tabs options={REFINING_TABS} value={activeTab} onChange={setActiveTab} />
      </div>

      <div className={styles['content-grid']}>
        <RefiningConditionPanel condition={condition} onChange={handleConditionChange} />

        <RefiningMaterialInputPanel
          step={selectedRefiningStep}
          materials={materials}
          materialErrors={errors.materials ?? {}}
          hasErrors={hasErrors}
          onMaterialChange={handleMaterialChange}
        />

        <RefiningResultPanel
          condition={condition}
          materials={materials}
          step={selectedRefiningStep}
          onErrorsChange={setErrors}
        />
      </div>
    </main>
  );
}
