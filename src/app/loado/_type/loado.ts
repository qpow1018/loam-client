export type TLoadoResetPeriod = 'permanent' | 'daily' | 'weekly';

export type TLoadoCellRole = 'checkbox' | 'text' | 'restGauge' | 'weekdayContent';

export type TLoadoCheckboxState = 'checked' | 'unchecked';

export type TLoadoTableData = {
  columns: TLoadoColumn[];
  rows: TLoadoRow[];
  cells: Record<string, Record<string, TLoadoCellValue>>;
};

export type TLoadoColumn = {
  id: string;
  name: string;
  imageUrl?: string;
};

export type TLoadoRow = TLoadoDataRow | { kind: 'divider'; id: string };

export type TLoadoDataRow = {
  kind: 'data';
  id: string;
  name: string;
  iconUrl?: string;
  // 신규 셀의 기본값. 셀 단위로 CellSettingsModal에서 따로 변경 가능 — cell이 source of truth.
  resetPeriod: TLoadoResetPeriod;
  role: TLoadoCellRole;
};

export type TLoadoCellValue =
  | TLoadoCellValueCheckbox
  | TLoadoCellValueText
  | TLoadoCellValueRestGauge
  | TLoadoCellValueWeekdayContent;

export type TLoadoCellValueCheckbox = {
  role: 'checkbox';
  cycleKey: string;
  lastAccumulatedCycleKey: string;
  resetPeriod: TLoadoResetPeriod;
  checkboxState: TLoadoCheckboxState;
  checkboxLabel: string;
};

export type TLoadoCellValueText = {
  role: 'text';
  cycleKey: string;
  lastAccumulatedCycleKey: string;
  resetPeriod: TLoadoResetPeriod;
  text: string;
};

export type TLoadoCellValueRestGauge = {
  role: 'restGauge';
  cycleKey: string;
  lastAccumulatedCycleKey: string;
  resetPeriod: TLoadoResetPeriod;
  checkboxState: TLoadoCheckboxState;
  checkboxLabel: string;
  restGauge: number;
  restGaugeSkipThreshold: number;
};

export type TLoadoCellValueWeekdayContent = {
  role: 'weekdayContent';
  cycleKey: string;
  lastAccumulatedCycleKey: string;
  resetPeriod: TLoadoResetPeriod;
  checkboxState: TLoadoCheckboxState;
  checkboxLabel: string;
  weekdays: number[];
};


