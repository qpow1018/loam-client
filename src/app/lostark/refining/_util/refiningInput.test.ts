import { describe, expect, it } from 'vitest';

import type { TRefiningMaterialInputs } from '@/app/lostark/refining/_type/refining';
import { getRefiningRule } from '@/app/lostark/refining/_util/refiningRules';
import {
  hasRefiningInputErrors,
  validateRefiningInput,
} from '@/app/lostark/refining/_util/refiningInput';

const step = getRefiningRule('aegir', 'weapon', 10);
function validInput() {
  const materials = {} as TRefiningMaterialInputs;
  for (const id of step.inputMaterialIds)
    materials[id] = { price: '100', owned: '0', isZeroValued: false };
  return {
    condition: {
      equipmentGrade: 'aegir' as const,
      equipmentType: 'weapon' as const,
      fromLevel: 10,
      failureBonusRate: '1.25%',
      artisanEnergy: '12.345678',
    },
    materials,
    step,
  };
}

describe('validateRefiningInput', () => {
  it('normalizes valid user input for the refining worker', () => {
    const validation = validateRefiningInput(validInput());

    expect(validation.errors).toEqual({});
    expect(validation.input).toMatchObject({
      failureBonusRate: 125,
      artisanEnergy: '12.345678',
      prices: { 'aegir-destruction': 100 },
      ownedMaterials: { 'aegir-destruction': { quantity: 0, isZeroValued: false } },
    });
  });

  it('reports condition and material errors without creating a worker input', () => {
    const input = validInput();
    input.condition.failureBonusRate = '10.001';
    input.condition.artisanEnergy = '100.000001';
    input.materials['aegir-destruction'] = {
      price: '',
      owned: '-1',
      isZeroValued: false,
    };

    const validation = validateRefiningInput(input);

    expect(validation.input).toBeUndefined();
    expect(validation.errors).toMatchObject({
      failureBonusRate: expect.any(String),
      artisanEnergy: expect.any(String),
      materials: {
        'aegir-destruction': { price: expect.any(String), owned: expect.any(String) },
      },
    });
    expect(hasRefiningInputErrors(validation.errors)).toBe(true);
  });
});
