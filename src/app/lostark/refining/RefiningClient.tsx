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
  TMarketMaterialId,
  TRefiningCondition,
  TRefiningPlan,
} from '@/app/lostark/refining/_type/refining';
import type {
  TRefiningWorkerRequest,
  TRefiningWorkerResponse,
} from '@/app/lostark/refining/_type/refiningWorker';
import {
  createDefaultMaterialForm,
  createMaterialForms,
  getRelevantMaterialIds,
  hasRefiningInputErrors,
  validateRefiningInput,
} from '@/app/lostark/refining/_util/refiningInput';
import type { TRefiningInputErrors } from '@/app/lostark/refining/_util/refiningInput';
import styles from '@/app/lostark/refining/refiningClient.module.scss';

const REFINING_TABS: { value: string; label: string }[] = [
  { value: 'standard-refining', label: '일반재련' },
  { value: 'advanced-refining', label: '상급재련' },
];

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
    createMaterialForms(getRelevantMaterialIds(initialStep)),
  );
  const [errors, setErrors] = useState<TRefiningInputErrors>({});
  const [plan, setPlan] = useState<TRefiningPlan>();
  const [calculationError, setCalculationError] = useState<string>();
  const [isCalculating, setIsCalculating] = useState(false);
  const workerRef = useRef<Worker | undefined>(undefined);
  const requestIdRef = useRef(0);

  const step = useMemo(
    () => getRefiningStep(condition.equipmentGrade, condition.equipmentType, condition.fromLevel),
    [condition.equipmentGrade, condition.equipmentType, condition.fromLevel],
  );
  const materialIds = useMemo(() => getRelevantMaterialIds(step), [step]);
  const hasErrors = hasRefiningInputErrors(errors);

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
      [id]: { ...(current[id] ?? createDefaultMaterialForm()), ...next },
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
    const validation = validateRefiningInput({ condition, materials, materialIds, step });
    setErrors(validation.errors);
    if (!validation.input) {
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
          ...validation.input,
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
