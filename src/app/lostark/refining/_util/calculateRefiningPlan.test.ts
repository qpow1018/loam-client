import { describe, expect, it } from 'vitest';

import { TEST_MARKET_PRICES } from '@/app/lostark/refining/_define/refiningFixtures';
import { getRefiningStep, REFINING_STEPS } from '@/app/lostark/refining/_define/refiningSteps';
import type { TRefiningPlanInput, TRefiningStep } from '@/app/lostark/refining/_type/refining';
import {
  calculateRefiningPlan,
  getRefiningActions,
} from '@/app/lostark/refining/_util/calculateRefiningPlan';

function input(
  step: TRefiningStep,
  overrides: Partial<TRefiningPlanInput> = {},
): TRefiningPlanInput {
  return { step, failureCount: 0, artisanEnergy: '0', prices: TEST_MARKET_PRICES, ...overrides };
}
function minimal(initialRate: number): TRefiningStep {
  return {
    equipmentGrade: 'aegir',
    equipmentType: 'weapon',
    fromLevel: 99,
    initialRate,
    breathMax: 0,
    breathRateBonus: 0,
    breathMaterialId: 'weapon-lava-breath',
    requiredMaterials: [],
    gold: 1,
    silver: 1,
    books: [{ kind: 'none' }],
  };
}

