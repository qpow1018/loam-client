import { describe, expect, it } from 'vitest';

import { getRefiningStep } from '@/app/lostark/refining/_define/refiningSteps';
import {
  createMaterialForms,
  getRelevantMaterialIds,
  hasRefiningInputErrors,
  validateRefiningInput,
} from '@/app/lostark/refining/_util/refiningInput';

const step = getRefiningStep('aegir', 'weapon', 10);
const materialIds = getRelevantMaterialIds(step);

function validInput() {
  const materials = createMaterialForms(materialIds);
  for (const id of materialIds)
    materials[id] = { price: '100', owned: '0', isValuedAtMarket: false };
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
      prices: { 'aegir-destruction-stone': 100 },
      ownedMaterials: { 'aegir-destruction-stone': { quantity: 0, isValuedAtMarket: false } },
    });
  });

  it('reports condition and material errors without creating a worker input', () => {
    const input = validInput();
    input.condition.failureBonusRate = '10.001';
    input.condition.artisanEnergy = '100.000001';
    input.materials['aegir-destruction-stone'] = {
      price: '',
      owned: '-1',
      isValuedAtMarket: false,
    };

    const validation = validateRefiningInput(input);

    expect(validation.input).toBeUndefined();
    expect(validation.errors).toMatchObject({
      failureBonusRate: expect.any(String),
      artisanEnergy: expect.any(String),
      materials: {
        'aegir-destruction-stone': { price: expect.any(String), owned: expect.any(String) },
      },
    });
    expect(hasRefiningInputErrors(validation.errors)).toBe(true);
  });
});
