import type {
  TBookOption,
  TEquipmentGrade,
  TEquipmentType,
  TMaterialAmount,
  TRefiningMaterialId,
  TRefiningCostRule,
  TRefiningRateRule,
  TRefiningRule,
} from '@/app/lostark/refining/_type/refining';
import {
  AEGIR_ARMOR_COSTS,
  AEGIR_REFINING_RATE_RULES,
  AEGIR_WEAPON_COSTS,
  SERKA_ARMOR_COSTS,
  SERKA_REFINING_RATE_RULES,
  SERKA_WEAPON_COSTS,
} from '@/app/lostark/refining/_define/refiningRules';

function getBookOptions(
  equipmentGrade: TEquipmentGrade,
  equipmentType: TEquipmentType,
  fromLevel: number,
): readonly TBookOption[] {
  const noBook: TBookOption = { kind: 'none' };

  if (equipmentGrade === 'serka') {
    return [noBook];
  }

  const prefix = equipmentType === 'weapon' ? 'weapon' : 'armor';
  const bookId = (bookType: 'book' | 'strong-book', levelRange: string) =>
    `${prefix}-${bookType}-${levelRange}` as Extract<
      TMaterialAmount['id'],
      `${typeof prefix}${string}`
    >;

  if (fromLevel <= 11) {
    return [noBook, { kind: 'normal', rateBonus: 1000, materialId: bookId('book', '11-14') }];
  }
  if (fromLevel <= 13) {
    return [noBook, { kind: 'normal', rateBonus: 500, materialId: bookId('book', '11-14') }];
  }
  if (fromLevel <= 15) {
    return [noBook, { kind: 'normal', rateBonus: 400, materialId: bookId('book', '15-18') }];
  }
  if (fromLevel <= 17) {
    return [noBook, { kind: 'normal', rateBonus: 300, materialId: bookId('book', '15-18') }];
  }
  if (fromLevel === 18) {
    return [
      noBook,
      { kind: 'normal', rateBonus: 300, materialId: bookId('book', '19-20') },
      { kind: 'enhanced', rateBonus: 600, materialId: bookId('strong-book', '19-20') },
    ];
  }
  if (fromLevel === 19) {
    return [
      noBook,
      { kind: 'normal', rateBonus: 150, materialId: bookId('book', '19-20') },
      { kind: 'enhanced', rateBonus: 300, materialId: bookId('strong-book', '19-20') },
    ];
  }

  return [noBook];
}

function getRefiningRateRule(
  equipmentGrade: TEquipmentGrade,
  fromLevel: number,
): TRefiningRateRule {
  const rateRules: Readonly<Record<number, TRefiningRateRule>> =
    equipmentGrade === 'aegir' ? AEGIR_REFINING_RATE_RULES : SERKA_REFINING_RATE_RULES;
  const ruleLevel = Object.keys(rateRules)
    .map(Number)
    .filter((level) => level <= fromLevel)
    .sort((a, b) => b - a)[0];

  if (ruleLevel === undefined)
    throw new Error(`Unsupported refining rate rule: ${equipmentGrade}/+${fromLevel}`);

  return rateRules[ruleLevel];
}

function createRefiningRule(
  equipmentGrade: TEquipmentGrade,
  equipmentType: TEquipmentType,
  costRule: TRefiningCostRule,
): TRefiningRule {
  const { fromLevel, gold, shilling, ...materialQuantities } = costRule;

  const rateRule = getRefiningRateRule(equipmentGrade, fromLevel);
  console.log('-- rateRule', rateRule);

  const requiredMaterials = Object.entries(materialQuantities).map(([id, quantity]) => ({
    id: id as TMaterialAmount['id'],
    quantity: quantity as number,
  }));
  const breathMaterialId: TRefiningMaterialId =
    equipmentType === 'weapon' ? 'weapon-breath' : 'armor-breath';
  const books = getBookOptions(equipmentGrade, equipmentType, fromLevel);
  const inputMaterialIds = [
    ...requiredMaterials.map((material) => material.id),
    breathMaterialId,
    ...books.flatMap((book) => (book.kind === 'none' ? [] : [book.materialId])),
  ].filter((id, index, ids) => ids.indexOf(id) === index);

  return {
    equipmentGrade,
    equipmentType,
    fromLevel,
    ...rateRule,
    breathMaterialId,
    requiredMaterials,
    inputMaterialIds,
    gold,
    shilling,
    books,
  };
}

const REFINING_RULES: readonly TRefiningRule[] = [
  ...AEGIR_WEAPON_COSTS.map((cost) => createRefiningRule('aegir', 'weapon', cost)),
  ...AEGIR_ARMOR_COSTS.map((cost) => createRefiningRule('aegir', 'armor', cost)),
  ...SERKA_WEAPON_COSTS.map((cost) => createRefiningRule('serka', 'weapon', cost)),
  ...SERKA_ARMOR_COSTS.map((cost) => createRefiningRule('serka', 'armor', cost)),
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
