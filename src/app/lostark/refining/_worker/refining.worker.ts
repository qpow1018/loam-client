/// <reference lib="webworker" />

import type {
  TRefiningWorkerRequest,
  TRefiningWorkerResponse,
} from '@/app/lostark/refining/_type/refiningWorker';
import { calculateRefiningPlan } from '@/app/lostark/refining/_util/calculateRefiningPlan';

const workerScope = self as unknown as DedicatedWorkerGlobalScope;

workerScope.addEventListener('message', (event: MessageEvent<TRefiningWorkerRequest>) => {
  const { requestId, input } = event.data;

  try {
    const response: TRefiningWorkerResponse = {
      requestId,
      plan: calculateRefiningPlan(input),
    };
    workerScope.postMessage(response);
  } catch {
    const response: TRefiningWorkerResponse = { requestId, error: true };
    workerScope.postMessage(response);
  }
});
