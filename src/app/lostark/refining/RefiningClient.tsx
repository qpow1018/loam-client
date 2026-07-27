'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import Tabs from '@/components/common/tabs/Tabs';

import RefiningConditionPanel from '@/app/lostark/refining/_component/RefiningConditionPanel';
import RefiningMaterialInputPanel from '@/app/lostark/refining/_component/RefiningMaterialInputPanel';
import RefiningResultPanel from '@/app/lostark/refining/_component/RefiningResultPanel';
import { getRefiningStep } from '@/app/lostark/refining/_define/refiningSteps';
import type {
  TMaterialForm,
  TMaterialForms,
  TMaterialInputErrors,
  TMarketMaterialId,
  TRefiningCondition,
  TRefiningPlan,
} from '@/app/lostark/refining/_type/refining';
import type {
  TRefiningWorkerRequest,
  TRefiningWorkerResponse,
} from '@/app/lostark/refining/_type/refiningWorker';
import styles from '@/app/lostark/refining/refiningClient.module.scss';

const REFINING_TABS: { value: string; label: string }[] = [
  { value: 'standard-refining', label: '일반재련' },
  { value: 'advanced-refining', label: '상급재련' },
];

type TErrors = {
  failureBonusRate?: string;
  artisanEnergy?: string;
  materials?: TMaterialInputErrors;
};

function relevantMaterialIds(step: ReturnType<typeof getRefiningStep>) {
  return [
    ...step.requiredMaterials.map((material) => material.id),
    step.breathMaterialId,
    ...step.books.flatMap((book) => (book.kind === 'none' ? [] : [book.materialId])),
  ].filter((id, index, ids) => ids.indexOf(id) === index);
}

function initialMaterialForms(ids: readonly TMarketMaterialId[]): TMaterialForms {
  return Object.fromEntries(
    ids.map((id) => [id, { price: '', owned: '0', isValuedAtMarket: false }]),
  ) as TMaterialForms;
}

function defaultMaterialForm(): TMaterialForm {
  return { price: '', owned: '0', isValuedAtMarket: false };
}

function parseFailureBonusRate(value: string) {
  const normalized = value.trim().replace(/%$/, '');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return undefined;
  const [whole, fractional = ''] = normalized.split('.');
  return Number(whole) * 100 + Number(`${fractional}00`.slice(0, 2));
}

