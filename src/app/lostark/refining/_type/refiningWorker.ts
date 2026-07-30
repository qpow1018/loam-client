import type { TRefiningPlan, TRefiningPlanInput } from '@/app/lostark/refining/_type/refining';

export type TRefiningWorkerRequest = {
  requestId: number;
  input: TRefiningPlanInput;
};

export type TRefiningWorkerResponse =
  | { requestId: number; plan: TRefiningPlan }
  | { requestId: number; error: true };
