import { classImageUrlByName } from '@/define/lostark';

export function getClassImageUrl(className: string): string | undefined {
  return classImageUrlByName[className];
}

export function convertItemLevelToNumber(itemLevel: string) {
  return Number(itemLevel.replaceAll(',', ''));
}

export function getEquipQualityBackground(quality: number | null | undefined) {
  if (quality === null || quality === undefined) {
    return '#62636c';
  }

  if (quality >= 100) {
    return '#ea6811cc';
  }

  if (quality >= 90) {
    return '#df18e3cc';
  }

  if (quality >= 70) {
    return '#1260ebcc';
  }

  if (quality >= 30) {
    return '#09ae09cc';
  }

  return '#62636c';
}
