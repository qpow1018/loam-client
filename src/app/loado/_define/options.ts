import type { TLoadoResetPeriod, TLoadoCellRole } from '@/app/loado/_type/loado';

export const PERIOD_OPTIONS: { value: TLoadoResetPeriod; label: string }[] = [
  { value: 'permanent', label: '무기한' },
  { value: 'daily', label: '일일' },
  { value: 'weekly', label: '주간' },
];

export const TYPE_OPTIONS: { value: TLoadoCellRole; label: string }[] = [
  { value: 'checkbox', label: '체크박스' },
  { value: 'text', label: '텍스트' },
  { value: 'restGauge', label: '휴식게이지' },
  { value: 'weekdayContent', label: '요일 컨텐츠' },
];
