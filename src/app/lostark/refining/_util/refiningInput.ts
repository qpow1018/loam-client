import type {
  TRefiningMaterialId,
  TRefiningMaterialInputs,
  TMaterialInputErrors,
  TOwnedMaterial,
  TRefiningCondition,
  TRefiningPlanInput,
  TRefiningRule,
} from '@/app/lostark/refining/_type/refining';

export type TRefiningInputErrors = {
  failureBonusRate?: string;
  artisanEnergy?: string;
  materials?: TMaterialInputErrors;
};

export type TValidatedRefiningInput = Pick<
  TRefiningPlanInput,
  'failureBonusRate' | 'artisanEnergy' | 'prices' | 'ownedMaterials'
>;

export function hasRefiningInputErrors(errors: TRefiningInputErrors) {
  return (
    Boolean(errors.failureBonusRate || errors.artisanEnergy) ||
    Object.values(errors.materials ?? {}).some((error) => error.owned)
  );
}

export function validateRefiningInput(props: {
  condition: TRefiningCondition;
  marketPrices: Readonly<Record<TRefiningMaterialId, number>>;
  materials: TRefiningMaterialInputs;
  step: TRefiningRule;
}): { errors: TRefiningInputErrors; input?: TValidatedRefiningInput } {
  const { condition, marketPrices, materials, step } = props;
  const materialIds = step.inputMaterialIds;
  const errors: TRefiningInputErrors = {};
  const materialErrors: TMaterialInputErrors = {};
  const failureBonusRate = parseFailureBonusRate(condition.failureBonusRate);
  if (failureBonusRate === undefined || failureBonusRate > step.initialRate)
    errors.failureBonusRate = `실패로 추가된 확률은 0부터 ${(step.initialRate / 100).toFixed(2)}% 사이로 입력해 주세요.`;
  if (!/^\d+(?:\.\d{1,6})?$/.test(condition.artisanEnergy) || Number(condition.artisanEnergy) > 100)
    errors.artisanEnergy = '장인의 기운은 0부터 100 사이의 숫자로 입력해 주세요.';

  const ownedMaterials: Partial<Record<TRefiningMaterialId, TOwnedMaterial>> = {};
  for (const id of materialIds) {
    const form = materials[id];
    if (!form) {
      materialErrors[id] = { owned: '보유 수량은 0 이상의 정수로 입력해 주세요.' };
      continue;
    }
    const owned = Number(form.owned);
    if (!Number.isInteger(owned) || owned < 0)
      materialErrors[id] = {
        ...materialErrors[id],
        owned: '보유 수량은 0 이상의 정수로 입력해 주세요.',
      };
    else ownedMaterials[id] = { quantity: owned };
  }
  if (Object.keys(materialErrors).length > 0) errors.materials = materialErrors;
  if (hasRefiningInputErrors(errors)) return { errors };

  return {
    errors,
    input: {
      failureBonusRate: failureBonusRate ?? 0,
      artisanEnergy: condition.artisanEnergy,
      prices: Object.fromEntries(
        materialIds.map((id) => [id, materials[id]?.isZeroPriced ? 0 : marketPrices[id]]),
      ) as Record<TRefiningMaterialId, number>,
      ownedMaterials,
    },
  };
}

function parseFailureBonusRate(value: string) {
  const normalized = value.trim().replace(/%$/, '');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return undefined;
  const [whole, fractional = ''] = normalized.split('.');
  return Number(whole) * 100 + Number(`${fractional}00`.slice(0, 2));
}
