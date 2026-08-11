import { createClient } from 'npm:@supabase/supabase-js@2';

const LOSTARK_API_BASE_URL = 'https://developer-lostark.game.onstove.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type RequestBody = {
  characterName?: string;
};

type SectionResult = {
  key: string;
  data: unknown;
};

type ParsedEquipmentItem = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  quality: number | null;
  itemLevel: string | null;
  tier: string | null;
  enhancement: number | null;
  title: string | null;
  basicEffects: string[];
  additionalEffects: string[];
  polishEffects: ParsedPolishEffect[];
  arkPassiveEffects: string[];
  braceletEffects: ParsedColoredEffect[];
  abilityStoneBonusEffects: string[];
  abilityStoneEngravings: ParsedAbilityStoneEngraving[];
  specialEffects: string[];
};

type ParsedAvatarItem = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  isInner: boolean | null;
  isSet: boolean | null;
  basicEffects: string[];
  tendencyEffects: string[];
};

type ParsedProfileStat = {
  type: string | null;
  value: string | null;
  tooltip: string | null;
};

type ParsedSkillPoints = {
  using: number | null;
  total: number | null;
};

type ParsedCardItem = {
  slot: number | null;
  name: string | null;
  icon: string | null;
  awakeCount: number | null;
  awakeTotal: number | null;
  grade: string | null;
};

type ParsedCardEffectItem = {
  name: string | null;
  description: string | null;
};

type ParsedCardEffect = {
  index: number | null;
  cardSlots: number[];
  items: ParsedCardEffectItem[];
};

type ParsedCombatSkillTripod = {
  slot: number | null;
  name: string | null;
  icon: string | null;
  level: number | null;
};

type ParsedCombatSkillRune = {
  name: string | null;
  icon: string | null;
  grade: string | null;
};

type ParsedCombatSkill = {
  name: string | null;
  icon: string | null;
  level: number | null;
  type: string | null;
  isAwakening: boolean | null;
  rune: ParsedCombatSkillRune | null;
  tripods: ParsedCombatSkillTripod[];
};

type LegendaryAvatarSummaryItem = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
};

type ParsedEngravingItem = {
  name: string | null;
  grade: string | null;
  level: number | null;
  description: string | null;
  abilityStoneLevel: number | null;
};

type ParsedGemItem = {
  icon: string | null;
  slot: number | null;
  name: string | null;
  grade: string | null;
  level: number | null;
  kind: string | null;
  effectType: 'damage' | 'cooldown' | null;
  skillName: string | null;
  effects: string[];
  bonusEffect: string | null;
};

type ParsedArkPassivePoint = {
  name: string | null;
  value: number | null;
  description: string | null;
};

type ParsedArkPassiveNode = {
  category: string | null;
  tier: number | null;
  name: string | null;
  level: number | null;
  icon: string | null;
  description: string | null;
};

type ParsedArkPassiveSummary = {
  title: string | null;
  points: ParsedArkPassivePoint[];
  nodes: ParsedArkPassiveNode[];
};

type ParsedArkGridCore = {
  icon: string | null;
  name: string | null;
  grade: string | null;
  point: number | null;
};

type ParsedArkGridEffect = {
  name: string | null;
  level: number | null;
};

type ParsedArkGridSummary = {
  cores: ParsedArkGridCore[];
  effects: ParsedArkGridEffect[];
};

type ParsedColoredEffect = {
  text: string;
  color: string | null;
};

type ParsedPolishEffect = ParsedColoredEffect;

type ParsedAbilityStoneEngraving = {
  name: string;
  level: number | null;
};

type GearSummaryItem = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  title: string | null;
  tier: string | null;
  quality: number | null;
  itemLevel: string | null;
  enhancement: number | null;
  basicEffects: string[];
  additionalEffects: string[];
  arkPassiveEffects: string[];
};

type AccessorySummaryItem = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  title: string | null;
  tier: string | null;
  quality: number | null;
  basicEffects: string[];
  additionalEffects: string[];
  polishEffects: ParsedPolishEffect[];
  arkPassiveEffects: string[];
};

