import type { TLoadoResetPeriod } from '../_type/loado';

const KST_OFFSET_MIN = 9 * 60;
const RESET_HOUR = 6;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

// 현재 시각을 "KST에서 06:00을 0시로 본 가상 날짜"로 옮긴 Date를 돌려준다.
// 반환된 Date의 UTC 필드(getUTCFullYear 등)를 읽으면 그 가상 날짜가 나온다.
function shiftToKstCycleDate(now: Date): Date {
  const kstMs = now.getTime() + KST_OFFSET_MIN * 60 * 1000;
  const cycleMs = kstMs - RESET_HOUR * 60 * 60 * 1000;
  return new Date(cycleMs);
}

function formatYmd(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// shifted Date 기준 직전 수요일(같은 날이면 그대로) 반환. UTC 필드로 계산.
function alignToPreviousWednesday(shifted: Date): Date {
  const dow = shifted.getUTCDay(); // 0=Sun..6=Sat
  const offset = (dow - 3 + 7) % 7; // Wed=3
  const result = new Date(shifted.getTime());
  result.setUTCDate(shifted.getUTCDate() - offset);
  return result;
}

export function getCurrentCycleKey(
  resetPeriod: TLoadoResetPeriod,
  now: Date = new Date(),
): string {
  switch (resetPeriod.kind) {
    case 'permanent':
      return 'permanent';
    case 'daily': {
      return formatYmd(shiftToKstCycleDate(now));
    }
    case 'weekly': {
      const shifted = shiftToKstCycleDate(now);
      return formatYmd(alignToPreviousWednesday(shifted));
    }
  }
}

export function parseCycleKeyToUtcDate(key: string): Date | null {
  if (key === 'permanent') return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!m) return null;
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
}

export function daysBetweenCycleKeys(from: string, to: string): number {
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
  if (period.kind === 'permanent') return 0;
  const days = daysBetweenCycleKeys(from, to);
  if (days <= 0) return 0;
  if (period.kind === 'weekly') return Math.floor(days / 7);
  return days; // daily
}

// weekdayContent 행: 오늘이 활성 요일인지. weekdays: 0=월~6=일.
export function isWeekdayActive(weekdays: number[], now: Date = new Date()): boolean {
  const shifted = shiftToKstCycleDate(now);
  const utcDow = shifted.getUTCDay(); // 0=Sun..6=Sat
  const mondayBased = (utcDow + 6) % 7; // 0=Mon..6=Sun
  return weekdays.includes(mondayBased);
}
