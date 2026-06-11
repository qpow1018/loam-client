import type { TTaskTableCyclePolicy, TTaskTableResetPeriod } from '@/types/taskTable';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function shiftToCycleDate(now: Date, policy: TTaskTableCyclePolicy): Date {
  const localTime = now.getTime() + policy.utcOffsetMinutes * 60 * 1000;
  const cycleTime = localTime - policy.dailyResetHour * 60 * 60 * 1000;
  return new Date(cycleTime);
}

function formatYmd(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function alignToWeeklyReset(date: Date, weeklyResetDay: number): Date {
  const offset = (date.getUTCDay() - weeklyResetDay + 7) % 7;
  const result = new Date(date.getTime());
  result.setUTCDate(date.getUTCDate() - offset);
  return result;
}

function alignToMonthlyReset(date: Date): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(1);
  return result;
}

export function getCurrentCycleKey(
  resetPeriod: TTaskTableResetPeriod,
  policy: TTaskTableCyclePolicy,
  now: Date = new Date(),
): string {
  if (resetPeriod === 'permanent') return 'permanent';

  const cycleDate = shiftToCycleDate(now, policy);

  switch (resetPeriod) {
    case 'daily':
      return formatYmd(cycleDate);
    case 'weekly':
      return formatYmd(alignToWeeklyReset(cycleDate, policy.weeklyResetDay));
    case 'monthly':
      return formatYmd(alignToMonthlyReset(cycleDate));
  }
}

function parseCycleKeyToUtcDate(key: string): Date | null {
  if (key === 'permanent') return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!match) return null;
  return new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
}

function daysBetweenCycleKeys(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / MS_PER_DAY);
}

function monthsBetweenCycleKeys(from: Date, to: Date): number {
  return (to.getUTCFullYear() - from.getUTCFullYear()) * 12 + to.getUTCMonth() - from.getUTCMonth();
}

export function cyclesBetween(from: string, to: string, period: TTaskTableResetPeriod): number {
  if (period === 'permanent') return 0;

  const fromDate = parseCycleKeyToUtcDate(from);
  const toDate = parseCycleKeyToUtcDate(to);
  if (!fromDate || !toDate) return 0;

  if (period === 'monthly') {
    return Math.max(0, monthsBetweenCycleKeys(fromDate, toDate));
  }

  const days = daysBetweenCycleKeys(fromDate, toDate);
  if (days <= 0) return 0;
  return period === 'weekly' ? Math.floor(days / 7) : days;
}

export function isWeekdayActive(
  weekdays: number[],
  policy: TTaskTableCyclePolicy,
  now: Date = new Date(),
): boolean {
  if (weekdays.length === 0) return true;

  const cycleDate = shiftToCycleDate(now, policy);
  const mondayBasedDay = (cycleDate.getUTCDay() + 6) % 7;
  return weekdays.includes(mondayBasedDay);
}
