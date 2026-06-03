import { classImageUrlByName } from '@/app/my-characters/_define/classImage';

export function getClassImageUrl(className: string): string | undefined {
  return classImageUrlByName[className];
}

export function convertItemLevelToNumber(itemLevel: string) {
  return Number(itemLevel.replaceAll(',', ''));
}