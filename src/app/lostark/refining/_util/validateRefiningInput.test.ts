import { describe, expect, it } from 'vitest';

import { MOCK_REFINING_MARKET_PRICES } from '@/app/lostark/refining/_define/refiningMarketPrices';
import type { TRefiningMaterialInputs } from '@/app/lostark/refining/_type/refining';
import { validateRefiningInput } from '@/app/lostark/refining/_util/validateRefiningInput';
import { getRefiningRule } from '@/app/lostark/refining/_util/refiningRules';

const refiningRule = getRefiningRule('aegir', 'weapon', 10);
function validInput() {
  const materials = {} as TRefiningMaterialInputs;
  for (const id of refiningRule.inputMaterialIds)
    materials[id] = { owned: '0', isZeroPriced: false };
  return {
    condition: {
      equipmentGrade: 'aegir' as const,
      equipmentType: 'weapon' as const,
      fromLevel: 10,
      failureBonusRate: '1.25%',
      artisanEnergy: '12.345678',
    },
    marketPrices: MOCK_REFINING_MARKET_PRICES,
    materials,
    refiningRule,
  };
}

describe('validateRefiningInput', () => {
  it('normalizes valid user input for the refining worker', () => {
    const input = validInput();
    input.materials['aegir-destruction']!.isZeroPriced = true;
    const validation = validateRefiningInput(input);

    expect(validation).toMatchObject({
      failureBonusRate: 125,
      artisanEnergy: '12.345678',
      prices: { 'aegir-destruction': 0 },
      ownedMaterials: { 'aegir-destruction': 0 },
    });
  });

  it('treats an empty owned quantity as zero', () => {
    const input = validInput();
    input.materials['aegir-destruction']!.owned = '';

    const validation = validateRefiningInput(input);

    expect(validation).toMatchObject({ ownedMaterials: { 'aegir-destruction': 0 } });
  });

  it('does not create a worker input for invalid condition or material values', () => {
    const input = validInput();
    input.condition.failureBonusRate = '10.001';
    input.condition.artisanEnergy = '100.000001';
    input.materials['aegir-destruction'] = { owned: '-1', isZeroPriced: false };

    const validation = validateRefiningInput(input);

    expect(validation).toBeUndefined();
  });
});
