import { classImageUrlByName } from '@/define/lostark';

export function getClassImageUrl(className: string): string | undefined {
  return classImageUrlByName[className];
}

export function convertItemLevelToNumber(itemLevel: string) {
  return Number(itemLevel.replaceAll(',', ''));
}
