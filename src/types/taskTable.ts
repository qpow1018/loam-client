export type TTaskTableResetPeriod = 'permanent' | 'daily' | 'weekly' | 'monthly';

export type TTaskTableCyclePolicy = {
  utcOffsetMinutes: number;
  dailyResetHour: number;
  weeklyResetDay: number;
};

export type TTaskTableCellRole = 'checkbox' | 'text' | 'restGauge' | 'weekdayContent';

export type TTaskTableCheckboxState = 'checked' | 'unchecked';

export type TTaskTableData = {
  columns: TTaskTableColumn[];
  rows: TTaskTableRow[];
  cells: Record<string, Record<string, TTaskTableCellValue>>;
};

export type TTaskTableColumn = {
  id: string;
  name: string;
  className?: string;
  imageUrl?: string;
};

export type TTaskTableRow = TTaskTableDataRow | { kind: 'divider'; id: string };

export type TTaskTableDataRow = {
  kind: 'data';
  id: string;
  name: string;
  iconUrl?: string;
  // 신규 셀의 기본값. 셀 단위로 CellSettingsModal에서 따로 변경 가능 — cell이 source of truth.
  resetPeriod: TTaskTableResetPeriod;
  role: TTaskTableCellRole;
};

export type TTaskTableCellValue =
  | TTaskTableCellValueCheckbox
  | TTaskTableCellValueText
  | TTaskTableCellValueRestGauge
  | TTaskTableCellValueWeekdayContent;

export type TTaskTableCellValueCheckbox = {
  role: 'checkbox';
  cycleKey: string;
  lastAccumulatedCycleKey: string;
  resetPeriod: TTaskTableResetPeriod;
  checkboxState: TTaskTableCheckboxState;
  checkboxLabel: string;
};

export type TTaskTableCellValueText = {
  role: 'text';
  cycleKey: string;
  lastAccumulatedCycleKey: string;
  resetPeriod: TTaskTableResetPeriod;
  text: string;
};

export type TTaskTableCellValueRestGauge = {
  role: 'restGauge';
  cycleKey: string;
  lastAccumulatedCycleKey: string;
  resetPeriod: TTaskTableResetPeriod;
  checkboxState: TTaskTableCheckboxState;
  checkboxLabel: string;
  restGauge: number;
  restGaugeSkipThreshold: number;
};

export type TTaskTableCellValueWeekdayContent = {
  role: 'weekdayContent';
  cycleKey: string;
  lastAccumulatedCycleKey: string;
  resetPeriod: TTaskTableResetPeriod;
  checkboxState: TTaskTableCheckboxState;
  checkboxLabel: string;
  weekdays: number[];
};
