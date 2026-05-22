import type { TLoadoCellValue, TLoadoDataRow } from '../_type/loado';
import { getCurrentCycleKey } from './cycleKey';

export function createEmptyCell(row: TLoadoDataRow): TLoadoCellValue {
  const cycleKey = getCurrentCycleKey(row.resetPeriod);
  return {
    role: row.cellRole,
    resetPeriod: row.resetPeriod,
    checkboxState: 'none',
    checkboxLabel: '',
    text: '',
    restGauge: null,
    restGaugeSkipThreshold: null,
    weekdays: [],
    cycleKey,
    lastAccumulatedCycleKey: cycleKey,
  };
}
