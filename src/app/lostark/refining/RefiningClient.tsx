'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import BoxLoading from '@/components/common/loading/BoxLoading';
import Tabs from '@/components/common/tabs/Tabs';
import Button from '@/components/common/button/Button';

import RefiningConditionPanel from '@/app/lostark/refining/_component/RefiningConditionPanel';
import { getRefiningStep } from '@/app/lostark/refining/_define/refiningSteps';
import type {
  TBookOption,
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

type TMaterialForm = { price: string; owned: string; isValuedAtMarket: boolean };
type TMaterialForms = Partial<Record<TMarketMaterialId, TMaterialForm>>;
type TErrors = Partial<Record<string, string>>;

const MATERIAL_NAMES: Record<TMarketMaterialId, string> = {
  'aegir-destruction-stone': '운명의 파괴석',
  'aegir-guardian-stone': '운명의 수호석',
  'aegir-leapstone': '운명의 돌파석',
  'aegir-fusion': '아비도스 융화 재료',
  'serka-destruction-crystal': '운명의 파괴석 결정',
  'serka-guardian-crystal': '운명의 수호석 결정',
  'serka-great-leapstone': '위대한 운명의 돌파석',
  'serka-advanced-fusion': '상급 아비도스 융화 재료',
  'fate-shard': '운명의 파편',
  'weapon-lava-breath': '용암의 숨결',
  'armor-glacier-breath': '빙하의 숨결',
  'weapon-metallurgy-11-14': '야금술 업화 [11-14]',
  'armor-tailoring-11-14': '재봉술 업화 [11-14]',
  'weapon-metallurgy-15-18': '야금술 업화 [15-18]',
  'armor-tailoring-15-18': '재봉술 업화 [15-18]',
  'weapon-metallurgy-19-20': '야금술 업화 [19-20]',
  'armor-tailoring-19-20': '재봉술 업화 [19-20]',
  'weapon-metallurgy-enhanced-19-20': '강화 야금술 업화 [19-20]',
  'armor-tailoring-enhanced-19-20': '강화 재봉술 업화 [19-20]',
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

function formatGold(value: number) {
  return `${Math.round(value).toLocaleString('ko-KR')} G`;
}

function formatQuantity(value: number) {
  return value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
}

function actionText(action: { breathQuantity: number; book: TBookOption; successRate: number }) {
  const book = action.book.kind === 'none' ? '책 미사용' : MATERIAL_NAMES[action.book.materialId];
  return `숨결 ${action.breathQuantity}개 · ${book} · 성공률 ${(action.successRate / 100).toFixed(2)}%`;
}

function priceErrorKey(id: TMarketMaterialId) {
  return `price-${id}`;
}

function ownedErrorKey(id: TMarketMaterialId) {
  return `owned-${id}`;
}

export default function RefiningClient() {
  const [activeTab, setActiveTab] = useState<string>(REFINING_TABS[0].value);

  const [condition, setCondition] = useState<TRefiningCondition>({
    equipmentGrade: 'aegir',
    equipmentType: 'weapon',
    fromLevel: 10,
    failureCount: '0',
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
  const hasErrors = Object.values(errors).some(Boolean);

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
    setErrors((current) => ({ ...current, failureCount: undefined, artisanEnergy: undefined }));
    invalidateResult();
  }

  function updateMaterial(id: TMarketMaterialId, next: Partial<TMaterialForm>, errorKey?: string) {
    setMaterials((current) => ({
      ...current,
      [id]: { ...(current[id] ?? defaultMaterialForm()), ...next },
    }));
    if (errorKey) setErrors((current) => ({ ...current, [errorKey]: undefined }));
    invalidateResult();
  }

  function handleCalculate() {
    const nextErrors: TErrors = {};
    const parsedFailureCount = Number(condition.failureCount);
    if (!Number.isInteger(parsedFailureCount) || parsedFailureCount < 0)
      nextErrors.failureCount = '실패 횟수는 0 이상의 정수로 입력해 주세요.';
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
        nextErrors[priceErrorKey(id)] = '개당 단가는 0 이상의 숫자로 입력해 주세요.';
      else prices[id] = price;
      if (!Number.isInteger(owned) || owned < 0)
        nextErrors[ownedErrorKey(id)] = '보유 수량은 0 이상의 정수로 입력해 주세요.';
      else ownedMaterials[id] = { quantity: owned, isValuedAtMarket: form.isValuedAtMarket };
    }
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
          failureCount: parsedFailureCount,
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
        <Tabs options={REFINING_TABS} value={activeTab} onChange={(next) => setActiveTab(next)} />
      </div>

      <RefiningConditionPanel condition={condition} onChange={handleConditionChange} />

      <div className={styles['content-grid']}>
        <section className={styles['input-panel']} aria-labelledby="refining-input-heading">
          <h2 id="refining-input-heading">조건과 재료 단가</h2>
          {hasErrors && (
            <p className={styles['input-error-summary']} role="alert">
              필수 입력값을 확인해 주세요.
            </p>
          )}

          <fieldset className={styles['field-group']}>
            <legend>재료별 입력</legend>
            <p className={styles['field-description']}>
              보유분은 기본 0G이며, ‘시장가 반영’을 선택하면 입력 단가로 계산합니다.
            </p>
            <div className={styles['table-scroll']}>
              <table>
                <caption>재련 재료 단가와 보유 수량</caption>
                <thead>
                  <tr>
                    <th scope="col">재료</th>
                    <th scope="col">개당 G</th>
                    <th scope="col">보유 수량</th>
                    <th scope="col">시장가 반영</th>
                  </tr>
                </thead>
                <tbody>
                  {materialIds.map((id) => {
                    const form = materials[id] ?? defaultMaterialForm();
                    const priceError = errors[priceErrorKey(id)];
                    const ownedError = errors[ownedErrorKey(id)];
                    const priceErrorId = `price-${id}-error`;
                    const ownedErrorId = `owned-${id}-error`;
                    return (
                      <tr key={id}>
                        <th scope="row">{MATERIAL_NAMES[id]}</th>
                        <td>
                          <input
                            aria-label={`${MATERIAL_NAMES[id]} 개당 단가`}
                            aria-describedby={priceError ? priceErrorId : undefined}
                            aria-invalid={Boolean(priceError)}
                            inputMode="decimal"
                            value={form.price}
                            onChange={(event) =>
                              updateMaterial(id, { price: event.target.value }, priceErrorKey(id))
                            }
                          />
                          {priceError && (
                            <span id={priceErrorId} className={styles['field-error']}>
                              {priceError}
                            </span>
                          )}
                        </td>
                        <td>
                          <input
                            aria-label={`${MATERIAL_NAMES[id]} 보유 수량`}
                            aria-describedby={ownedError ? ownedErrorId : undefined}
                            aria-invalid={Boolean(ownedError)}
                            inputMode="numeric"
                            min="0"
                            value={form.owned}
                            onChange={(event) =>
                              updateMaterial(id, { owned: event.target.value }, ownedErrorKey(id))
                            }
                          />
                          {ownedError && (
                            <span id={ownedErrorId} className={styles['field-error']}>
                              {ownedError}
                            </span>
                          )}
                        </td>
                        <td>
                          <label className={styles['check-label']}>
                            <input
                              type="checkbox"
                              aria-label={`${MATERIAL_NAMES[id]} 보유분 시장가 반영`}
                              checked={form.isValuedAtMarket}
                              onChange={(event) =>
                                updateMaterial(id, { isValuedAtMarket: event.target.checked })
                              }
                            />
                            <span>시장가 반영</span>
                          </label>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </fieldset>
          <Button theme="bg-pri" size="large" isLoading={isCalculating} onClick={handleCalculate}>
            {isCalculating ? '계산 중' : '계산하기'}
          </Button>
        </section>

        <section
          className={styles['result-panel']}
          aria-labelledby="refining-result-heading"
          aria-live="polite"
        >
          <h2 id="refining-result-heading">계산 결과</h2>
          {calculationError && (
            <p className={styles['calculation-error']} role="alert">
              {calculationError}
            </p>
          )}
          {!plan && isCalculating ? (
            <div className={styles['loading-result']}>
              <BoxLoading height={120} />
              <p>최적 전략을 계산하고 있습니다.</p>
            </div>
          ) : !plan ? (
            <p className={styles['empty-result']}>
              단가와 보유 수량을 입력한 뒤 계산하기를 눌러 주세요.
            </p>
          ) : (
            <RefiningResult plan={plan} materialIds={materialIds} step={step} />
          )}
        </section>
      </div>
    </main>
  );
}

function RefiningResult(props: {
  plan: TRefiningPlan;
  materialIds: readonly TMarketMaterialId[];
  step: ReturnType<typeof getRefiningStep>;
}) {
  const { plan, materialIds, step } = props;
  const current = plan.conditionalActions[0];
  const currentMaterials = new Map<TMarketMaterialId, number>();
  for (const material of step.requiredMaterials)
    currentMaterials.set(material.id, (currentMaterials.get(material.id) ?? 0) + material.quantity);
  if (current.action.breathQuantity > 0)
    currentMaterials.set(
      step.breathMaterialId,
      (currentMaterials.get(step.breathMaterialId) ?? 0) + current.action.breathQuantity,
    );
  if (current.action.book.kind !== 'none')
    currentMaterials.set(
      current.action.book.materialId,
      (currentMaterials.get(current.action.book.materialId) ?? 0) + 1,
    );

  return (
    <div className={styles['result-content']}>
      <section className={styles['current-action']} aria-labelledby="current-action-heading">
        <h3 id="current-action-heading">이번 시도 권장</h3>
        <p className={styles['action-text']}>{actionText(current.action)}</p>
        <dl>
          <div>
            <dt>숨결</dt>
            <dd>{current.action.breathQuantity}개</dd>
          </div>
          <div>
            <dt>책</dt>
            <dd>
              {current.action.book.kind === 'none'
                ? '미사용'
                : MATERIAL_NAMES[current.action.book.materialId]}
            </dd>
          </div>
          <div>
            <dt>성공률</dt>
            <dd>{(current.action.successRate / 100).toFixed(2)}%</dd>
          </div>
          <div>
            <dt>즉시 골드</dt>
            <dd>{formatGold(current.immediateGold)}</dd>
          </div>
          <div>
            <dt>즉시 실링</dt>
            <dd>{formatQuantity(step.silver)} 실링</dd>
          </div>
        </dl>
        <div className={styles['immediate-materials']}>
          <strong>이번 시도 투입 재료</strong>
          <ul>
            {[...currentMaterials.entries()].map(([id, quantity]) => (
              <li key={id}>
                {MATERIAL_NAMES[id]} {formatQuantity(quantity)}개
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className={styles['outcome-grid']}>
        <section aria-labelledby="expected-heading">
          <h3 id="expected-heading">기대값</h3>
          <dl className={styles['metric-grid']}>
            <div>
              <dt>기대 시도</dt>
              <dd>{formatQuantity(plan.expectedAttempts)}회</dd>
            </div>
            <div>
              <dt>기대 비용</dt>
              <dd>{formatGold(plan.expectedGold)}</dd>
            </div>
            <div>
              <dt>기대 실링</dt>
              <dd>{formatQuantity(plan.expectedSilver)} 실링</dd>
            </div>
          </dl>
        </section>
        <section aria-labelledby="worst-heading">
          <h3 id="worst-heading">최악 경로</h3>
          <dl className={styles['metric-grid']}>
            <div>
              <dt>최대 시도</dt>
              <dd>{plan.recommendedWorstCase.attempts}회</dd>
            </div>
            <div>
              <dt>누적 비용</dt>
              <dd>{formatGold(plan.recommendedWorstCase.gold)}</dd>
            </div>
            <div>
              <dt>누적 실링</dt>
              <dd>{formatQuantity(plan.recommendedWorstCase.silver)} 실링</dd>
            </div>
          </dl>
        </section>
      </div>
      <div className={styles['notice']}>
        <p>사용자 입력 단가 기준 · 보유분 기본 0G · 실링은 골드 최적화에서 제외</p>
        <p>이벤트 미반영</p>
        <p>장인 100% 확정 성공 행은 보조재를 사용하지 않습니다.</p>
      </div>
      <h3>재료별 기대 사용 및 비용</h3>
      <div className={styles['table-scroll']}>
        <table>
          <caption>재료별 기대 사용량과 구매 비용</caption>
          <thead>
            <tr>
              <th scope="col">재료</th>
              <th scope="col">기대 사용</th>
              <th scope="col">기대 구매량</th>
              <th scope="col">기대 비용</th>
            </tr>
          </thead>
          <tbody>
            {materialIds.map((id) => {
              const material = plan.materialExpectations[id];
              return (
                <tr key={id}>
                  <th scope="row">{MATERIAL_NAMES[id]}</th>
                  <td>{formatQuantity(material?.expectedTotalUsed ?? 0)}</td>
                  <td>{formatQuantity(material?.expectedPurchased ?? 0)}</td>
                  <td>{formatGold(material?.expectedGold ?? 0)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <h3>실패 상태별 조건부 권장</h3>
      <div className={styles['table-scroll']}>
        <table>
          <caption>실패 횟수와 장인의 기운에 따른 권장 행동</caption>
          <thead>
            <tr>
              <th scope="col">실패</th>
              <th scope="col">장인의 기운</th>
              <th scope="col">권장 행동</th>
            </tr>
          </thead>
          <tbody>
            {plan.conditionalActions.map((item) => (
              <tr key={`${item.failureCount}-${item.artisanEnergy}`}>
                <td>{item.failureCount}회</td>
                <td>{item.artisanEnergy.toFixed(2)}%</td>
                <td>{actionText(item.action)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
