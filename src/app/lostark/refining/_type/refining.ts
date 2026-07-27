export type TEquipmentGrade = 'aegir' | 'serka';
export type TEquipmentType = 'weapon' | 'armor';
export type TRefiningCondition = {
  equipmentGrade: TEquipmentGrade;
  equipmentType: TEquipmentType;
  fromLevel: number;
  failureBonusRate: string;
  artisanEnergy: string;
};

export type TMarketMaterialId =
  | 'aegir-destruction-stone'
  | 'aegir-guardian-stone'
  | 'aegir-leapstone'
  | 'aegir-fusion'
  | 'serka-destruction-crystal'
  | 'serka-guardian-crystal'
  | 'serka-great-leapstone'
  | 'serka-advanced-fusion'
  | 'fate-shard'
  | 'weapon-lava-breath'
  | 'armor-glacier-breath'
  | 'weapon-metallurgy-11-14'
  | 'armor-tailoring-11-14'
  | 'weapon-metallurgy-15-18'
  | 'armor-tailoring-15-18'
  | 'weapon-metallurgy-19-20'
  | 'armor-tailoring-19-20'
  | 'weapon-metallurgy-enhanced-19-20'
  | 'armor-tailoring-enhanced-19-20';

export type TMaterialAmount = { id: TMarketMaterialId; quantity: number };
export type TMaterialForm = { price: string; owned: string; isValuedAtMarket: boolean };
export type TMaterialForms = Partial<Record<TMarketMaterialId, TMaterialForm>>;
export type TMaterialInputErrors = Partial<
  Record<TMarketMaterialId, { price?: string; owned?: string }>
>;

export type TBookOption =
  | { kind: 'none' }
  | { kind: 'normal'; rateBonus: number; materialId: TMarketMaterialId }
  | { kind: 'enhanced'; rateBonus: number; materialId: TMarketMaterialId };

export type TRefiningStep = {
  equipmentGrade: TEquipmentGrade;
  equipmentType: TEquipmentType;
  fromLevel: number;
  initialRate: number;
  breathMax: number;
  breathRateBonus: number;
  breathMaterialId: TMarketMaterialId;
  requiredMaterials: readonly TMaterialAmount[];
  gold: number;
  silver: number;
  books: readonly TBookOption[];
};

export type TOwnedMaterial = { quantity: number; isValuedAtMarket: boolean };
export type TRefiningPlanInput = {
  step: TRefiningStep;
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
  expectedSilver: number;
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
    silver: number;
    conditionalActions: readonly {
      failureBonusRate: number;
      artisanEnergy: number;
      action: TRefiningAction;
      immediateGold: number;
    }[];
  };
};
