import type { TClearGoldGate, TClearGoldSummary } from '../_type/clearGold';

const GOLD_NUMBER_FORMATTER = new Intl.NumberFormat('ko-KR');

export function calculateClearGoldSummary(gates: readonly TClearGoldGate[]): TClearGoldSummary {
  const summary = gates.reduce(
    (accumulator, gate) => ({
      tradableGold: accumulator.tradableGold + gate.tradableGold,
      boundGold: accumulator.boundGold + gate.boundGold,
    }),
    { tradableGold: 0, boundGold: 0 },
  );

  return {
    ...summary,
    totalGold: summary.tradableGold + summary.boundGold,
  };
}

export function formatGold(value: number) {
  return GOLD_NUMBER_FORMATTER.format(value);
}