export default function RefiningClient() {
  const [activeTab, setActiveTab] = useState<string>(REFINING_TABS[0].value);
  const [condition, setCondition] = useState<TRefiningCondition>({
    equipmentGrade: 'aegir',
    equipmentType: 'weapon',
    fromLevel: 10,
    failureBonusRate: '0',
    artisanEnergy: '0',
  });
  const initialStep = getRefiningStep('aegir', 'weapon', 10);
  const [materials, setMaterials] = useState<TMaterialForms>(() =>
    initialMaterialForms(relevantMaterialIds(initialStep)),
  );
  const [errors, setErrors] = useState<TErrors>({});
  const [plan, setPlan] = useState<TRefiningPlan>();
  const [calculationError, setCalculationError] = useState<string>();
  const [isCalculating, setIsCalculating] = useState(false);
  const workerRef = useRef<Worker | undefined>(undefined);
  const requestIdRef = useRef(0);

  const step = useMemo(
    () => getRefiningStep(condition.equipmentGrade, condition.equipmentType, condition.fromLevel),
    [condition.equipmentGrade, condition.equipmentType, condition.fromLevel],
  );
  const materialIds = useMemo(() => relevantMaterialIds(step), [step]);
  const hasErrors =
    Boolean(errors.failureBonusRate || errors.artisanEnergy) ||
    Object.values(errors.materials ?? {}).some((error) => error.price || error.owned);

  useEffect(
    () => () => {
      workerRef.current?.terminate();
    },
    [],
  );

  function cancelCalculation() {
    requestIdRef.current += 1;
    workerRef.current?.terminate();
    workerRef.current = undefined;
    setIsCalculating(false);
  }

  function invalidateResult() {
    cancelCalculation();
    setPlan(undefined);
    setCalculationError(undefined);
  }

  function handleConditionChange(nextCondition: TRefiningCondition) {
    setCondition(nextCondition);
    setErrors((current) => ({ ...current, failureBonusRate: undefined, artisanEnergy: undefined }));
    invalidateResult();
  }

  function handleMaterialChange(
    id: TMarketMaterialId,
    next: Partial<TMaterialForm>,
    errorField?: 'price' | 'owned',
  ) {
    setMaterials((current) => ({
      ...current,
      [id]: { ...(current[id] ?? defaultMaterialForm()), ...next },
    }));
    if (errorField) {
      setErrors((current) => ({
        ...current,
        materials: {
          ...current.materials,
          [id]: { ...current.materials?.[id], [errorField]: undefined },
        },
      }));
    }
    invalidateResult();
  }

  function handleCalculate() {
    const nextErrors: TErrors = {};
    const materialErrors: TMaterialInputErrors = {};
    const parsedFailureBonusRate = parseFailureBonusRate(condition.failureBonusRate);
    if (parsedFailureBonusRate === undefined || parsedFailureBonusRate > step.initialRate)
      nextErrors.failureBonusRate = `실패로 추가된 확률은 0부터 ${(step.initialRate / 100).toFixed(2)}% 사이로 입력해 주세요.`;
    if (
      !/^\d+(?:\.\d{1,6})?$/.test(condition.artisanEnergy) ||
      Number(condition.artisanEnergy) > 100
    )
      nextErrors.artisanEnergy = '장인의 기운은 0부터 100 사이의 숫자로 입력해 주세요.';

    const prices = {} as Record<TMarketMaterialId, number>;
    const ownedMaterials: Partial<
      Record<TMarketMaterialId, { quantity: number; isValuedAtMarket: boolean }>
    > = {};
    for (const id of materialIds) {
      const form = materials[id] ?? defaultMaterialForm();
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
      else ownedMaterials[id] = { quantity: owned, isValuedAtMarket: form.isValuedAtMarket };
    }
    if (Object.keys(materialErrors).length > 0) nextErrors.materials = materialErrors;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      invalidateResult();
      return;
    }

    cancelCalculation();
    setPlan(undefined);
    setCalculationError(undefined);
    setIsCalculating(true);
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      const worker = new Worker(new URL('./_worker/refining.worker.ts', import.meta.url), {
        type: 'module',
      });
      workerRef.current = worker;

      worker.addEventListener('message', (event: MessageEvent<TRefiningWorkerResponse>) => {
        if (event.data.requestId !== requestIdRef.current) return;
        worker.terminate();
        workerRef.current = undefined;
        setIsCalculating(false);

        if ('error' in event.data) {
          setCalculationError(
            '계산 중 오류가 발생했습니다. 입력값을 확인한 뒤 다시 시도해 주세요.',
          );
          return;
        }
        setPlan(event.data.plan);
      });
      worker.addEventListener('error', () => {
        if (requestId !== requestIdRef.current) return;
        worker.terminate();
        workerRef.current = undefined;
        setIsCalculating(false);
        setCalculationError('계산 중 오류가 발생했습니다. 입력값을 확인한 뒤 다시 시도해 주세요.');
      });

      const request: TRefiningWorkerRequest = {
        requestId,
        input: {
          step,
          failureBonusRate: parsedFailureBonusRate ?? 0,
          artisanEnergy: condition.artisanEnergy,
          prices,
          ownedMaterials,
        },
      };
      worker.postMessage(request);
    } catch {
      workerRef.current = undefined;
      setIsCalculating(false);
      setPlan(undefined);
      setCalculationError('계산 중 오류가 발생했습니다. 입력값을 확인한 뒤 다시 시도해 주세요.');
    }
  }

  return (
    <main className={styles['refining-page']}>
      <div className={styles['tab-section']}>
        <Tabs options={REFINING_TABS} value={activeTab} onChange={setActiveTab} />
      </div>

      <RefiningConditionPanel condition={condition} onChange={handleConditionChange} />

      <div className={styles['content-grid']}>
        <RefiningMaterialInputPanel
          materialIds={materialIds}
          materials={materials}
          materialErrors={errors.materials ?? {}}
          hasErrors={hasErrors}
          isCalculating={isCalculating}
          onMaterialChange={handleMaterialChange}
          onCalculate={handleCalculate}
        />

        <RefiningResultPanel
          plan={plan}
          calculationError={calculationError}
          isCalculating={isCalculating}
          materialIds={materialIds}
          step={step}
        />
      </div>
    </main>
  );
}