type BraceletSummaryItem = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  title: string | null;
  tier: string | null;
  basicEffects: string[];
  additionalEffects: string[];
  braceletEffects: ParsedColoredEffect[];
};

type AbilityStoneSummaryItem = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  title: string | null;
  tier: string | null;
  basicEffects: string[];
  additionalEffects: string[];
  abilityStoneBonusEffects: string[];
  abilityStoneEngravings: ParsedAbilityStoneEngraving[];
};

type OrbSummaryItem = {
  icon: string | null;
  name: string | null;
  type: string | null;
  grade: string | null;
  title: string | null;
  tier: string | null;
  paradisePowerText: string | null;
  specialEffects: string[];
};

const sections = [
  { key: 'profiles', path: 'profiles' },
  { key: 'equipment', path: 'equipment' },
  { key: 'engravings', path: 'engravings' },
  { key: 'gems', path: 'gems' },
  { key: 'avatars', path: 'avatars' },
  { key: 'cards', path: 'cards' },
  { key: 'combatSkills', path: 'combat-skills' },
  { key: 'arkpassive', path: 'arkpassive' },
  { key: 'arkgrid', path: 'arkgrid' },
] as const;

function asRecord(value: unknown): Record<string, unknown> {
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asStringArray(value: unknown): string[] {
  return asArray(value)
    .map((item) => (typeof item === 'string' ? stripHtml(item) : ''))
    .filter(Boolean);
}

function getString(record: Record<string, unknown>, key: string): string | null {
  const value = record[key];
  return typeof value === 'string' ? value : null;
}

function getNumber(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  return typeof value === 'number' ? value : null;
}

function getBoolean(record: Record<string, unknown>, key: string): boolean | null {
  const value = record[key];
  return typeof value === 'boolean' ? value : null;
}

function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<img\b[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n[ \t]+/g, '\n')
    .trim();
}

function splitTextLines(value: string | null) {
  if (!value) return [];

  return stripHtml(value)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseTooltip(value: unknown) {
  if (typeof value !== 'string') return {};

  try {
    return asRecord(JSON.parse(value));
  } catch {
    return {};
  }
}

function getTooltipElements(tooltip: Record<string, unknown>) {
  return Object.entries(tooltip)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([, value]) => asRecord(value))
    .filter((element) => Object.keys(element).length > 0);
}

function getItemTitleData(elements: Record<string, unknown>[]) {
  const titleElement = elements.find((element) => getString(element, 'type') === 'ItemTitle');
  return asRecord(titleElement?.value);
}

function getPartBoxTitle(value: Record<string, unknown>) {
  return stripHtml(getString(value, 'Element_000') ?? '');
}

function getPartBoxLines(value: Record<string, unknown>) {
  return splitTextLines(getString(value, 'Element_001'));
}

function getColoredEffects(value: Record<string, unknown>): ParsedColoredEffect[] {
  const rawText = getString(value, 'Element_001');

  if (!rawText) return [];

  return rawText
    .split(/<br\s*\/?>/i)
    .map((line) => {
      const color = line.match(/<FONT[^>]+COLOR=['"]?#?([A-Fa-f0-9]{6})['"]?[^>]*>/i)?.[1] ?? null;

      return {
        text: stripHtml(line),
        color: color?.toUpperCase() ?? null,
      };
    })
    .filter((effect) => effect.text.length > 0);
}

function collectNestedText(value: unknown, result: string[] = []) {
  if (typeof value === 'string') {
    result.push(...splitTextLines(value));
    return result;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectNestedText(item, result);
    }
    return result;
  }

  if (value !== null && typeof value === 'object') {
    for (const nestedValue of Object.values(value)) {
      collectNestedText(nestedValue, result);
    }
  }

  return result;
}

function parseAbilityStoneEngraving(text: string): ParsedAbilityStoneEngraving | null {
  const normalized = stripHtml(text);
  const name = normalized.match(/\[([^\]]+)\]/)?.[1]?.trim();

  if (!name || name === '레벨 보너스') return null;

  const levelText = normalized.match(/Lv\.(\d+)/)?.[1];

  return {
    name,
    level: levelText ? Number(levelText) : null,
  };
}

