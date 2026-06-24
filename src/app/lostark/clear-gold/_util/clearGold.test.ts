import assert from 'node:assert/strict';
import test from 'node:test';

import type { TClearGoldGate } from '../_type/clearGold';
import { calculateClearGoldSummary, formatGold } from './clearGold';

test('returns zero totals for empty gates', () => {
  assert.deepEqual(calculateClearGoldSummary([]), {
    tradableGold: 0,
    boundGold: 0,
    totalGold: 0,
  });
});

test('sums tradable and bound gold separately and together', () => {
  const gates: readonly TClearGoldGate[] = [
    { name: '1관문', tradableGold: 4_000, boundGold: 1_000 },
    { name: '2관문', tradableGold: 3_500, boundGold: 2_500 },
  ];

  assert.deepEqual(calculateClearGoldSummary(gates), {
    tradableGold: 7_500,
    boundGold: 3_500,
    totalGold: 11_000,
  });
});

test('formats gold with locale separators', () => {
  assert.equal(formatGold(11_500), '11,500');
  assert.equal(formatGold(0), '0');
});
