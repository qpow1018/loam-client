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
    return '#fe9600bf';
  }

  if (quality >= 90) {
    return '#ce43fcbf';
  }

  if (quality >= 70) {
    return '#00b5ffbf';
  }

  if (quality >= 30) {
    return '#91fe02bf';
  }

  return '#686660';
}
