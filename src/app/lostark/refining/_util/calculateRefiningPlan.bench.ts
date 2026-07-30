import { bench, describe } from 'vitest';

import { MOCK_REFINING_MARKET_PRICES } from '@/app/lostark/refining/_define/refiningMarketPrices';
import type { TRefiningPlanInput } from '@/app/lostark/refining/_type/refining';
import { getRefiningRule } from '@/app/lostark/refining/_util/refiningRules';
import { calculateRefiningPlan } from '@/app/lostark/refining/_util/calculateRefiningPlan';

function createInput(overrides: Partial<TRefiningPlanInput> = {}): TRefiningPlanInput {
  return {
    step: getRefiningRule('aegir', 'weapon', 19),
    failureBonusRate: 0,
    artisanEnergy: '0',
    prices: MOCK_REFINING_MARKET_PRICES,
    ...overrides,
  };
}

const BENCHMARK_CASES = [
  {
    name: 'Aegir weapon +19 market-only',
    input: createInput(),
  },
  {
    name: 'Aegir weapon +19 partial breath inventory',
    input: createInput({
      ownedMaterials: {
        'weapon-breath': 25,
      },
    }),
  },
  {
    name: 'Aegir weapon +19 partial normal book inventory',
    input: createInput({
      ownedMaterials: {
        'weapon-book-19-20': 2,
      },
    }),
  },
  {
    name: 'Aegir weapon +19 partial enhanced book inventory',
    input: createInput({
      ownedMaterials: {
        'weapon-strong-book-19-20': 1,
      },
    }),
  },
  {
    name: 'Aegir weapon +19 partial optional inventory',
    input: createInput({
      ownedMaterials: {
        'weapon-breath': 25,
        'weapon-book-19-20': 2,
        'weapon-strong-book-19-20': 1,
      },
    }),
  },
  {
    name: 'Aegir weapon +19 free optional inventory',
    input: createInput({
      ownedMaterials: {
        'weapon-breath': 5_000,
        'weapon-book-19-20': 100,
        'weapon-strong-book-19-20': 100,
      },
    }),
  },
] as const;

describe('calculateRefiningPlan performance baseline', () => {
  for (const benchmarkCase of BENCHMARK_CASES) {
    bench(benchmarkCase.name, () => {
      calculateRefiningPlan(benchmarkCase.input);
    });
  }
});