function collectAbilityStoneEngravings(value: unknown, result: ParsedAbilityStoneEngraving[] = []) {
  if (typeof value === 'string') {
    const engraving = parseAbilityStoneEngraving(value);

    if (engraving) {
      result.push(engraving);
    }

    return result;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectAbilityStoneEngravings(item, result);
    }

    return result;
  }

  if (value !== null && typeof value === 'object') {
    for (const nestedValue of Object.values(value)) {
      collectAbilityStoneEngravings(nestedValue, result);
    }
  }

  return result;
}

function getItemLevelInfo(text: string | null) {
  const normalized = stripHtml(text ?? '');
  const itemLevel = normalized.match(/아이템 레벨\s*([\d,.]+)/)?.[1] ?? null;
  const tier =
    normalized.match(/티어\s*(\d+)/)?.[1] ?? normalized.match(/아이템 티어\s*(\d+)/)?.[1] ?? null;

  return {
    itemLevel,
    tier: tier ? `티어 ${tier}` : null,
  };
}

function getEnhancement(name: string | null) {
  const value = name?.match(/^\+(\d+)/)?.[1];
  return value ? Number(value) : null;
}

function parseEquipmentItem(item: unknown): ParsedEquipmentItem {
  const itemRecord = asRecord(item);
  const tooltip = parseTooltip(itemRecord.Tooltip);
  const elements = getTooltipElements(tooltip);
  const titleData = getItemTitleData(elements);
  const itemLevelInfo = getItemLevelInfo(getString(titleData, 'leftStr2'));
  const quality = getNumber(titleData, 'qualityValue');
  const parsed: ParsedEquipmentItem = {
    icon: getString(itemRecord, 'Icon'),
    name: getString(itemRecord, 'Name'),
    type: getString(itemRecord, 'Type'),
    grade: getString(itemRecord, 'Grade'),
    quality: quality !== null && quality >= 0 ? quality : null,
    itemLevel: itemLevelInfo.itemLevel,
    tier: itemLevelInfo.tier,
    enhancement: getEnhancement(getString(itemRecord, 'Name')),
    title: stripHtml(getString(titleData, 'leftStr0') ?? '') || null,
    basicEffects: [],
    additionalEffects: [],
    polishEffects: [],
    arkPassiveEffects: [],
    braceletEffects: [],
    abilityStoneBonusEffects: [],
    abilityStoneEngravings: [],
    specialEffects: [],
  };

  for (const element of elements) {
    const type = getString(element, 'type');

    if (type === 'ItemPartBox') {
      const value = asRecord(element.value);
      const title = getPartBoxTitle(value);
      const lines = getPartBoxLines(value);

      if (title.includes('기본 효과')) {
        parsed.basicEffects.push(...lines);
      } else if (title.includes('추가 효과')) {
        parsed.additionalEffects.push(...lines);
      } else if (title.includes('연마 효과')) {
        parsed.polishEffects.push(...getColoredEffects(value));
      } else if (title.includes('아크 패시브 포인트 효과')) {
        parsed.arkPassiveEffects.push(...lines);
      } else if (title.includes('팔찌 효과')) {
        parsed.braceletEffects.push(...getColoredEffects(value));
      } else if (title.includes('세공 단계 보너스')) {
        parsed.abilityStoneBonusEffects.push(...lines);
      } else if (title.includes('특수 효과')) {
        parsed.specialEffects.push(...lines);
      }
    }

    if (type === 'IndentStringGroup') {
      parsed.abilityStoneEngravings.push(...collectAbilityStoneEngravings(element.value));
    }
  }

  return parsed;
}

function isAccessoryType(type: string | null) {
  return ['목걸이', '귀걸이', '반지'].some((label) => type?.includes(label));
}

function isGearType(type: string | null) {
  return ['무기', '투구', '상의', '하의', '장갑', '어깨', '완갑'].some((label) =>
    type?.includes(label),
  );
}

