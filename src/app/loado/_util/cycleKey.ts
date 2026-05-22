import type { TLoadoResetPeriod } from '@/app/loado/_type/loado';

// 로스트아크 리셋 규칙
const KST_OFFSET_MIN = 9 * 60;
const DAILY_RESET_HOUR_KST = 6;
// 주간 리셋 요일 — JavaScript Date.getUTCDay() 기준 (0=일, 3=수, 6=토)
const WEEKLY_RESET_DOW = 3;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// 현재 시각을 "KST에서 06:00을 0시로 본 가상 날짜"로 옮긴 Date를 돌려준다.
// 반환된 Date의 UTC 필드(getUTCFullYear 등)를 읽으면 그 가상 날짜가 나온다.
//
// 트릭: now.getTime()은 UTC ms. 거기에 KST offset을 더한 ms를 다시 Date로 만들면
// 그 Date의 UTC 필드를 읽었을 때 KST 시각이 그대로 나온다 (가상 timezone 시프트).
// 거기서 다시 06:00을 빼면 "06:00을 0시로 보는" 가상 날짜가 된다.
function shiftToKstCycleDate(now: Date): Date {
  const kstMs = now.getTime() + KST_OFFSET_MIN * 60 * 1000;
  const cycleMs = kstMs - DAILY_RESET_HOUR_KST * 60 * 60 * 1000;
  return new Date(cycleMs);
}

function formatYmd(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// shifted Date 기준 직전 주간 리셋 요일(같은 날이면 그대로) 반환. UTC 필드로 계산.
function alignToWeeklyReset(shifted: Date): Date {
  const dow = shifted.getUTCDay();
  const offset = (dow - WEEKLY_RESET_DOW + 7) % 7;
  const result = new Date(shifted.getTime());
  result.setUTCDate(shifted.getUTCDate() - offset);
  return result;
}

export function getCurrentCycleKey(
  resetPeriod: TLoadoResetPeriod,
  now: Date = new Date(),
): string {
  switch (resetPeriod) {
    case 'permanent':
      return 'permanent';
    case 'daily': {
      return formatYmd(shiftToKstCycleDate(now));
    }
    case 'weekly': {
      const shifted = shiftToKstCycleDate(now);
      return formatYmd(alignToWeeklyReset(shifted));
    }
  }
}

function parseCycleKeyToUtcDate(key: string): Date | null {
  if (key === 'permanent') return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!m) return null;
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
}

function daysBetweenCycleKeys(from: string, to: string): number {
  const a = parseCycleKeyToUtcDate(from);
  const b = parseCycleKeyToUtcDate(to);
  if (!a || !b) return 0;
  return Math.floor((b.getTime() - a.getTime()) / MS_PER_DAY);
}

// 두 cycleKey 사이에 흐른 "사이클 수"를 계산.
// daily는 일 단위, weekly는 7일을 한 사이클로, permanent는 항상 0.
export function cyclesBetween(
  from: string,
  to: string,
  period: TLoadoResetPeriod,
): number {
  if (period === 'permanent') return 0;
  const days = daysBetweenCycleKeys(from, to);
  if (days <= 0) return 0;
  if (period === 'weekly') return Math.floor(days / 7);
  return days; // daily
}

// weekdayContent 행: 오늘이 활성 요일인지. weekdays: 0=월~6=일.
// 빈 배열은 "제약 없음" → 항상 활성으로 본다.
export function isWeekdayActive(weekdays: number[], now: Date = new Date()): boolean {
  if (weekdays.length === 0) return true;
  const shifted = shiftToKstCycleDate(now);
  const utcDow = shifted.getUTCDay(); // 0=Sun..6=Sat
  const mondayBased = (utcDow + 6) % 7; // 0=Mon..6=Sun
  return weekdays.includes(mondayBased);
}