describe('fixed refining data', () => {
  it('maps document representative costs and materials', () => {
    expect(getRefiningStep('aegir', 'weapon', 10).gold).toBe(1296);
    expect(getRefiningStep('aegir', 'armor', 10).gold).toBe(776);
    expect(
      getRefiningStep('serka', 'weapon', 15).requiredMaterials.find(
        (item) => item.id === 'serka-great-leapstone',
      )?.quantity,
    ).toBe(25);
    expect(
      getRefiningStep('serka', 'weapon', 18).requiredMaterials.find(
        (item) => item.id === 'fate-shard',
      )?.quantity,
    ).toBe(29040);
  });
  it('uses initial rate, failure correction, cap, and exact artisan accumulation', () => {
    const step = minimal(400);
    const plan = calculateRefiningPlan(input(step));
    expect(plan.conditionalActions[0].action.successRate).toBe(400);
    expect(plan.conditionalActions[1].action.successRate).toBe(440);
    expect(plan.conditionalActions.find((row) => row.failureCount === 10)?.action.successRate).toBe(
      800,
    );
    expect(plan.conditionalActions[1].artisanEnergy).toBeCloseTo(4 / 2.15, 12);
  });
  it('maps every Aegir book range to its exact effect and part-specific market item', () => {
    const expected = [
      [10, 1000, 'weapon-metallurgy-11-14'],
      [11, 1000, 'weapon-metallurgy-11-14'],
      [12, 500, 'weapon-metallurgy-11-14'],
      [13, 500, 'weapon-metallurgy-11-14'],
      [14, 400, 'weapon-metallurgy-15-18'],
      [15, 400, 'weapon-metallurgy-15-18'],
      [16, 300, 'weapon-metallurgy-15-18'],
      [17, 300, 'weapon-metallurgy-15-18'],
      [18, 300, 'weapon-metallurgy-19-20'],
      [19, 150, 'weapon-metallurgy-19-20'],
    ] as const;
    for (const [fromLevel, rateBonus, materialId] of expected) {
      const book = getRefiningStep('aegir', 'weapon', fromLevel).books.find(
        (item) => item.kind === 'normal',
      );
      expect(book).toMatchObject({ kind: 'normal', rateBonus, materialId });
    }
    expect(
      getRefiningStep('aegir', 'weapon', 18).books.find((item) => item.kind === 'enhanced'),
    ).toMatchObject({ rateBonus: 600, materialId: 'weapon-metallurgy-enhanced-19-20' });
    expect(
      getRefiningStep('aegir', 'armor', 14).books.find((item) => item.kind === 'normal'),
    ).toMatchObject({ materialId: 'armor-tailoring-15-18' });
  });
  it('serializes all 58 documented material and currency rows without omissions', () => {
    const documented = `aegir/weapon/10:1250,18,12,5000,1296,55000|aegir/weapon/11:1300,21,12,5300,1432,55000|aegir/weapon/12:1400,24,15,7600,1592,55000|aegir/weapon/13:1550,27,15,8200,1760,55000|aegir/weapon/14:1700,30,18,8800,1944,55000|aegir/weapon/15:1950,33,18,9400,2136,55000|aegir/weapon/16:2200,36,25,12000,2352,65000|aegir/weapon/17:2450,39,25,12900,2576,65000|aegir/weapon/18:2700,42,25,13700,3510,65000|aegir/weapon/19:2950,45,35,16000,3830,90000|aegir/weapon/20:3200,48,35,17100,4160,90000|aegir/weapon/21:3700,52,35,18200,4510,120000|aegir/weapon/22:4000,56,35,19200,4870,120000|aegir/weapon/23:4200,60,50,20400,5250,150000|aegir/weapon/24:4500,65,50,21500,5650,150000|aegir/armor/10:750,11,7,3000,776,33000|aegir/armor/11:780,13,7,3180,856,33000|aegir/armor/12:840,14,9,4560,952,33000|aegir/armor/13:930,16,9,4920,1056,33000|aegir/armor/14:1020,18,11,5280,1168,33000|aegir/armor/15:1170,20,11,5640,1280,33000|aegir/armor/16:1320,22,15,7200,1408,39000|aegir/armor/17:1470,23,15,7740,1544,39000|aegir/armor/18:1620,25,15,8220,2110,39000|aegir/armor/19:1770,27,21,9600,2300,54000|aegir/armor/20:1920,29,21,10260,2500,54000|aegir/armor/21:2220,31,21,10920,2710,72000|aegir/armor/22:2400,34,21,11520,2920,72000|aegir/armor/23:2520,36,30,12240,3150,90000|aegir/armor/24:2700,40,30,12900,3390,90000|serka/weapon/11:1700,17,18,15890,4050,22000|serka/weapon/12:1890,19,21,17660,4500,22000|serka/weapon/13:2080,21,23,19420,4950,22000|serka/weapon/14:2270,23,25,21190,5400,22000|serka/weapon/15:2460,25,27,22960,5850,22000|serka/weapon/16:2690,28,29,25120,6400,26000|serka/weapon/17:2900,30,32,27080,6900,26000|serka/weapon/18:3110,32,34,29040,7400,26000|serka/weapon/19:3340,34,37,31200,7950,36000|serka/weapon/20:3570,37,39,33360,8500,36000|serka/weapon/21:3800,39,42,35520,9050,48000|serka/weapon/22:4030,42,44,37680,9600,48000|serka/weapon/23:4260,44,47,39840,10150,60000|serka/weapon/24:4500,47,50,42000,10700,60000|serka/armor/11:930,11,11,9570,2450,13200|serka/armor/12:1030,12,12,10540,2700,13200|serka/armor/13:1120,13,13,11520,2950,13200|serka/armor/14:1240,14,15,12690,3250,13200|serka/armor/15:1330,15,16,13670,3500,13200|serka/armor/16:1450,17,17,14840,3800,15600|serka/armor/17:1560,18,19,16010,4100,15600|serka/armor/18:1700,20,20,17380,4450,15600|serka/armor/19:1810,21,22,18550,4750,21600|serka/armor/20:1950,23,23,19920,5100,21600|serka/armor/21:2080,24,25,21280,5450,28800|serka/armor/22:2200,26,26,22460,5750,28800|serka/armor/23:2330,27,28,23820,6100,36000|serka/armor/24:2450,29,30,25000,6400,36000`;
    const actual = REFINING_STEPS.map(
      (step) =>
        `${step.equipmentGrade}/${step.equipmentType}/${step.fromLevel}:${[...step.requiredMaterials.map((item) => item.quantity), step.gold, step.silver].join(',')}`,
    ).join('|');
    expect(actual).toBe(documented);
  });
});

