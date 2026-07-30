'use client';

import { useState } from 'react';

import type {
  TRefiningMaterialInput,
  TRefiningMaterialInputs,
  TRefiningMaterialId,
  TRefiningCondition,
} from '@/app/lostark/refining/_type/refining';
import { MOCK_REFINING_MARKET_PRICES } from '@/app/lostark/refining/_define/refiningMarketPrices';
import { getRefiningRule } from '@/app/lostark/refining/_util/refiningRules';

import RefiningConditionPanel from '@/app/lostark/refining/_component/RefiningConditionPanel';
import RefiningMaterialInputPanel from '@/app/lostark/refining/_component/RefiningMaterialInputPanel';
import RefiningResultPanel from '@/app/lostark/refining/_component/RefiningResultPanel';

import styles from '@/app/lostark/refining/refiningClient.module.scss';

const INITIAL_CONDITION: TRefiningCondition = {
  equipmentGrade: 'serka',
  equipmentType: 'weapon',
  fromLevel: 11,
  failureBonusRate: '0',
  artisanEnergy: '0',
};

export default function RefiningClient() {
  const [condition, setCondition] = useState<TRefiningCondition>(INITIAL_CONDITION);
  const [materials, setMaterials] = useState<TRefiningMaterialInputs>(getInitialMaterials);

  const selectedRefiningRule = getRefiningRule(
    condition.equipmentGrade,
    condition.equipmentType,
    condition.fromLevel,
  );

  function getDefaultMaterialForm(): TRefiningMaterialInput {
    return { owned: '', isZeroPriced: false };
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
  }

  function handleMaterialChange(id: TRefiningMaterialId, next: Partial<TRefiningMaterialInput>) {
    setMaterials((current) => ({
      ...current,
      [id]: { ...current[id]!, ...next },
    }));
  }

  return (
    <main className={styles['refining-page']}>
      <div className={styles['content-grid']}>
        <RefiningConditionPanel condition={condition} onChange={handleConditionChange} />

        <RefiningMaterialInputPanel
          marketPrices={MOCK_REFINING_MARKET_PRICES}
          visibleMaterialIds={selectedRefiningRule.inputMaterialIds}
          materials={materials}
          onMaterialChange={handleMaterialChange}
        />

        <RefiningResultPanel
          marketPrices={MOCK_REFINING_MARKET_PRICES}
          condition={condition}
          materials={materials}
          refiningRule={selectedRefiningRule}
        />
      </div>
    </main>
  );
}
