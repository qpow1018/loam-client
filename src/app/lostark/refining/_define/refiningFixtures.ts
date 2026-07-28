import type { TRefiningMaterialId } from '@/app/lostark/refining/_type/refining';

/** Deliberately artificial unit prices for deterministic tests, not market quotes. */
export const TEST_MARKET_PRICES: Record<TRefiningMaterialId, number> = {
  'aegir-destruction': 2,
  'aegir-guardian': 1,
  'aegir-leapstone': 50,
  'aegir-abidos': 20,
  'serka-destruction': 3,
  'serka-guardian': 2,
  'serka-leapstone': 80,
  'serka-abidos': 30,
  'fate-shard': 0.01,
  'weapon-breath': 100,
  'armor-breath': 90,
  'weapon-book-11-14': 500,
  'armor-book-11-14': 450,
  'weapon-book-15-18': 600,
  'armor-book-15-18': 550,
  'weapon-book-19-20': 700,
  'armor-book-19-20': 650,
  'weapon-strong-book-19-20': 1_400,
  'armor-strong-book-19-20': 1_300,
};
