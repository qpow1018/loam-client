import type {
  TBookOption,
  TEquipmentGrade,
  TEquipmentType,
  TMaterialAmount,
  TRefiningCost,
  TRefiningRateRule,
  TRefiningStep,
} from '@/app/lostark/refining/_type/refining';
import {
  AEGIR_ARMOR_COSTS,
  AEGIR_REFINING_RATE_RULES,
  AEGIR_WEAPON_COSTS,
  SERKA_ARMOR_COSTS,
  SERKA_REFINING_RATE_RULES,
  SERKA_WEAPON_COSTS,
} from '@/app/lostark/refining/_define/refiningRules';

const NONE: TBookOption = { kind: 'none' };

function createBookOptions(
  rateBonus: number,
  materialId: Exclude<TMaterialAmount['id'], 'fate-shard'>,
): readonly TBookOption[] {
  return [NONE, { kind: 'normal', rateBonus, materialId }];
}

function createDualBookOptions(
  normalRateBonus: number,
  enhancedRateBonus: number,
  normalMaterialId: Exclude<TMaterialAmount['id'], 'fate-shard'>,
  enhancedMaterialId: Exclude<TMaterialAmount['id'], 'fate-shard'>,
): readonly TBookOption[] {
  return [
    NONE,
    { kind: 'normal', rateBonus: normalRateBonus, materialId: normalMaterialId },
    { kind: 'enhanced', rateBonus: enhancedRateBonus, materialId: enhancedMaterialId },
  ];
}

function getRateRule(equipmentGrade: TEquipmentGrade, fromLevel: number): TRefiningRateRule {
  const rateRules =
    equipmentGrade === 'aegir' ? AEGIR_REFINING_RATE_RULES : SERKA_REFINING_RATE_RULES;
  const ruleLevel = Object.keys(rateRules)
    .map(Number)
    .filter((level) => level <= fromLevel)
    .sort((a, b) => b - a)[0];

  return rateRules[ruleLevel]!;
}

function getAegirBookOptions(
  equipmentType: TEquipmentType,
  fromLevel: number,
): readonly TBookOption[] {
  const prefix = equipmentType === 'weapon' ? 'weapon-metallurgy' : 'armor-tailoring';
  const bookId = (suffix: string) =>
    `${prefix}-${suffix}` as Extract<TMaterialAmount['id'], `${typeof prefix}${string}`>;

  if (fromLevel <= 11) return createBookOptions(1000, bookId('11-14'));
  if (fromLevel <= 13) return createBookOptions(500, bookId('11-14'));
  if (fromLevel <= 15) return createBookOptions(400, bookId('15-18'));
  if (fromLevel <= 17) return createBookOptions(300, bookId('15-18'));
  if (fromLevel === 18)
    return createDualBookOptions(300, 600, bookId('19-20'), bookId('enhanced-19-20'));
  if (fromLevel === 19)
    return createDualBookOptions(150, 300, bookId('19-20'), bookId('enhanced-19-20'));

  return [NONE];
}

function createRefiningStep(
  equipmentGrade: TEquipmentGrade,
  equipmentType: TEquipmentType,
  cost: TRefiningCost,
): TRefiningStep {
  const { fromLevel, stone, leapstone, fusionMaterial, fateShard, gold, silver } = cost;
  const { initialRate, breathMax, breathRateBonus } = getRateRule(equipmentGrade, fromLevel);
  const prefix = equipmentGrade === 'aegir' ? 'aegir' : 'serka';
  const stoneId =
    `${prefix}-${equipmentType === 'weapon' ? (equipmentGrade === 'aegir' ? 'destruction-stone' : 'destruction-crystal') : equipmentGrade === 'aegir' ? 'guardian-stone' : 'guardian-crystal'}` as TMaterialAmount['id'];
  const leapstoneId =
    `${prefix}-${equipmentGrade === 'aegir' ? 'leapstone' : 'great-leapstone'}` as TMaterialAmount['id'];
  const fusionMaterialId =
    `${prefix}-${equipmentGrade === 'aegir' ? 'fusion' : 'advanced-fusion'}` as TMaterialAmount['id'];

  return {
    equipmentGrade,
    equipmentType,
    fromLevel,
    initialRate,
    breathMax,
    breathRateBonus,
    breathMaterialId: equipmentType === 'weapon' ? 'weapon-lava-breath' : 'armor-glacier-breath',
    requiredMaterials: [
      { id: stoneId, quantity: stone },
      { id: leapstoneId, quantity: leapstone },
      { id: fusionMaterialId, quantity: fusionMaterial },
      { id: 'fate-shard', quantity: fateShard },
    ],
    gold,
    silver,
    books: equipmentGrade === 'aegir' ? getAegirBookOptions(equipmentType, fromLevel) : [NONE],
  };
}

const REFINING_RULES: readonly TRefiningStep[] = [
  ...AEGIR_WEAPON_COSTS.map((cost) => createRefiningStep('aegir', 'weapon', cost)),
  ...AEGIR_ARMOR_COSTS.map((cost) => createRefiningStep('aegir', 'armor', cost)),
  ...SERKA_WEAPON_COSTS.map((cost) => createRefiningStep('serka', 'weapon', cost)),
  ...SERKA_ARMOR_COSTS.map((cost) => createRefiningStep('serka', 'armor', cost)),
];

export function getAvailableRefiningLevels(
  equipmentGrade: TEquipmentGrade,
  equipmentType: TEquipmentType,
) {
  return REFINING_RULES.filter(
    (step) => step.equipmentGrade === equipmentGrade && step.equipmentType === equipmentType,
  ).map((step) => step.fromLevel);
}

export function getRefiningRule(
  equipmentGrade: TEquipmentGrade,
  equipmentType: TEquipmentType,
  fromLevel: number,
) {
  const step = REFINING_RULES.find(
    (item) =>
      item.equipmentGrade === equipmentGrade &&
      item.equipmentType === equipmentType &&
      item.fromLevel === fromLevel,
  );

  if (!step)
    throw new Error(`Unsupported refining step: ${equipmentGrade}/${equipmentType}/+${fromLevel}`);

  return step;
}
