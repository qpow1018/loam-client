import type { TTaskTableCyclePolicy } from '@/types/taskTable';

export const TASK_TABLE_CYCLE_POLICIES = {
  lostark: {
    utcOffsetMinutes: 9 * 60,
    dailyResetHour: 6,
    weeklyResetDay: 3,
  },
  maplestory: {
    utcOffsetMinutes: 9 * 60,
    dailyResetHour: 0,
    weeklyResetDay: 4,
  },
} as const satisfies Record<string, TTaskTableCyclePolicy>;
