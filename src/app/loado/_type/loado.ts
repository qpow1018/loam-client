export type TLoadoResetPeriod = 'permanent' | 'daily' | 'weekly';

export type TLoadoCellRole = 'checkbox' | 'text' | 'restGauge' | 'weekdayContent';

export type TLoadoCheckboxState = 'checked' | 'unchecked' | 'skip' | 'none';

export type TLoadoTableData = {
  columns: TLoadoColumn[];
  rows: TLoadoRow[];
  cells: Record<string, Record<string, TLoadoCellValue>>;
};

export type TLoadoColumn = {
  id: string;
  name: string;
  width?: number;
};

export type TLoadoRow = TLoadoDataRow | { kind: 'divider'; id: string };

export type TLoadoDataRow = {
  kind: 'data';
  id: string;
  name: string;
  iconUrl?: string;
  height?: number;
  resetPeriod: TLoadoResetPeriod;
  cellRole: TLoadoCellRole;
};

export type TLoadoCellValue = {
  cycleKey: string;
  lastAccumulatedCycleKey: string;
  resetPeriod: TLoadoResetPeriod;
  role: TLoadoCellRole;
  checkboxState: TLoadoCheckboxState;
  checkboxLabel: string; // checkbox / restGauge / weekdayContent kind에서 사용
  text: string; // text kind에서 사용
  restGauge: number | null;
  restGaugeSkipThreshold: number | null;
  weekdays: number[]; // weekdayContent kind일 때만 사용. 0=월 ~ 6=일
};
