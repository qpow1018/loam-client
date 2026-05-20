export type TLoadoCellRole = 'checkbox' | 'text' | 'restGauge';

export type TLoadoResetPeriod =
  | { kind: 'permanent' }
  | { kind: 'daily' }
  | { kind: 'weekly' }
  | { kind: 'special'; weekdays: number[] }; // 0=월 ~ 6=일

export type TLoadoRestGaugeConfig = {
  max: number;
  accumPerDay: number;
  consumeThreshold: number;
  consumeAmount: number;
};

export type TLoadoDataRow = {
  kind: 'data';
  id: string;
  name: string;
  iconUrl?: string;
  height?: number;
  resetPeriod: TLoadoResetPeriod;
  cellRole: TLoadoCellRole;
  restGaugeConfig?: TLoadoRestGaugeConfig;
};

export type TLoadoDividerRow = {
  kind: 'divider';
  id: string;
};

export type TLoadoRow = TLoadoDataRow | TLoadoDividerRow;

export type TLoadoColumn = {
  id: string;
  name: string;
  width?: number;
};

export type TLoadoCheckboxCell = { kind: 'checkbox'; checked: boolean; cycleKey: string };
export type TLoadoTextCell = { kind: 'text'; text: string; cycleKey: string };
export type TLoadoRestGaugeCell = {
  kind: 'restGauge';
  value: number;
  lastAccumulatedCycleKey: string;
  doneCycleKey?: string | null; // 사용자가 "오늘 수행함"으로 표시한 사이클 키. 없으면 미수행.
};

export type TLoadoCellValue = TLoadoCheckboxCell | TLoadoTextCell | TLoadoRestGaugeCell;

export type TLoadoTableData = {
  rows: TLoadoRow[];
  columns: TLoadoColumn[];
  cells: Record<string, Record<string, TLoadoCellValue>>;
};
