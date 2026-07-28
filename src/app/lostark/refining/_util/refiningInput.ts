import type {
  TMarketMaterialId,
  TMaterialForm,
  TMaterialForms,
  TMaterialInputErrors,
  TOwnedMaterial,
  TRefiningCondition,
  TRefiningPlanInput,
  TRefiningStep,
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

export function getRelevantMaterialIds(step: TRefiningStep) {
  return [
    ...step.requiredMaterials.map((material) => material.id),
    step.breathMaterialId,
    ...step.books.flatMap((book) => (book.kind === 'none' ? [] : [book.materialId])),
  ].filter((id, index, ids) => ids.indexOf(id) === index);
}

export function createMaterialForms(ids: readonly TMarketMaterialId[]): TMaterialForms {
  return Object.fromEntries(ids.map((id) => [id, createDefaultMaterialForm()])) as TMaterialForms;
}

export function createDefaultMaterialForm(): TMaterialForm {
  return { price: '', owned: '0', isZeroValued: false };
}

export function hasRefiningInputErrors(errors: TRefiningInputErrors) {
  return (
    Boolean(errors.failureBonusRate || errors.artisanEnergy) ||
    Object.values(errors.materials ?? {}).some((error) => error.price || error.owned)
  );
}

export function validateRefiningInput(props: {
  condition: TRefiningCondition;
  materials: TMaterialForms;
  step: TRefiningStep;
}): { errors: TRefiningInputErrors; input?: TValidatedRefiningInput } {
  const { condition, materials, step } = props;
  const materialIds = getRelevantMaterialIds(step);
  const errors: TRefiningInputErrors = {};
  const materialErrors: TMaterialInputErrors = {};
  const failureBonusRate = parseFailureBonusRate(condition.failureBonusRate);
  if (failureBonusRate === undefined || failureBonusRate > step.initialRate)
    errors.failureBonusRate = `실패로 추가된 확률은 0부터 ${(step.initialRate / 100).toFixed(2)}% 사이로 입력해 주세요.`;
  if (!/^\d+(?:\.\d{1,6})?$/.test(condition.artisanEnergy) || Number(condition.artisanEnergy) > 100)
    errors.artisanEnergy = '장인의 기운은 0부터 100 사이의 숫자로 입력해 주세요.';

  const prices = {} as Record<TMarketMaterialId, number>;
  const ownedMaterials: Partial<Record<TMarketMaterialId, TOwnedMaterial>> = {};
  for (const id of materialIds) {
    const form = materials[id] ?? createDefaultMaterialForm();
    const price = Number(form.price);
    const owned = Number(form.owned);
    if (form.price.trim() === '' || !Number.isFinite(price) || price < 0)
      materialErrors[id] = {
        ...materialErrors[id],
        price: '개당 단가는 0 이상의 숫자로 입력해 주세요.',
      };
    else prices[id] = price;
    if (!Number.isInteger(owned) || owned < 0)
      materialErrors[id] = {
        ...materialErrors[id],
        owned: '보유 수량은 0 이상의 정수로 입력해 주세요.',
      };
    else ownedMaterials[id] = { quantity: owned, isZeroValued: form.isZeroValued };
  }
  if (Object.keys(materialErrors).length > 0) errors.materials = materialErrors;
  if (hasRefiningInputErrors(errors)) return { errors };

  return {
    errors,
    input: {
      failureBonusRate: failureBonusRate ?? 0,
      artisanEnergy: condition.artisanEnergy,
      prices,
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
