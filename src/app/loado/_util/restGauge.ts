import type { TLoadoRestGaugeConfig } from '../_type/loado';

// 카오스 던전 기준 기본값. 다른 컨텐츠는 행마다 override.
export const DEFAULT_REST_GAUGE_CONFIG: TLoadoRestGaugeConfig = {
  max: 200,
  accumPerDay: 20,
  consumeThreshold: 40,
  consumeAmount: 40,
};

// 한 사이클이 지난 시점의 게이지 값.
// 직전 사이클에 수행했다면 임계값 이상에서만 소모, 아니면 누적(max로 캡).
export function transitionRestGauge(args: {
  current: number;
  didPerform: boolean;
  config: TLoadoRestGaugeConfig;
}): number {
  const { current, didPerform, config } = args;
  if (didPerform) {
    return current >= config.consumeThreshold
      ? current - config.consumeAmount
      : current;
  }
  return Math.min(config.max, current + config.accumPerDay);
}