function classifyEquipment(equipment: unknown[]) {
  const parsedItems = equipment.map(parseEquipmentItem);
  const gear: ParsedEquipmentItem[] = [];
  const accessories: ParsedEquipmentItem[] = [];
  let bracelet: ParsedEquipmentItem | null = null;
  let abilityStone: ParsedEquipmentItem | null = null;
  let orb: ParsedEquipmentItem | null = null;

  for (const item of parsedItems) {
    const type = item.type;

    if (isGearType(type)) {
      gear.push(item);
      continue;
    }

    if (isAccessoryType(type)) {
      accessories.push(item);
      continue;
    }

    if (type?.includes('팔찌')) {
      bracelet = item;
      continue;
    }

    if (type?.includes('어빌리티 스톤') || type?.includes('어빌리티스톤')) {
      abilityStone = item;
      continue;
    }

    if (type?.includes('보주')) {
      orb = item;
      continue;
    }
  }

  return { gear, accessories, bracelet, abilityStone, orb };
}

function buildGearSummary(item: ParsedEquipmentItem): GearSummaryItem {
  return {
    icon: item.icon,
    name: item.name,
    type: item.type,
    grade: item.grade,
    title: item.title,
    tier: item.tier,
    quality: item.quality,
    itemLevel: item.itemLevel,
    enhancement: item.enhancement,
    basicEffects: item.basicEffects,
    additionalEffects: item.additionalEffects,
    arkPassiveEffects: item.arkPassiveEffects,
  };
}

function buildAccessorySummary(item: ParsedEquipmentItem): AccessorySummaryItem {
  return {
    icon: item.icon,
    name: item.name,
    type: item.type,
    grade: item.grade,
    title: item.title,
    tier: item.tier,
    quality: item.quality,
    basicEffects: item.basicEffects,
    additionalEffects: item.additionalEffects,
    polishEffects: item.polishEffects,
    arkPassiveEffects: item.arkPassiveEffects,
  };
}

function buildBraceletSummary(item: ParsedEquipmentItem | null): BraceletSummaryItem | null {
  if (!item) return null;

  return {
    icon: item.icon,
    name: item.name,
    type: item.type,
    grade: item.grade,
    title: item.title,
    tier: item.tier,
    basicEffects: item.basicEffects,
    additionalEffects: item.additionalEffects,
    braceletEffects: item.braceletEffects,
  };
}

function buildAbilityStoneSummary(
  item: ParsedEquipmentItem | null,
): AbilityStoneSummaryItem | null {
  if (!item) return null;

  return {
    icon: item.icon,
    name: item.name,
    type: item.type,
    grade: item.grade,
    title: item.title,
    tier: item.tier,
    basicEffects: item.basicEffects,
    additionalEffects: item.additionalEffects,
    abilityStoneBonusEffects: item.abilityStoneBonusEffects,
    abilityStoneEngravings: item.abilityStoneEngravings,
  };
}

function buildOrbSummary(item: ParsedEquipmentItem | null): OrbSummaryItem | null {
  if (!item) return null;

  return {
    icon: item.icon,
    name: item.name,
    type: item.type,
    grade: item.grade,
    title: item.title,
    tier: item.tier,
    paradisePowerText: getOrbParadisePowerText(item.specialEffects),
    specialEffects: item.specialEffects,
  };
}

function getOrbParadisePowerText(specialEffects: string[]) {
  return specialEffects.find((effect) => effect.includes('달성 최대 낙원력')) ?? null;
}

function parseAvatarItem(item: unknown): ParsedAvatarItem {
  const itemRecord = asRecord(item);
  const tooltip = parseTooltip(itemRecord.Tooltip);
  const elements = getTooltipElements(tooltip);
  const parsed: ParsedAvatarItem = {
    icon: getString(itemRecord, 'Icon'),
    name: getString(itemRecord, 'Name'),
    type: getString(itemRecord, 'Type'),
    grade: getString(itemRecord, 'Grade'),
    isInner: getBoolean(itemRecord, 'IsInner'),
    isSet: getBoolean(itemRecord, 'IsSet'),
    basicEffects: [],
    tendencyEffects: [],
  };

  for (const element of elements) {
    const type = getString(element, 'type');

    if (type === 'ItemPartBox') {
      const value = asRecord(element.value);
      const title = getPartBoxTitle(value);

      if (title.includes('기본 효과')) {
        parsed.basicEffects.push(...getPartBoxLines(value));
      }
    }

    if (type === 'SymbolString') {
      const value = asRecord(element.value);
      parsed.tendencyEffects.push(...splitTextLines(getString(value, 'contentStr')));
    }
  }

  return parsed;
}

