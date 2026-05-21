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

export type TLoadoCellValue =
  | { kind: 'checkbox'; checked: boolean; cycleKey: string }
  | { kind: 'text'; text: string; cycleKey: string }
  | {
      kind: 'restGauge';
      value: number;
      lastAccumulatedCycleKey: string;
      doneCycleKey?: string | null; // 사용자가 "오늘 수행함"으로 표시한 사이클 키. 없으면 미수행.
    };

export type TLoadoCellValueTest = {
  kind: TLoadoCellRole;
  checkboxState: 'checked' | 'unchecked' | 'pause' | 'empty';
  text: string;
  restGauge?: number;
  cycleKey: string;
  lastAccumulatedCycleKey: string;
};
