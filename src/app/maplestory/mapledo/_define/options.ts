import type { TTaskTableCellRole, TTaskTableResetPeriod } from '@/types/taskTable';

export const PERIOD_OPTIONS: { value: TTaskTableResetPeriod; label: string }[] = [
  { value: 'permanent', label: '무기한' },
  { value: 'daily', label: '일일' },
  { value: 'weekly', label: '주간' },
  { value: 'monthly', label: '월간' },
];

export const TYPE_OPTIONS: { value: TTaskTableCellRole; label: string }[] = [
  { value: 'checkbox', label: '체크박스' },
  { value: 'text', label: '텍스트' },
];