function parseLegendaryAvatars(avatars: unknown[]): LegendaryAvatarSummaryItem[] {
  return avatars
    .map(parseAvatarItem)
    .filter((avatar) => avatar.grade === '전설')
    .map((avatar) => ({
      icon: avatar.icon,
      name: avatar.name,
      type: avatar.type,
      grade: avatar.grade,
    }));
}

function parseProfileStats(profile: Record<string, unknown>): ParsedProfileStat[] {
  return asArray(profile.Stats).map((item) => {
    const stat = asRecord(item);

    return {
      type: getString(stat, 'Type'),
      value: getString(stat, 'Value'),
      tooltip: stripHtml(getString(stat, 'Tooltip') ?? '') || null,
    };
  });
}

function parseSkillPoints(profile: Record<string, unknown>): ParsedSkillPoints {
  return {
    using: getNumber(profile, 'UsingSkillPoint'),
    total: getNumber(profile, 'TotalSkillPoint'),
  };
}

function parseCards(cards: Record<string, unknown>) {
  return {
    cards: asArray(cards.Cards).map((item) => {
      const card = asRecord(item);

      return {
        slot: getNumber(card, 'Slot'),
        name: getString(card, 'Name'),
        icon: getString(card, 'Icon'),
        awakeCount: getNumber(card, 'AwakeCount'),
        awakeTotal: getNumber(card, 'AwakeTotal'),
        grade: getString(card, 'Grade'),
      } satisfies ParsedCardItem;
    }),
    effects: asArray(cards.Effects).map((item) => {
      const effect = asRecord(item);

      return {
        index: getNumber(effect, 'Index'),
        cardSlots: asArray(effect.CardSlots).filter(
          (slot): slot is number => typeof slot === 'number',
        ),
        items: asArray(effect.Items).map((effectItem) => {
          const cardEffectItem = asRecord(effectItem);

          return {
            name: getString(cardEffectItem, 'Name'),
            description: stripHtml(getString(cardEffectItem, 'Description') ?? '') || null,
          } satisfies ParsedCardEffectItem;
        }),
      } satisfies ParsedCardEffect;
    }),
  };
}

function parseCombatSkills(combatSkills: unknown[]): ParsedCombatSkill[] {
  return combatSkills.map((item) => {
    const skill = asRecord(item);
    const rune = asRecord(skill.Rune);

    return {
      name: getString(skill, 'Name'),
      icon: getString(skill, 'Icon'),
      level: getNumber(skill, 'Level'),
      type: getString(skill, 'Type'),
      isAwakening: getBoolean(skill, 'IsAwakening'),
      rune:
        Object.keys(rune).length === 0
          ? null
          : {
              name: getString(rune, 'Name'),
              icon: getString(rune, 'Icon'),
              grade: getString(rune, 'Grade'),
            },
      tripods: asArray(skill.Tripods)
        .map(asRecord)
        .filter((tripod) => getBoolean(tripod, 'IsSelected') === true)
        .map((tripod) => ({
          slot: getNumber(tripod, 'Slot'),
          name: getString(tripod, 'Name'),
          icon: getString(tripod, 'Icon'),
          level: getNumber(tripod, 'Level'),
        })),
    };
  });
}

function parseEngravings(engravings: Record<string, unknown>): ParsedEngravingItem[] {
  return asArray(engravings.ArkPassiveEffects).map((item) => {
    const itemRecord = asRecord(item);

    return {
      name: getString(itemRecord, 'Name'),
      grade: getString(itemRecord, 'Grade'),
      level: getNumber(itemRecord, 'Level'),
      description: stripHtml(getString(itemRecord, 'Description') ?? '') || null,
      abilityStoneLevel: getNumber(itemRecord, 'AbilityStoneLevel'),
    };
  });
}

