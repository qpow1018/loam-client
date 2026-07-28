import type {
  TRefiningMaterialId,
  TRefiningMaterialInputs,
  TRefiningOwnedMaterials,
  TRefiningCondition,
  TRefiningPlanInput,
  TRefiningRule,
} from '@/app/lostark/refining/_type/refining';

export type TValidatedRefiningInput = Pick<
  TRefiningPlanInput,
  'failureBonusRate' | 'artisanEnergy' | 'prices' | 'ownedMaterials'
>;

export function validateRefiningInput(props: {
  condition: TRefiningCondition;
  marketPrices: Readonly<Record<TRefiningMaterialId, number>>;
  materials: TRefiningMaterialInputs;
  step: TRefiningRule;
}): TValidatedRefiningInput | undefined {
  const { condition, marketPrices, materials, step } = props;
  const materialIds = step.inputMaterialIds;
  const failureBonusRate = parseFailureBonusRate(condition.failureBonusRate);
  if (failureBonusRate === undefined || failureBonusRate > step.initialRate) return undefined;
  if (!/^\d+(?:\.\d{1,6})?$/.test(condition.artisanEnergy) || Number(condition.artisanEnergy) > 100)
    return undefined;

  const ownedMaterials: TRefiningOwnedMaterials = {};
  for (const id of materialIds) {
    const form = materials[id];
    if (!form) return undefined;
    const owned = Number(form.owned);
    if (!Number.isInteger(owned) || owned < 0) return undefined;
    ownedMaterials[id] = owned;
  }

  return {
    failureBonusRate,
    artisanEnergy: condition.artisanEnergy,
    prices: Object.fromEntries(
      materialIds.map((id) => [id, materials[id]?.isZeroPriced ? 0 : marketPrices[id]]),
    ) as Record<TRefiningMaterialId, number>,
    ownedMaterials,
  };
}

function parseFailureBonusRate(value: string) {
  const normalized = value.trim().replace(/%$/, '');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return undefined;
  const [whole, fractional = ''] = normalized.split('.');
  return Number(whole) * 100 + Number(`${fractional}00`.slice(0, 2));
}
