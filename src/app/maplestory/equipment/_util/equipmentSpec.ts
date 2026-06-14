export const STARFORCE_PRESETS = ['10성', '12성', '17성', '18성', '21성', '22성'] as const;

export const SCROLL_PRESETS = ['15% 완작', '30% 완작', '70% 완작', '놀긍작', '프악공작'] as const;

export const POTENTIAL_PRESETS = ['15%', '21%', '27%', '30%'] as const;

export const ADDITIONAL_POTENTIAL_PRESETS = ['1줄', '1.5줄', '2줄', '3줄'] as const;

export function calculateBonusOption(values: {
  mainStat: string;
  allStat: string;
  attackPower: string;
}): string {
  if (Object.values(values).every((value) => value.trim() === '')) return '';

  const mainStat = getNumber(values.mainStat);
  const allStat = getNumber(values.allStat);
  const attackPower = getNumber(values.attackPower);

  return `${mainStat + allStat * 10 + attackPower * 4}급`;
}

function getNumber(value: string): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