function getGemKind(name: string | null) {
  if (name?.includes('겁화')) return '겁화';
  if (name?.includes('멸화')) return '멸화';
  if (name?.includes('작열')) return '작열';
  if (name?.includes('홍염')) return '홍염';
  if (name?.includes('광휘')) return '광휘';

  return null;
}

function getGemEffectTypeFromEffects(effects: string[]) {
  const hasDamage = effects.some((effect) => effect.includes('피해'));
  const hasCooldown = effects.some((effect) => effect.includes('재사용 대기시간'));

  if (hasDamage) return 'damage';
  if (hasCooldown) return 'cooldown';

  return null;
}

function getGemEffectLines(itemRecord: Record<string, unknown>) {
  const tooltip = parseTooltip(itemRecord.Tooltip);
  const elements = getTooltipElements(tooltip);

  return elements.flatMap((element) => {
    if (getString(element, 'type') !== 'ItemPartBox') return [];

    const value = asRecord(element.value);
    const title = getPartBoxTitle(value);

    if (!title.includes('효과')) return [];

    return getPartBoxLines(value);
  });
}

function getGemSkillName(effectLine: string | null) {
  const normalized = stripHtml(effectLine ?? '');
  return normalized.match(/\[[^\]]+\]\s*(.+?)\s+(?:피해|재사용 대기시간)/)?.[1]?.trim() ?? null;
}

function getGemEffect(effectLine: string, skillName: string | null) {
  let normalized = stripHtml(effectLine)
    .replace(/^\[[^\]]+\]\s*/, '')
    .trim();

  if (skillName && normalized.startsWith(skillName)) {
    normalized = normalized.slice(skillName.length).trim();
  }

  return normalized;
}

function parseGems(gems: Record<string, unknown>): ParsedGemItem[] {
  const effects = asRecord(gems.Effects);
  const skills = asArray(effects.Skills);
  const skillByGemSlot = new Map<number, Record<string, unknown>>();

  for (const skill of skills) {
    const skillRecord = asRecord(skill);
    const gemSlot = getNumber(skillRecord, 'GemSlot');

    if (gemSlot !== null) {
      skillByGemSlot.set(gemSlot, skillRecord);
    }
  }

  return asArray(gems.Gems).map((item) => {
    const itemRecord = asRecord(item);
    const slot = getNumber(itemRecord, 'Slot');
    const skillRecord = slot !== null ? skillByGemSlot.get(slot) : undefined;
    const safeSkillRecord = asRecord(skillRecord);
    const effectLines = getGemEffectLines(itemRecord);
    const additionalEffectIndex = effectLines.findIndex((line) => line.includes('추가 효과'));
    const mainEffectLines =
      additionalEffectIndex >= 0 ? effectLines.slice(0, additionalEffectIndex) : effectLines;
    const bonusEffect =
      getString(safeSkillRecord, 'Option') ??
      (additionalEffectIndex >= 0 ? effectLines[additionalEffectIndex + 1] : null) ??
      null;
    const name = stripHtml(getString(itemRecord, 'Name') ?? '') || null;
    const kind = getGemKind(name);
    const skillName =
      getString(safeSkillRecord, 'Name') ?? getGemSkillName(mainEffectLines[0] ?? null);
    const skillEffects = asStringArray(safeSkillRecord.Description);
    const effectsToUse =
      skillEffects.length > 0
        ? skillEffects
        : mainEffectLines
            .map((line) => getGemEffect(line, skillName))
            .filter((line) => line.length > 0);

    return {
      icon: getString(itemRecord, 'Icon'),
      slot,
      name,
      grade: getString(itemRecord, 'Grade'),
      level: getNumber(itemRecord, 'Level'),
      kind,
      effectType: getGemEffectTypeFromEffects(effectsToUse),
      skillName,
      effects: effectsToUse,
      bonusEffect,
    };
  });
}

function parseArkPassive(arkPassive: Record<string, unknown>): ParsedArkPassiveSummary {
  return {
    title: getString(arkPassive, 'Title'),
    points: asArray(arkPassive.Points).map((item) => {
      const itemRecord = asRecord(item);

      return {
        name: getString(itemRecord, 'Name'),
        value: getNumber(itemRecord, 'Value'),
        description: getString(itemRecord, 'Description'),
      };
    }),
    nodes: asArray(arkPassive.Effects).map(parseArkPassiveNode),
  };
}

