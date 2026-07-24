import type { TRefiningPlan, TRefiningPlanInput } from './refining';

export type TRefiningWorkerRequest = {
  requestId: number;
  input: TRefiningPlanInput;
};

export type TRefiningWorkerResponse =
  | { requestId: number; plan: TRefiningPlan }
  | { requestId: number; error: true };
