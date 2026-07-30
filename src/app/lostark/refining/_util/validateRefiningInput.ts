import type {
  TRefiningMaterialId,
  TRefiningMaterialInputs,
  TRefiningOwnedMaterials,
  TRefiningCondition,
  TRefiningPlanInput,
  TRefiningRule,
} from '@/app/lostark/refining/_type/refining';

type TValidatedRefiningInput = Pick<
  TRefiningPlanInput,
  'failureBonusRate' | 'artisanEnergy' | 'prices' | 'ownedMaterials'
>;

export function validateRefiningInput(props: {
  condition: TRefiningCondition;
  marketPrices: Readonly<Record<TRefiningMaterialId, number>>;
  materials: TRefiningMaterialInputs;
  refiningRule: TRefiningRule;
}): TValidatedRefiningInput | undefined {
  const { condition, marketPrices, materials, refiningRule } = props;
  const materialIds = refiningRule.inputMaterialIds;
  const failureBonusRate = parseFailureBonusRate(condition.failureBonusRate);
  if (failureBonusRate === undefined || failureBonusRate > refiningRule.initialRate)
    return undefined;
  if (!/^\d+(?:\.\d{1,6})?$/.test(condition.artisanEnergy) || Number(condition.artisanEnergy) > 100)
    return undefined;

  const ownedMaterials: TRefiningOwnedMaterials = {};
  const prices = { ...marketPrices };
  for (const id of materialIds) {
    const form = materials[id];
    if (!form) return undefined;
    const normalizedOwned = form.owned.trim();
    const owned = normalizedOwned === '' ? 0 : Number(normalizedOwned);
    if (!Number.isInteger(owned) || owned < 0) return undefined;
    ownedMaterials[id] = owned;
    prices[id] = form.isZeroPriced ? 0 : marketPrices[id];
  }

  return {
    failureBonusRate,
    artisanEnergy: condition.artisanEnergy,
    prices,
    ownedMaterials,
  };
}

function parseFailureBonusRate(value: string) {
  const normalized = value.trim().replace(/%$/, '');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return undefined;
  const [whole, fractional = ''] = normalized.split('.');
  return Number(whole) * 100 + Number(`${fractional}00`.slice(0, 2));
}