function parseArkPassiveNode(item: unknown): ParsedArkPassiveNode {
  const node = asRecord(item);
  const tooltip = parseTooltip(node.ToolTip);
  const elements = getTooltipElements(tooltip);
  const nameTagText = getArkPassiveTooltipText(elements, 'NameTagBox');
  const skillTitleText = getArkPassiveTooltipText(elements, 'CommonSkillTitle');
  const tooltipDescription = getArkPassiveTooltipText(elements, 'MultiTextBox');
  const fallbackDescription = stripHtml(getString(node, 'Description') ?? '');
  const metadataText = [nameTagText, skillTitleText, fallbackDescription].filter(Boolean).join(' ');

  return {
    category: getArkPassiveCategory(metadataText) ?? getString(node, 'Name'),
    tier: getArkPassiveTier(metadataText),
    name:
      getArkPassiveName(nameTagText) ??
      getArkPassiveName(skillTitleText) ??
      getString(node, 'Name'),
    level: getArkPassiveLevel(skillTitleText) ?? getArkPassiveLevel(fallbackDescription),
    icon: getString(node, 'Icon'),
    description: tooltipDescription || fallbackDescription || null,
  };
}

function getArkPassiveTooltipText(elements: Record<string, unknown>[], type: string) {
  return elements
    .filter((element) => getString(element, 'type') === type)
    .flatMap((element) => collectNestedText(element.value))
    .join('\n');
}

function getArkPassiveCategory(value: string) {
  return value.match(/(진화|깨달음|도약)/)?.[1] ?? null;
}

function getArkPassiveTier(value: string) {
  const tier = value.match(/(\d+)\s*티어/)?.[1];
  return tier ? Number(tier) : null;
}

function getArkPassiveName(value: string) {
  const name = value.replace(/Lv\.\s*\d+/i, '').trim();
  return name || null;
}

function getArkPassiveLevel(value: string) {
  const level = value.match(/Lv\.\s*(\d+)/i)?.[1];
  return level ? Number(level) : null;
}

function parseArkGrid(arkGrid: Record<string, unknown>): ParsedArkGridSummary {
  return {
    cores: asArray(arkGrid.Slots).map((item) => {
      const itemRecord = asRecord(item);

      return {
        icon: getString(itemRecord, 'Icon'),
        name: getString(itemRecord, 'Name'),
        grade: getString(itemRecord, 'Grade'),
        point: getNumber(itemRecord, 'Point'),
      };
    }),
    effects: asArray(arkGrid.Effects).map((item) => {
      const itemRecord = asRecord(item);

      return {
        name: getString(itemRecord, 'Name'),
        level: getNumber(itemRecord, 'Level'),
      };
    }),
  };
}

function buildSummary(rawPayload: Record<string, unknown>) {
  const profile = asRecord(rawPayload.profiles);
  const equipment = asArray(rawPayload.equipment);
  const engravings = asRecord(rawPayload.engravings);
  const gems = asRecord(rawPayload.gems);
  const avatars = asArray(rawPayload.avatars);
  const cards = asRecord(rawPayload.cards);
  const combatSkills = asArray(rawPayload.combatSkills);
  const arkPassive = asRecord(rawPayload.arkpassive);
  const arkGrid = asRecord(rawPayload.arkgrid);
  const equipmentGroups = classifyEquipment(equipment);

  return {
    profiles: {
      characterName: getString(profile, 'CharacterName'),
      serverName: getString(profile, 'ServerName'),
      characterClassName: getString(profile, 'CharacterClassName'),
      itemAvgLevel: getString(profile, 'ItemAvgLevel'),
      combatPower: profile.CombatPower ?? null,
      characterImage: getString(profile, 'CharacterImage'),
      stats: parseProfileStats(profile),
      skillPoints: parseSkillPoints(profile),
    },
    equipment: {
      gears: equipmentGroups.gear.map(buildGearSummary),
      accessories: equipmentGroups.accessories.map(buildAccessorySummary),
      bracelet: buildBraceletSummary(equipmentGroups.bracelet),
      abilityStone: buildAbilityStoneSummary(equipmentGroups.abilityStone),
      orb: buildOrbSummary(equipmentGroups.orb),
    },
    engravings: parseEngravings(engravings),
    gems: parseGems(gems),
    avatars: avatars.map(parseAvatarItem),
    legendaryAvatars: parseLegendaryAvatars(avatars),
    cards: parseCards(cards),
    combatSkills: parseCombatSkills(combatSkills),
    arkPassive: parseArkPassive(arkPassive),
    arkGrid: parseArkGrid(arkGrid),
  };
}

