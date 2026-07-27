import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

import Button from '@/components/common/button/Button';
import BoxLoading from '@/components/common/loading/BoxLoading';

import { MATERIAL_NAMES } from '@/app/lostark/refining/_define/refiningMaterials';
import type {
  TBookOption,
  TMarketMaterialId,
  TMaterialForms,
  TRefiningPlan,
  TRefiningCondition,
  TRefiningStep,
} from '@/app/lostark/refining/_type/refining';
import type {
  TRefiningWorkerRequest,
  TRefiningWorkerResponse,
} from '@/app/lostark/refining/_type/refiningWorker';
import {
  getRelevantMaterialIds,
  validateRefiningInput,
  type TRefiningInputErrors,
} from '@/app/lostark/refining/_util/refiningInput';
import styles from '@/app/lostark/refining/_component/refiningResultPanel.module.scss';

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

export default function RefiningResultPanel(props: {
  condition: TRefiningCondition;
  materials: TMaterialForms;
  step: TRefiningStep;
  onErrorsChange: (errors: TRefiningInputErrors) => void;
}) {
  const { condition, materials, step, onErrorsChange } = props;
  const materialIds = getRelevantMaterialIds(step);
  const [plan, setPlan] = useState<TRefiningPlan>();
  const [calculationError, setCalculationError] = useState<string>();
  const [isCalculating, setIsCalculating] = useState(false);
  const workerRef = useRef<Worker | undefined>(undefined);
  const requestIdRef = useRef(0);

  useEffect(
    () => () => {
      workerRef.current?.terminate();
    },
    [],
  );

  function handleCalculate() {
    const validation = validateRefiningInput({ condition, materials, step });
    onErrorsChange(validation.errors);
    if (!validation.input) {
      requestIdRef.current += 1;
      workerRef.current?.terminate();
      workerRef.current = undefined;
      setPlan(undefined);
      setCalculationError(undefined);
      setIsCalculating(false);
      return;
    }

    workerRef.current?.terminate();
    setPlan(undefined);
    setCalculationError(undefined);
    setIsCalculating(true);
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      const worker = new Worker(new URL('../_worker/refining.worker.ts', import.meta.url), {
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
        input: { step, ...validation.input },
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
    <section
      className={styles['result-panel']}
      aria-labelledby="refining-result-heading"
      aria-live="polite"
    >
      <h2 id="refining-result-heading">계산 결과</h2>
      <Button
        theme="bg-pri"
        size="large"
        isFullWidth
        isLoading={isCalculating}
        className={styles['calculate-button']}
        onClick={handleCalculate}
      >
        {isCalculating ? '계산 중' : '계산하기'}
      </Button>
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
  );
}

function RefiningResult(props: {
  plan: TRefiningPlan;
  materialIds: readonly TMarketMaterialId[];
  step: TRefiningStep;
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
      <ResultTable
        caption="재료별 기대 사용량과 구매 비용"
        headings={['재료', '기대 사용', '기대 구매량', '기대 비용']}
      >
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
      </ResultTable>
      <h3>실패 상태별 조건부 권장</h3>
      <ResultTable
        caption="실패로 추가된 확률과 장인의 기운에 따른 권장 행동"
        headings={['실패 추가 확률', '장인의 기운', '권장 행동']}
      >
        {plan.conditionalActions.map((item) => (
          <tr key={`${item.failureBonusRate}-${item.artisanEnergy}`}>
            <td>{(item.failureBonusRate / 100).toFixed(2)}%</td>
            <td>{item.artisanEnergy.toFixed(2)}%</td>
            <td>{actionText(item.action)}</td>
          </tr>
        ))}
      </ResultTable>
    </div>
  );
}

function ResultTable(props: { caption: string; headings: readonly string[]; children: ReactNode }) {
  const { caption, headings, children } = props;
  return (
    <div className={styles['table-scroll']}>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {headings.map((heading) => (
              <th key={heading} scope="col">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
