'use client';

import { useState } from 'react';

import Tabs from '@/components/common/tabs/Tabs';

import RefiningConditionPanel from '@/app/lostark/refining/_component/RefiningConditionPanel';
import RefiningMaterialInputPanel from '@/app/lostark/refining/_component/RefiningMaterialInputPanel';
import RefiningResultPanel from '@/app/lostark/refining/_component/RefiningResultPanel';
import { MOCK_REFINING_MARKET_PRICES } from '@/app/lostark/refining/_define/refiningMarketPrices';
import { getRefiningRule } from '@/app/lostark/refining/_util/refiningRules';
import type {
  TRefiningMaterialInput,
  TRefiningMaterialInputs,
  TRefiningMaterialId,
  TRefiningCondition,
} from '@/app/lostark/refining/_type/refining';
import { hasRefiningInputErrors } from '@/app/lostark/refining/_util/refiningInput';
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
  const [materials, setMaterials] = useState<TRefiningMaterialInputs>(getInitialMaterials);

  const selectedRefiningRule = getRefiningRule(
    condition.equipmentGrade,
    condition.equipmentType,
    condition.fromLevel,
  );

  function getDefaultMaterialForm(): TRefiningMaterialInput {
    return { owned: '0', isZeroValued: false };
  }

  function getInitialMaterials(): TRefiningMaterialInputs {
    const initialRule = getRefiningRule(
      INITIAL_CONDITION.equipmentGrade,
      INITIAL_CONDITION.equipmentType,
      INITIAL_CONDITION.fromLevel,
    );

    return Object.fromEntries(
      initialRule.inputMaterialIds.map((id) => [id, getDefaultMaterialForm()]),
    ) as TRefiningMaterialInputs;
  }

  const [errors, setErrors] = useState<TRefiningInputErrors>({});
  const hasErrors = hasRefiningInputErrors(errors);

  function handleConditionChange(nextCondition: TRefiningCondition) {
    const nextRule = getRefiningRule(
      nextCondition.equipmentGrade,
      nextCondition.equipmentType,
      nextCondition.fromLevel,
    );
    setCondition(nextCondition);
    setMaterials((current) => {
      const missingMaterialIds = nextRule.inputMaterialIds.filter((id) => !current[id]);
      if (missingMaterialIds.length === 0) return current;

      return {
        ...current,
        ...Object.fromEntries(missingMaterialIds.map((id) => [id, getDefaultMaterialForm()])),
      };
    });
    setErrors((current) => ({ ...current, failureBonusRate: undefined, artisanEnergy: undefined }));
  }

  function handleMaterialChange(
    id: TRefiningMaterialId,
    next: Partial<TRefiningMaterialInput>,
    errorField?: 'owned',
  ) {
    setMaterials((current) => ({
      ...current,
      [id]: { ...current[id]!, ...next },
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
          rule={selectedRefiningRule}
          marketPrices={MOCK_REFINING_MARKET_PRICES}
          materials={materials}
          materialErrors={errors.materials ?? {}}
          hasErrors={hasErrors}
          onMaterialChange={handleMaterialChange}
        />

        <RefiningResultPanel
          condition={condition}
          marketPrices={MOCK_REFINING_MARKET_PRICES}
          materials={materials}
          step={selectedRefiningRule}
          onErrorsChange={setErrors}
        />
      </div>
    </main>
  );
}
