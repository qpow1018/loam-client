import type { TMaplestoryEquipmentState } from '@/api/maplestory/type';

export function normalizeEquipmentText(value: string | null | undefined): string | null {
  const normalizedValue = value?.trim() ?? '';
  return normalizedValue.length > 0 ? normalizedValue : null;
}

export function getEquipmentDisplayName(defaultName: string, itemName: string | null): string {
  return normalizeEquipmentText(itemName) ?? defaultName;
}

export function getEquipmentSpecText(state: TMaplestoryEquipmentState | undefined): string {
  if (state === undefined) return '';

  return [
    state.starforce,
    state.bonusOption,
    state.scroll,
    state.potential,
    state.additionalPotential,
    state.extra,
  ]
    .map(normalizeEquipmentText)
    .filter((value): value is string => value !== null)
    .join(' · ');
}
