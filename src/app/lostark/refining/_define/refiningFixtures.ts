import type { TMarketMaterialId } from '@/app/lostark/refining/_type/refining';

/** Deliberately artificial unit prices for deterministic tests, not market quotes. */
export const TEST_MARKET_PRICES: Record<TMarketMaterialId, number> = {
  'aegir-destruction-stone': 2,
  'aegir-guardian-stone': 1,
  'aegir-leapstone': 50,
  'aegir-fusion': 20,
  'serka-destruction-crystal': 3,
  'serka-guardian-crystal': 2,
  'serka-great-leapstone': 80,
  'serka-advanced-fusion': 30,
  'fate-shard': 0.01,
  'weapon-lava-breath': 100,
  'armor-glacier-breath': 90,
  'weapon-metallurgy-11-14': 500,
  'armor-tailoring-11-14': 450,
  'weapon-metallurgy-15-18': 600,
  'armor-tailoring-15-18': 550,
  'weapon-metallurgy-19-20': 700,
  'armor-tailoring-19-20': 650,
  'weapon-metallurgy-enhanced-19-20': 1_400,
  'armor-tailoring-enhanced-19-20': 1_300,
};
