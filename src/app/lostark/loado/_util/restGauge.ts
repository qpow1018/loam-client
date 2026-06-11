import type { TTaskTableCellValueRestGauge } from '@/types/taskTable';

// 로스트아크 휴식게이지 수치 (카오스 던전, 가디언 토벌 통일).
export const REST_GAUGE = {
  max: 200,
  accumPerDay: 20,
  consumeThreshold: 40,
  consumeAmount: 40,
} as const;

// 한 사이클이 지난 시점의 게이지 값.
// 직전 사이클에 수행했다면 임계값 이상에서만 소모, 미수행이면 누적(max로 캡).
export function getNextRestGauge(args: { current: number; didPerform: boolean }): number {
  const { current, didPerform } = args;
  if (didPerform) {
    return current >= REST_GAUGE.consumeThreshold ? current - REST_GAUGE.consumeAmount : current;
  }
  return Math.min(REST_GAUGE.max, current + REST_GAUGE.accumPerDay);
}

export function syncRestGauge(cell: TTaskTableCellValueRestGauge, cycles: number): number {
  let value = cell.restGauge;

  for (let index = 0; index < cycles; index++) {
    const didPerform = index === 0 && cell.checkboxState === 'checked';
    value = getNextRestGauge({ current: value, didPerform });
  }

  return value;
}