describe('Bellman plan', () => {
  it('matches no-assist expected-attempt regressions', () => {
    expect(calculateRefiningPlan(input(minimal(1000))).expectedAttempts).toBeCloseTo(
      6.6380213548,
      8,
    );
    expect(calculateRefiningPlan(input(minimal(400))).expectedAttempts).toBeCloseTo(13.7, 1);
  });
  it('charges a guaranteed success once with no optional material', () => {
    const plan = calculateRefiningPlan(input(minimal(400), { artisanEnergy: '100' }));
    expect(plan.expectedAttempts).toBe(1);
    expect(plan.expectedGold).toBe(1);
    expect(plan.expectedSilver).toBe(1);
    expect(plan.recommendedWorstCase.silver).toBe(1);
    expect(plan.conditionalActions[0].artisanEnergy).toBe(100);
    expect(plan.conditionalActions[0].action).toMatchObject({
      breathQuantity: 0,
      book: { kind: 'none' },
    });
  });
  it('caps reported artisan energy at 100% on an overshooting failure path', () => {
    const plan = calculateRefiningPlan(input(minimal(1000)));
    expect(plan.conditionalActions.at(-1)?.artisanEnergy).toBe(100);
    expect(plan.recommendedWorstCase.conditionalActions.at(-1)?.artisanEnergy).toBe(100);
  });
  it('values held materials only when selected and always buys shortages', () => {
    const step = {
      ...minimal(10000),
      requiredMaterials: [{ id: 'aegir-leapstone' as const, quantity: 2 }],
    };
    const none = calculateRefiningPlan(input(step));
    const free = calculateRefiningPlan(
      input(step, {
        ownedMaterials: { 'aegir-leapstone': { quantity: 2, isValuedAtMarket: false } },
      }),
    );
    const valued = calculateRefiningPlan(
      input(step, {
        ownedMaterials: { 'aegir-leapstone': { quantity: 1, isValuedAtMarket: true } },
      }),
    );
    expect(none.expectedGold).toBe(101);
    expect(free.expectedGold).toBe(1);
    expect(valued.expectedGold).toBe(101);
    expect(valued.materialExpectations['aegir-leapstone']?.expectedPurchased).toBe(1);
  });
  it('allows intermediate breath counts and never combines book kinds', () => {
    const step = {
      ...minimal(10000),
      breathMax: 2,
      breathRateBonus: 1,
      books: [
        { kind: 'none' } as const,
        { kind: 'normal', rateBonus: 1, materialId: 'weapon-metallurgy-19-20' } as const,
        { kind: 'enhanced', rateBonus: 2, materialId: 'weapon-metallurgy-enhanced-19-20' } as const,
      ],
    };
    const actions = getRefiningActions(step, 0);
    expect(actions).toHaveLength(9);
    expect(actions.filter((action) => action.breathQuantity === 1)).toHaveLength(3);
    expect(actions.map((action) => action.book.kind)).toEqual([
      'none',
      'none',
      'none',
      'normal',
      'normal',
      'normal',
      'enhanced',
      'enhanced',
      'enhanced',
    ]);
  });
  it('reports silver separately, treats fate fragments as market material, and is deterministic', () => {
    const step = {
      ...minimal(5000),
      silver: 10,
      requiredMaterials: [{ id: 'fate-shard' as const, quantity: 10 }],
    };
    const first = calculateRefiningPlan(input(step));
    expect(first.expectedSilver).toBeCloseTo(first.expectedAttempts * step.silver);
    expect(first.recommendedWorstCase.silver).toBe(
      first.recommendedWorstCase.attempts * step.silver,
    );
    expect(first.goldBreakdown).toEqual({
      pureGold: expect.any(Number),
      marketMaterials: expect.any(Number),
    });
    expect(first.materialExpectations['fate-shard']?.expectedGold).toBeGreaterThan(0.1);
    expect(calculateRefiningPlan(input(step))).toEqual(first);
  });
  it('rejects negative or non-finite ownership and price inputs', () => {
    expect(() =>
      calculateRefiningPlan(
        input(minimal(10000), { prices: { ...TEST_MARKET_PRICES, 'weapon-lava-breath': -1 } }),
      ),
    ).toThrow('Invalid market price');
    expect(() =>
      calculateRefiningPlan(
        input(minimal(10000), {
          ownedMaterials: { 'weapon-lava-breath': { quantity: -1, isValuedAtMarket: false } },
        }),
      ),
    ).toThrow('Invalid owned quantity');
    expect(() =>
      calculateRefiningPlan(input(minimal(10000), { artisanEnergy: '0.1234567' })),
    ).toThrow('artisanEnergy');
  });
  it('returns actual immediate costs for every recommended worst-case attempt', () => {
    const plan = calculateRefiningPlan(
      input({
        ...minimal(10000),
        requiredMaterials: [{ id: 'aegir-leapstone', quantity: 2 }],
      }),
    );
    expect(plan.recommendedWorstCase.conditionalActions).toHaveLength(
      plan.recommendedWorstCase.attempts,
    );
    expect(
      plan.recommendedWorstCase.conditionalActions.reduce(
        (total, row) => total + row.immediateGold,
        0,
      ),
    ).toBe(plan.recommendedWorstCase.gold);
    expect(plan.conditionalActions[0]?.immediateGold).toBe(
      plan.recommendedWorstCase.conditionalActions[0]?.immediateGold,
    );
    expect(plan.conditionalActions[0]?.immediateGold).toBe(101);
  });
  it('changes the exact optional policy when required free stock changes future attempt costs', () => {
    const step: TRefiningStep = {
      ...minimal(5000),
      breathMax: 1,
      breathRateBonus: 5000,
      requiredMaterials: [{ id: 'aegir-leapstone', quantity: 1 }],
    };
    const prices = {
      ...TEST_MARKET_PRICES,
      'aegir-leapstone': 200,
      'weapon-lava-breath': 60,
    };
    const scarce = calculateRefiningPlan(
      input(step, {
        prices,
        ownedMaterials: {
          'aegir-leapstone': { quantity: 1, isValuedAtMarket: false },
        },
      }),
    );
    const twoFreeAttempts = calculateRefiningPlan(
      input(step, {
        prices,
        ownedMaterials: {
          'aegir-leapstone': { quantity: 2, isValuedAtMarket: false },
        },
      }),
    );

    expect(scarce.conditionalActions[0].action.breathQuantity).toBe(1);
    expect(twoFreeAttempts.conditionalActions[0].action.breathQuantity).toBe(0);
  });
  it('handles partial free stock across breath and both book kinds', () => {
    const step = getRefiningStep('aegir', 'weapon', 18);
    const plan = calculateRefiningPlan(
      input(step, {
        ownedMaterials: {
          'weapon-lava-breath': { quantity: 50, isValuedAtMarket: false },
          'weapon-metallurgy-19-20': { quantity: 3, isValuedAtMarket: false },
          'weapon-metallurgy-enhanced-19-20': { quantity: 2, isValuedAtMarket: false },
        },
      }),
    );

    expect(plan.expectedGold).toBeGreaterThan(0);
    expect(plan.conditionalActions[0].action.successRate).toBeGreaterThanOrEqual(step.initialRate);
    expect(plan.conditionalActions.at(-1)?.artisanEnergy).toBe(100);
  });
  it('keeps scalar Bellman totals equal to the second-pass breakdown', () => {
    const step: TRefiningStep = {
      ...minimal(5000),
      breathMax: 1,
      breathRateBonus: 1000,
      requiredMaterials: [{ id: 'aegir-leapstone', quantity: 1 }],
    };
    const plan = calculateRefiningPlan(
      input(step, {
        ownedMaterials: {
          'aegir-leapstone': { quantity: 2, isValuedAtMarket: false },
          'weapon-lava-breath': { quantity: 1, isValuedAtMarket: false },
        },
      }),
    );

    expect(plan.goldBreakdown.pureGold + plan.goldBreakdown.marketMaterials).toBeCloseTo(
      plan.expectedGold,
      8,
    );
    for (const value of Object.values(plan.materialExpectations))
      expect(value.expectedOwnedUsed + value.expectedPurchased).toBeCloseTo(
        value.expectedTotalUsed,
        10,
      );
  });
});
