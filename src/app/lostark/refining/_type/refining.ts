export type TEquipmentGrade = 'aegir' | 'serka';
export type TEquipmentType = 'weapon' | 'armor';
export type TRefiningCondition = {
  equipmentGrade: TEquipmentGrade;
  equipmentType: TEquipmentType;
  fromLevel: number;
  failureBonusRate: string;
  artisanEnergy: string;
};

export type TRefiningRateRule = {
  initialRate: number;
  breathMax: number;
  breathRateBonus: number;
};
export type TMarketMaterialId =
  | 'aegir-destruction'
  | 'aegir-guardian'
  | 'aegir-leapstone'
  | 'aegir-abidos'
  | 'serka-destruction'
  | 'serka-guardian'
  | 'serka-leapstone'
  | 'serka-abidos'
  | 'fate-shard'
  | 'weapon-breath'
  | 'armor-breath'
  | 'weapon-book-11-14'
  | 'armor-book-11-14'
  | 'weapon-book-15-18'
  | 'armor-book-15-18'
  | 'weapon-book-19-20'
  | 'armor-book-19-20'
  | 'weapon-strong-book-19-20'
  | 'armor-strong-book-19-20';

export type TRefiningCostRule = {
  fromLevel: number;
  gold: number;
  shilling: number;
} & Partial<Record<TMarketMaterialId, number>>;

export type TMaterialAmount = { id: TMarketMaterialId; quantity: number };
export type TBookOption =
  | { kind: 'none' }
  | { kind: 'normal'; rateBonus: number; materialId: TMarketMaterialId }
  | { kind: 'enhanced'; rateBonus: number; materialId: TMarketMaterialId };

export type TRefiningRule = {
  equipmentGrade: TEquipmentGrade;
  equipmentType: TEquipmentType;
  fromLevel: number;
  initialRate: number;
  breathMax: number;
  breathRateBonus: number;
  breathMaterialId: TMarketMaterialId;
  requiredMaterials: readonly TMaterialAmount[];
  gold: number;
  shilling: number;
  books: readonly TBookOption[];
};

// TODO check
export type TMaterialForm = { price: string; owned: string; isZeroValued: boolean };
export type TMaterialForms = Partial<Record<TMarketMaterialId, TMaterialForm>>;
export type TMaterialInputErrors = Partial<
  Record<TMarketMaterialId, { price?: string; owned?: string }>
>;

export type TOwnedMaterial = { quantity: number; isZeroValued: boolean };
export type TRefiningPlanInput = {
  step: TRefiningRule;
  failureBonusRate: number;
  artisanEnergy: string;
  ownedMaterials?: Partial<Record<TMarketMaterialId, TOwnedMaterial>>;
  prices: Record<TMarketMaterialId, number>;
};

export type TRefiningAction = { breathQuantity: number; book: TBookOption; successRate: number };
export type TMaterialExpectation = {
  expectedOwnedUsed: number;
  expectedPurchased: number;
  expectedTotalUsed: number;
  expectedGold: number;
};
export type TRefiningPlan = {
  expectedGold: number;
  expectedShilling: number;
  expectedAttempts: number;
  materialExpectations: Partial<Record<TMarketMaterialId, TMaterialExpectation>>;
  goldBreakdown: { pureGold: number; marketMaterials: number };
  conditionalActions: readonly {
    failureBonusRate: number;
    artisanEnergy: number;
    action: TRefiningAction;
    immediateGold: number;
  }[];
  recommendedWorstCase: {
    attempts: number;
    gold: number;
    shilling: number;
    conditionalActions: readonly {
      failureBonusRate: number;
      artisanEnergy: number;
      action: TRefiningAction;
      immediateGold: number;
    }[];
  };
};