async function fetchSection(
  characterName: string,
  section: (typeof sections)[number],
  apiKey: string,
): Promise<SectionResult> {
  const response = await fetch(
    `${LOSTARK_API_BASE_URL}/armories/characters/${encodeURIComponent(
      characterName,
    )}/${section.path}`,
    {
      headers: {
        accept: 'application/json',
        authorization: `bearer ${apiKey}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Lost Ark ${section.key} section request failed with status ${response.status}.`,
    );
  }

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    throw new Error(`Lost Ark ${section.key} section response could not be parsed.`);
  }

  return {
    key: section.key,
    data,
  };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return Response.json({ message: 'Method not allowed.' }, { status: 405, headers: corsHeaders });
  }

  try {
    const authErrorResponse = await validateAuthorization(req);
    if (authErrorResponse !== null) {
      return authErrorResponse;
    }

    const body = (await req.json()) as RequestBody;
    const characterName = body.characterName?.trim();

    if (!characterName) {
      return Response.json(
        { message: 'characterName is required.' },
        { status: 400, headers: corsHeaders },
      );
    }

    const apiKey = Deno.env.get('LOSTARK_API_KEY');

    if (!apiKey) {
      return Response.json(
        { message: 'LOSTARK_API_KEY is required.' },
        { status: 500, headers: corsHeaders },
      );
    }

    let results: SectionResult[];

    try {
      results = await Promise.all(
        sections.map((section) => fetchSection(characterName, section, apiKey)),
      );
    } catch {
      return Response.json(
        { message: 'Failed to fetch character details.' },
        { status: 502, headers: corsHeaders },
      );
    }

    const rawPayload: Record<string, unknown> = {};

    for (const result of results) {
      rawPayload[result.key] = result.data;
    }

    const summary = buildSummary(rawPayload);
    const profile = asRecord(rawPayload.profiles);

    return Response.json(
      {
        ok: true,
        status: 200,
        data: {
          characterName,
          serverName: getString(profile, 'ServerName'),
          characterClass: getString(profile, 'CharacterClassName'),
          itemLevel: getString(profile, 'ItemAvgLevel'),
          summary,
          rawPayload,
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch {
    return Response.json(
      {
        message: 'Unexpected function error.',
      },
      { status: 500, headers: corsHeaders },
    );
  }
});

async function validateAuthorization(req: Request) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

  if (token === undefined) {
    return Response.json(
      { message: 'Authentication is required.' },
      { status: 401, headers: corsHeaders },
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SB_PUBLISHABLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseKey) {
    return Response.json(
      { message: 'Supabase Auth environment variables are required.' },
      { status: 500, headers: corsHeaders },
    );
  }

  const allowedEmails = getAllowedAuthEmails();

  if (allowedEmails.length === 0) {
    return Response.json(
      { message: 'AUTH_ALLOWED_EMAILS is required.' },
      { status: 500, headers: corsHeaders },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || user === null) {
    return Response.json(
      { message: 'Authentication is required.' },
      { status: 401, headers: corsHeaders },
    );
  }

  if (!isAllowedAuthEmail(user.email, allowedEmails)) {
    return Response.json(
      { message: 'This account cannot access LoaM.' },
      { status: 403, headers: corsHeaders },
    );
  }

  return null;
}

function getAllowedAuthEmails() {
  return (
    Deno.env
      .get('AUTH_ALLOWED_EMAILS')
      ?.split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean) ?? []
  );
}

function isAllowedAuthEmail(email: string | undefined, allowedEmails: string[]) {
  return email !== undefined && allowedEmails.includes(email.toLowerCase());
}
