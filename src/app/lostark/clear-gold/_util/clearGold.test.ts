import assert from 'node:assert/strict';
import test from 'node:test';

import { CLEAR_GOLD_CONTENTS } from '../_define/clearGoldContents';
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
    { name: '1관문', tradableGold: 1_000, boundGold: 2_000 },
    { name: '2관문', tradableGold: 1_500, boundGold: 500 },
  ];

  assert.deepEqual(calculateClearGoldSummary(gates), {
    tradableGold: 2_500,
    boundGold: 2_500,
    totalGold: 5_000,
  });
});

test('formats gold with locale separators', () => {
  assert.equal(formatGold(11_500), '11,500');
  assert.equal(formatGold(0), '0');
});

test('provides Kazeroth Act 1 normal clear gold data', () => {
  const content = CLEAR_GOLD_CONTENTS[0];

  assert.ok(content);
  assert.equal(content.id, 'kazeroth-act-1');
  assert.equal(content.name, '카제로스 레이드 1막');

  const normal = content.difficulties[0];

  assert.ok(normal);
  assert.equal(normal.id, 'kazeroth-act-1-normal');
  assert.equal(normal.name, '노말');
  assert.equal(normal.entryItemLevel, 1660);
  assert.equal(normal.updatedAt, '2026.03.15');
  assert.deepEqual(normal.gates, [
    { name: '1관문', tradableGold: 3500, boundGold: 0 },
    { name: '2관문', tradableGold: 8000, boundGold: 0 },
  ]);
  assert.deepEqual(calculateClearGoldSummary(normal.gates), {
    tradableGold: 11_500,
    boundGold: 0,
    totalGold: 11_500,
  });
});

test('provides Kazeroth Act 1 hard clear gold data', () => {
  const hard = CLEAR_GOLD_CONTENTS[0]?.difficulties[1];

  assert.ok(hard);
  assert.equal(hard.id, 'kazeroth-act-1-hard');
  assert.equal(hard.name, '하드');
  assert.equal(hard.entryItemLevel, 1680);
  assert.equal(hard.updatedAt, '2026.03.15');
  assert.deepEqual(hard.gates, [
    { name: '1관문', tradableGold: 5500, boundGold: 0 },
    { name: '2관문', tradableGold: 12500, boundGold: 0 },
  ]);
  assert.deepEqual(calculateClearGoldSummary(hard.gates), {
    tradableGold: 18_000,
    boundGold: 0,
    totalGold: 18_000,
  });
});
