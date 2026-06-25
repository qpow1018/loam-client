import type {
  TCreateLevelGoldRowsOptions,
  TClearGoldCategory,
  TClearGoldContent,
  TClearGoldGate,
  TClearGoldSummary,
  TLevelGoldDifficultyOption,
  TLevelGoldRaid,
  TLevelGoldRaidGroup,
  TLevelGoldRow,
} from '../_type/clearGold';

const GOLD_NUMBER_FORMATTER = new Intl.NumberFormat('ko-KR');
const LEVEL_GOLD_MIN_LEVEL = 1700;
const LEVEL_GOLD_MAX_LEVEL = 1780;
const MAX_REWARD_RAID_COUNT = 3;

export function calculateClearGoldSummary(gates: readonly TClearGoldGate[]): TClearGoldSummary {
  const summary = gates.reduce(
    (accumulator, gate) => ({
      tradableGold: accumulator.tradableGold + gate.tradableGold,
      boundGold: accumulator.boundGold + gate.boundGold,
    }),
    { tradableGold: 0, boundGold: 0 },
  );

  return {
    ...summary,
    totalGold: summary.tradableGold + summary.boundGold,
  };
}

export function formatGold(value: number) {
  return GOLD_NUMBER_FORMATTER.format(value);
}

export function createLevelGoldRows(
  categories: readonly TClearGoldCategory[],
  options: TCreateLevelGoldRowsOptions = {},
): TLevelGoldRow[] {
  const contents = categories.flatMap<TClearGoldContent>((category) => category.contents);
  const levels = getLevelGoldEntryLevels(contents);
  const excludedDifficultyIds = new Set(options.excludedDifficultyIds ?? []);

  return levels.map((level) => {
    const withBoundRaids = contents
      .map((content) => getBestEligibleRaid(content, level, 'totalGold', excludedDifficultyIds))
      .filter((raid): raid is TLevelGoldRaid => raid !== undefined);
    const withoutBoundRaids = contents
      .map((content) => getBestEligibleRaid(content, level, 'tradableGold', excludedDifficultyIds))
      .filter((raid): raid is TLevelGoldRaid => raid !== undefined);

    return {
      level,
      withBound: createLevelGoldRaidGroup(withBoundRaids, 'totalGold'),
      withoutBound: createLevelGoldRaidGroup(withoutBoundRaids, 'tradableGold'),
    };
  });
}

export function createLevelGoldDifficultyOptions(
  categories: readonly TClearGoldCategory[],
): TLevelGoldDifficultyOption[] {
  return categories.flatMap((category) =>
    category.contents.flatMap((content) =>
      content.difficulties.map((difficulty) => ({
        contentId: content.id,
        contentName: content.name,
        difficultyId: difficulty.id,
        difficultyName: difficulty.name,
        entryItemLevel: difficulty.entryItemLevel,
      })),
    ),
  );
}

function getLevelGoldEntryLevels(contents: readonly TClearGoldContent[]) {
  return Array.from(
    new Set(
      contents.flatMap((content) =>
        content.difficulties
          .map((difficulty) => difficulty.entryItemLevel)
          .filter((level) => level >= LEVEL_GOLD_MIN_LEVEL && level <= LEVEL_GOLD_MAX_LEVEL),
      ),
    ),
  ).sort((a, b) => b - a);
}

function getBestEligibleRaid(
  content: TClearGoldContent,
  level: number,
  goldKey: 'totalGold' | 'tradableGold',
  excludedDifficultyIds: ReadonlySet<string>,
) {
  return content.difficulties
    .filter(
      (difficulty) =>
        difficulty.entryItemLevel <= level && !excludedDifficultyIds.has(difficulty.id),
    )
    .map<TLevelGoldRaid>((difficulty) => {
      const summary = calculateClearGoldSummary(difficulty.gates);

      return {
        contentId: content.id,
        contentName: content.name,
        difficultyId: difficulty.id,
        difficultyName: difficulty.name,
        entryItemLevel: difficulty.entryItemLevel,
        tradableGold: summary.tradableGold,
        boundGold: summary.boundGold,
        totalGold: summary.totalGold,
      };
    })
    .sort(compareLevelGoldRaids(goldKey))[0];
}

function createLevelGoldRaidGroup(
  raids: readonly TLevelGoldRaid[],
  goldKey: 'totalGold' | 'tradableGold',
): TLevelGoldRaidGroup {
  const selectedRaids = [...raids]
    .sort(compareLevelGoldRaids(goldKey))
    .slice(0, MAX_REWARD_RAID_COUNT);

  return {
    raids: selectedRaids,
    totalGold: selectedRaids.reduce((total, raid) => total + raid[goldKey], 0),
  };
}

function compareLevelGoldRaids(goldKey: 'totalGold' | 'tradableGold') {
  return (a: TLevelGoldRaid, b: TLevelGoldRaid) => {
    const goldDifference = b[goldKey] - a[goldKey];

    if (goldDifference !== 0) {
      return goldDifference;
    }

    return b.entryItemLevel - a.entryItemLevel;
  };
}
