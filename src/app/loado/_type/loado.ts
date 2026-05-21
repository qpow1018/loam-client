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

export type TLoadoResetPeriod =
  | { kind: 'permanent' }
  | { kind: 'daily' }
  | { kind: 'weekly' }
  | { kind: 'special'; weekdays: number[] }; // 0=월 ~ 6=일

export type TLoadoCellRole = 'checkbox' | 'text' | 'restGauge';

export type TLoadoCellValue = {
  kind: TLoadoCellRole;
  checkboxState: 'checked' | 'unchecked' | 'skip' | 'none';
  text: string;
  restGauge?: number;
  cycleKey: string;
  lastAccumulatedCycleKey: string;
};
