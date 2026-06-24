import assert from 'node:assert/strict';
import test from 'node:test';

import { CLEAR_GOLD_CATEGORIES } from '../_define/clearGoldContents';
import type { TClearGoldCategory, TClearGoldGate } from '../_type/clearGold';
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

function serializeClearGoldCategories(categories: readonly TClearGoldCategory[]) {
  return categories
    .map((category) => {
      const contents = category.contents
        .map((content) => {
          const difficulties = content.difficulties
            .map((difficulty) => {
              const gates = difficulty.gates
                .map((gate) => `${gate.name}:${gate.tradableGold}:${gate.boundGold}`)
                .join(',');

              return `    ${difficulty.id}|${difficulty.name}|${difficulty.entryItemLevel}|${difficulty.updatedAt}|${gates}`;
            })
            .join('\n');

          return `  ${content.id}|${content.name}\n${difficulties}`;
        })
        .join('\n');

      return `${category.id}|${category.name}\n${contents}`;
    })
    .join('\n');
}

test('provides the approved categorized clear gold fixture', () => {
  assert.equal(
    serializeClearGoldCategories(CLEAR_GOLD_CATEGORIES),
    `shadow-raid|그림자 레이드
  shadow-belgardin|죽음의 계율자, 벨가르딘
    shadow-belgardin-nightmare|나이트메어|1780|2026.06.24|1관문:30000:0,2관문:45000:0
    shadow-belgardin-hard|하드|1770|2026.06.24|1관문:25000:0,2관문:37000:0
    shadow-belgardin-normal|노말|1750|2026.06.24|1관문:20000:0,2관문:30000:0
  shadow-serka|고통의 마녀, 세르카
    shadow-serka-nightmare|나이트메어|1740|2026.06.24|1관문:21000:0,2관문:33000:0
    shadow-serka-hard|하드|1730|2026.06.24|1관문:17500:0,2관문:26500:0
    shadow-serka-normal|노말|1710|2026.06.24|1관문:6500:6500,2관문:9500:9500
abyss-dungeon|어비스 던전
  horizon-cathedral|지평의 성당
    horizon-cathedral-stage-3|3단계|1750|2026.06.24|1관문:0:20000,2관문:0:30000
    horizon-cathedral-stage-2|2단계|1720|2026.06.24|1관문:0:16000,2관문:0:24000
    horizon-cathedral-stage-1|1단계|1700|2026.06.24|1관문:0:13500,2관문:0:16500
kazeroth-raid|카제로스 레이드
  kazeroth-finale|종막 최후의 날
    kazeroth-finale-hard|하드|1730|2026.06.24|1관문:16000:0,2관문:32000:0
    kazeroth-finale-normal|노말|1710|2026.06.24|1관문:5500:5500,2관문:10500:10500
  kazeroth-act-4|4막 파멸의 성채
    kazeroth-act-4-hard|하드|1720|2026.06.24|1관문:13500:0,2관문:24500:0
    kazeroth-act-4-normal|노말|1700|2026.06.24|1관문:5000:5000,2관문:8500:8500
  kazeroth-act-3|3막 칠흑, 폭풍의 밤
    kazeroth-act-3-hard|하드|1700|2026.06.24|1관문:2500:2500,2관문:4000:4000,3관문:7000:7000
    kazeroth-act-3-normal|노말|1680|2026.06.24|1관문:2000:2000,2관문:3500:3500,3관문:5000:5000
  kazeroth-act-2|2막 아브렐슈드
    kazeroth-act-2-hard|하드|1690|2026.06.24|1관문:3750:3750,2관문:7750:7750
    kazeroth-act-2-normal|노말|1670|2026.06.24|1관문:2750:2750,2관문:5500:5500
  kazeroth-act-1|1막 에기르
    kazeroth-act-1-hard|하드|1680|2026.06.24|1관문:2750:2750,2관문:6250:6250
    kazeroth-act-1-normal|노말|1660|2026.06.24|1관문:1750:1750,2관문:4000:4000
  kazeroth-prologue|서막 에키드나
    kazeroth-prologue-hard|하드|1640|2026.06.24|1관문:1100:1100,2관문:2500:2500
    kazeroth-prologue-normal|노말|1620|2026.06.24|1관문:0:1900,2관문:0:4200`,
  );
});
