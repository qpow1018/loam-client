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
  weekdays?: number[]; // cellRole === 'weekdayContent'일 때만 사용. 0=월 ~ 6=일
};

export type TLoadoResetPeriod =
  | { kind: 'permanent' }
  | { kind: 'daily' }
  | { kind: 'weekly' };

export type TLoadoCellRole = 'checkbox' | 'text' | 'restGauge' | 'weekdayContent';

export type TLoadoCellValue = {
  kind: TLoadoCellRole;
  resetPeriod: TLoadoResetPeriod;
  checkboxState: 'checked' | 'unchecked' | 'skip' | 'none';
  text: string;
  restGauge?: number;
  cycleKey: string;
  lastAccumulatedCycleKey: string;
};
