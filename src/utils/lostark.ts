import { classImageUrlByName } from '@/define/lostark';

export function getClassImageUrl(className: string): string | undefined {
  return classImageUrlByName[className];
}

export function convertItemLevelToNumber(itemLevel: string) {
  return Number(itemLevel.replaceAll(',', ''));
}

export function getEquipQualityBackground(quality: number | null | undefined) {
  if (quality === null || quality === undefined) {
    return '#686660';
  }

  if (quality >= 100) {
    return '#fe9600cc';
  }

  if (quality >= 90) {
    return '#ce43fccc';
  }

  if (quality >= 70) {
    return '#00b5ffcc';
  }

  if (quality >= 30) {
    return '#91fe02cc';
  }

  return '#686660';
}
