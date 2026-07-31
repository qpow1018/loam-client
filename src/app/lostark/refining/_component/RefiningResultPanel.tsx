import { useEffect, useRef, useState } from 'react';

import type {
  TRefiningMaterialId,
  TRefiningMaterialInputs,
  TRefiningPlan,
  TRefiningPlanInput,
  TRefiningCondition,
  TRefiningRule,
} from '@/app/lostark/refining/_type/refining';
import type {
  TRefiningWorkerRequest,
  TRefiningWorkerResponse,
} from '@/app/lostark/refining/_type/refiningWorker';
import { validateRefiningInput } from '@/app/lostark/refining/_util/validateRefiningInput';

import Button from '@/components/common/button/Button';
import BoxLoading from '@/components/common/loading/BoxLoading';
import Confirm from '@/components/common/modal/Confirm';
import RefiningResult from '@/app/lostark/refining/_component/RefiningResult';

import styles from '@/app/lostark/refining/_component/refiningResultPanel.module.scss';

export default function RefiningResultPanel(props: {
  condition: TRefiningCondition;
  marketPrices: Readonly<Record<TRefiningMaterialId, number>>;
  materials: TRefiningMaterialInputs;
  refiningRule: TRefiningRule;
}) {
  const { condition, marketPrices, materials, refiningRule } = props;

  const [plan, setPlan] = useState<TRefiningPlan>();
  const [isCalculating, setIsCalculating] = useState(false);
  const [isCalculationErrorOpen, setIsCalculationErrorOpen] = useState(false);
  const [isInputErrorOpen, setIsInputErrorOpen] = useState(false);

  const workerRef = useRef<Worker | undefined>(undefined);
  const requestIdRef = useRef(0);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  function handleCalculate() {
    const input = validateRefiningInput({ condition, marketPrices, materials, refiningRule });
    if (!input) {
      setIsInputErrorOpen(true);
      return;
    }

    startCalculation({ step: refiningRule, ...input });
  }

  function startCalculation(input: TRefiningPlanInput) {
    workerRef.current?.terminate();
    workerRef.current = undefined;
    setPlan(undefined);
    setIsCalculationErrorOpen(false);
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

        if ('error' in event.data) {
          handleCalculationError();
          return;
        }
        setIsCalculating(false);
        setPlan(event.data.plan);
      });
      worker.addEventListener('error', () => {
        if (requestId !== requestIdRef.current) return;
        worker.terminate();
        workerRef.current = undefined;
        handleCalculationError();
      });

      const request: TRefiningWorkerRequest = {
        requestId,
        input,
      };
      worker.postMessage(request);
    } catch {
      workerRef.current = undefined;
      handleCalculationError();
    }
  }

  function handleCalculationError() {
    setIsCalculating(false);
    setIsCalculationErrorOpen(true);
  }

  return (
    <section className={styles['result-panel']} aria-live="polite">
      <div className={styles['result-panel-top']}>
        <Button
          color="mint"
          fill="solid"
          size="large"
          isLoading={isCalculating}
          className={styles['calculate-button']}
          onClick={handleCalculate}
        >
          {isCalculating ? '계산 중' : '최적화 계산하기'}
        </Button>
      </div>

      <div className={styles['result-panel-content']}>
        {isCalculating && (
          <div className={styles['loading-result']}>
            <BoxLoading height={120} />
            <p>최적 전략을 계산하고 있습니다.</p>
          </div>
        )}
        {!isCalculating && !plan && (
          <p className={styles['empty-result']}>보유 수량을 입력한 뒤 계산하기를 눌러 주세요.</p>
        )}
        {!isCalculating && plan && <RefiningResult plan={plan} refiningRule={refiningRule} />}
      </div>

      <FormValidationErrorAlert
        isOpen={isInputErrorOpen}
        onClose={() => setIsInputErrorOpen(false)}
      />
      <CalculationErrorAlert
        isOpen={isCalculationErrorOpen}
        onClose={() => setIsCalculationErrorOpen(false)}
      />
    </section>
  );
}

function FormValidationErrorAlert(props: { isOpen: boolean; onClose: () => void }) {
  const { isOpen, onClose } = props;

  return (
    <Confirm
      isOpen={isOpen}
      onClose={onClose}
      title="입력값을 확인해 주세요"
      message="재련 조건과 보유 수량을 확인한 뒤 다시 계산해 주세요."
      buttons={[
        {
          label: '확인',
          color: 'mint',
          fill: 'solid',
          onClick: onClose,
        },
      ]}
    />
  );
}

function CalculationErrorAlert(props: { isOpen: boolean; onClose: () => void }) {
  const { isOpen, onClose } = props;

  return (
    <Confirm
      isOpen={isOpen}
      onClose={onClose}
      title="계산 중 오류가 발생했습니다"
      message="계산 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요."
      buttons={[
        {
          label: '확인',
          color: 'mint',
          fill: 'solid',
          onClick: onClose,
        },
      ]}
    />
  );
}
