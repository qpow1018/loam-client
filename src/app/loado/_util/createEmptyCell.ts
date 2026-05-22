import type { TLoadoCellValue, TLoadoDataRow } from '../_type/loado';
import { getCurrentCycleKey } from './cycleKey';

export function createEmptyCell(row: TLoadoDataRow): TLoadoCellValue {
  const cycleKey = getCurrentCycleKey(row.resetPeriod);
  return {
    kind: row.cellRole,
    resetPeriod: row.resetPeriod,
    checkboxState: 'none',
    text: '',
    cycleKey,
    lastAccumulatedCycleKey: cycleKey,
  };
}
