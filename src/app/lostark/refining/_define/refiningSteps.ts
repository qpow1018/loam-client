import type {
  TBookOption,
  TMaterialAmount,
  TRefiningPart,
  TRefiningRegion,
  TRefiningStep,
} from '../_type/refining';

type TRow = readonly [number, number, number, number, number, number];
const NONE: TBookOption = { kind: 'none' };
const BOOK = (
  rateBonus: number,
  materialId: Exclude<TMaterialAmount['id'], 'fate-shard'>,
): readonly TBookOption[] => [NONE, { kind: 'normal', rateBonus, materialId }];
const DUAL_BOOK = (
  normal: number,
  enhanced: number,
  normalMaterialId: Exclude<TMaterialAmount['id'], 'fate-shard'>,
  enhancedMaterialId: Exclude<TMaterialAmount['id'], 'fate-shard'>,
): readonly TBookOption[] => [
  NONE,
  { kind: 'normal', rateBonus: normal, materialId: normalMaterialId },
  { kind: 'enhanced', rateBonus: enhanced, materialId: enhancedMaterialId },
];
const AEGIR_RATES: Record<number, readonly [number, number, number]> = {
  10: [1000, 20, 50],
  12: [500, 20, 25],
  14: [400, 20, 20],
  16: [300, 20, 15],
  18: [300, 20, 15],
  19: [150, 25, 6],
  20: [150, 25, 6],
  21: [100, 25, 4],
  23: [50, 50, 2],
};
const SERKA_RATES: Record<number, readonly [number, number, number]> = {
  11: [500, 20, 25],
  13: [400, 20, 20],
  16: [300, 25, 12],
  19: [150, 25, 6],
  21: [100, 25, 4],
  23: [50, 50, 2],
};
function rateFor(region: TRefiningRegion, from: number) {
  const source = region === 'aegir' ? AEGIR_RATES : SERKA_RATES;
  const key = Object.keys(source)
    .map(Number)
    .filter((entry) => entry <= from)
    .sort((a, b) => b - a)[0];
  return source[key];
}
function aegirBooks(part: TRefiningPart, from: number): readonly TBookOption[] {
  const prefix = part === 'weapon' ? 'weapon-metallurgy' : 'armor-tailoring';
  const bookId = (suffix: string) =>
    `${prefix}-${suffix}` as Extract<TMaterialAmount['id'], `${typeof prefix}${string}`>;
  if (from <= 11) return BOOK(1000, bookId('11-14'));
  if (from <= 13) return BOOK(500, bookId('11-14'));
  if (from <= 15) return BOOK(400, bookId('15-18'));
  if (from <= 17) return BOOK(300, bookId('15-18'));
  if (from === 18) return DUAL_BOOK(300, 600, bookId('19-20'), bookId('enhanced-19-20'));
  if (from === 19) return DUAL_BOOK(150, 300, bookId('19-20'), bookId('enhanced-19-20'));
  return [NONE];
}
const AEGIR_WEAPON: readonly TRow[] = [
  [1250, 18, 12, 5000, 1296, 55000],
  [1300, 21, 12, 5300, 1432, 55000],
  [1400, 24, 15, 7600, 1592, 55000],
  [1550, 27, 15, 8200, 1760, 55000],
  [1700, 30, 18, 8800, 1944, 55000],
  [1950, 33, 18, 9400, 2136, 55000],
  [2200, 36, 25, 12000, 2352, 65000],
  [2450, 39, 25, 12900, 2576, 65000],
  [2700, 42, 25, 13700, 3510, 65000],
  [2950, 45, 35, 16000, 3830, 90000],
  [3200, 48, 35, 17100, 4160, 90000],
  [3700, 52, 35, 18200, 4510, 120000],
  [4000, 56, 35, 19200, 4870, 120000],
  [4200, 60, 50, 20400, 5250, 150000],
  [4500, 65, 50, 21500, 5650, 150000],
];
const AEGIR_ARMOR: readonly TRow[] = [
  [750, 11, 7, 3000, 776, 33000],
  [780, 13, 7, 3180, 856, 33000],
  [840, 14, 9, 4560, 952, 33000],
  [930, 16, 9, 4920, 1056, 33000],
  [1020, 18, 11, 5280, 1168, 33000],
  [1170, 20, 11, 5640, 1280, 33000],
  [1320, 22, 15, 7200, 1408, 39000],
  [1470, 23, 15, 7740, 1544, 39000],
  [1620, 25, 15, 8220, 2110, 39000],
  [1770, 27, 21, 9600, 2300, 54000],
  [1920, 29, 21, 10260, 2500, 54000],
  [2220, 31, 21, 10920, 2710, 72000],
  [2400, 34, 21, 11520, 2920, 72000],
  [2520, 36, 30, 12240, 3150, 90000],
  [2700, 40, 30, 12900, 3390, 90000],
];
const SERKA_WEAPON: readonly TRow[] = [
  [1700, 17, 18, 15890, 4050, 22000],
  [1890, 19, 21, 17660, 4500, 22000],
  [2080, 21, 23, 19420, 4950, 22000],
  [2270, 23, 25, 21190, 5400, 22000],
  [2460, 25, 27, 22960, 5850, 22000],
  [2690, 28, 29, 25120, 6400, 26000],
  [2900, 30, 32, 27080, 6900, 26000],
  [3110, 32, 34, 29040, 7400, 26000],
  [3340, 34, 37, 31200, 7950, 36000],
  [3570, 37, 39, 33360, 8500, 36000],
  [3800, 39, 42, 35520, 9050, 48000],
  [4030, 42, 44, 37680, 9600, 48000],
  [4260, 44, 47, 39840, 10150, 60000],
  [4500, 47, 50, 42000, 10700, 60000],
];
const SERKA_ARMOR: readonly TRow[] = [
  [930, 11, 11, 9570, 2450, 13200],
  [1030, 12, 12, 10540, 2700, 13200],
  [1120, 13, 13, 11520, 2950, 13200],
  [1240, 14, 15, 12690, 3250, 13200],
  [1330, 15, 16, 13670, 3500, 13200],
  [1450, 17, 17, 14840, 3800, 15600],
  [1560, 18, 19, 16010, 4100, 15600],
  [1700, 20, 20, 17380, 4450, 15600],
  [1810, 21, 22, 18550, 4750, 21600],
  [1950, 23, 23, 19920, 5100, 21600],
  [2080, 24, 25, 21280, 5450, 28800],
  [2200, 26, 26, 22460, 5750, 28800],
  [2330, 27, 28, 23820, 6100, 36000],
  [2450, 29, 30, 25000, 6400, 36000],
];
function make(
  region: TRefiningRegion,
  part: TRefiningPart,
  fromLevel: number,
  row: TRow,
): TRefiningStep {
  const [stone, leap, fusion, fate, gold, silver] = row;
  const [initialRate, breathMax, breathRateBonus] = rateFor(region, fromLevel);
  const prefix = region === 'aegir' ? 'aegir' : 'serka';
  const stoneId =
    `${prefix}-${part === 'weapon' ? (region === 'aegir' ? 'destruction-stone' : 'destruction-crystal') : region === 'aegir' ? 'guardian-stone' : 'guardian-crystal'}` as TMaterialAmount['id'];
  const leapId =
    `${prefix}-${region === 'aegir' ? 'leapstone' : 'great-leapstone'}` as TMaterialAmount['id'];
  const fusionId =
    `${prefix}-${region === 'aegir' ? 'fusion' : 'advanced-fusion'}` as TMaterialAmount['id'];
  return {
    region,
    part,
    fromLevel,
    initialRate,
    breathMax,
    breathRateBonus,
    breathMaterialId: part === 'weapon' ? 'weapon-lava-breath' : 'armor-glacier-breath',
    requiredMaterials: [
      { id: stoneId, quantity: stone },
      { id: leapId, quantity: leap },
      { id: fusionId, quantity: fusion },
      { id: 'fate-shard', quantity: fate },
    ],
    gold,
    silver,
    books: region === 'aegir' ? aegirBooks(part, fromLevel) : [NONE],
  };
}
export const REFINING_STEPS: readonly TRefiningStep[] = [
  ...AEGIR_WEAPON.map((row, index) => make('aegir', 'weapon', index + 10, row)),
  ...AEGIR_ARMOR.map((row, index) => make('aegir', 'armor', index + 10, row)),
  ...SERKA_WEAPON.map((row, index) => make('serka', 'weapon', index + 11, row)),
  ...SERKA_ARMOR.map((row, index) => make('serka', 'armor', index + 11, row)),
];
export function getRefiningStep(region: TRefiningRegion, part: TRefiningPart, fromLevel: number) {
  const step = REFINING_STEPS.find(
    (item) => item.region === region && item.part === part && item.fromLevel === fromLevel,
  );
  if (!step) throw new Error(`Unsupported refining step: ${region}/${part}/+${fromLevel}`);
  return step;
}
