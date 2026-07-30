import { useEffect, useRef, useState } from 'react';

import Button from '@/components/common/button/Button';
import BoxLoading from '@/components/common/loading/BoxLoading';
import Confirm from '@/components/common/modal/Confirm';

import RefiningResult from '@/app/lostark/refining/_component/RefiningResult';
import type {
  TRefiningMaterialId,
  TRefiningMaterialInputs,
  TRefiningPlan,
  TRefiningCondition,
  TRefiningRule,
} from '@/app/lostark/refining/_type/refining';
import type {
  TRefiningWorkerRequest,
  TRefiningWorkerResponse,
} from '@/app/lostark/refining/_type/refiningWorker';
import { validateRefiningInput } from '@/app/lostark/refining/_util/refiningInput';
import styles from '@/app/lostark/refining/_component/refiningResultPanel.module.scss';

export default function RefiningResultPanel(props: {
  condition: TRefiningCondition;
  marketPrices: Readonly<Record<TRefiningMaterialId, number>>;
  materials: TRefiningMaterialInputs;
  refiningRule: TRefiningRule;
}) {
  const { condition, marketPrices, materials, refiningRule } = props;
  const [plan, setPlan] = useState<TRefiningPlan>();
  const [calculationError, setCalculationError] = useState<string>();
  const [isInputErrorOpen, setIsInputErrorOpen] = useState(false);
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
    const input = validateRefiningInput({ condition, marketPrices, materials, step: refiningRule });
    if (!input) {
      requestIdRef.current += 1;
      workerRef.current?.terminate();
      workerRef.current = undefined;
      setPlan(undefined);
      setCalculationError(undefined);
      setIsCalculating(false);
      setIsInputErrorOpen(true);
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
        input: { step: refiningRule, ...input },
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
    <>
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
          <p className={styles['empty-result']}>보유 수량을 입력한 뒤 계산하기를 눌러 주세요.</p>
        ) : (
          <RefiningResult plan={plan} refiningRule={refiningRule} />
        )}
      </section>
      <Confirm
        isOpen={isInputErrorOpen}
        onClose={() => setIsInputErrorOpen(false)}
        title="입력값을 확인해 주세요"
        message="재련 조건과 보유 수량을 확인한 뒤 다시 계산해 주세요."
        buttons={[
          {
            label: '확인',
            theme: 'bg-pri',
            onClick: () => setIsInputErrorOpen(false),
          },
        ]}
      />
    </>
  );
}
