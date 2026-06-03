const LOSTARK_API_BASE_URL = 'https://developer-lostark.game.onstove.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

type RequestBody = {
  characterName?: string;
  debug?: boolean;
};

type SectionStatus = 'success' | 'failed' | 'empty' | 'needsReview';

type SectionResult = {
  key: string;
  status: SectionStatus;
  data: unknown;
  error?: string;
};

type ParsedEquipmentItem = {
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
  polishEffects: string[];
  arkPassiveEffects: string[];
  braceletEffects: string[];
  abilityStoneBonusEffects: string[];
  abilityStoneEngravings: string[];
};

type ParsedAvatarItem = {
  name: string | null;
  type: string | null;
  grade: string | null;
  isInner: boolean | null;
  isSet: boolean | null;
  basicEffects: string[];
  tendencyEffects: string[];
};

type ParsedEngravingItem = {
  name: string | null;
  grade: string | null;
  level: number | null;
  abilityStoneLevel: number | null;
};

type ParsedGemItem = {
  slot: number | null;
  name: string | null;
  grade: string | null;
  level: number | null;
  kind: string | null;
  skillName: string | null;
  effects: string[];
  bonusEffect: string | null;
};

type ParsedGemSummary = {
  items: ParsedGemItem[];
  totalBasicAttack: string | null;
};

const sections = [
  { key: 'profiles', path: 'profiles' },
  { key: 'equipment', path: 'equipment' },
  { key: 'engravings', path: 'engravings' },
  { key: 'gems', path: 'gems' },
  { key: 'avatars', path: 'avatars' },
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
        parsed.polishEffects.push(...lines);
      } else if (title.includes('아크 패시브 포인트 효과')) {
        parsed.arkPassiveEffects.push(...lines);
      } else if (title.includes('팔찌 효과')) {
        parsed.braceletEffects.push(...lines);
      } else if (title.includes('세공 단계 보너스')) {
        parsed.abilityStoneBonusEffects.push(...lines);
      }
    }

    if (type === 'IndentStringGroup') {
      parsed.abilityStoneEngravings.push(...collectNestedText(element.value));
    }
  }

  return parsed;
}

function isAccessoryType(type: string | null) {
  return ['목걸이', '귀걸이', '반지'].some((label) => type?.includes(label));
}

function isGearType(type: string | null) {
  return ['무기', '투구', '상의', '하의', '장갑', '어깨'].some((label) => type?.includes(label));
}

function classifyEquipment(equipment: unknown[]) {
  const parsedItems = equipment.map(parseEquipmentItem);
  const gear: ParsedEquipmentItem[] = [];
  const accessories: ParsedEquipmentItem[] = [];
  let bracelet: ParsedEquipmentItem | null = null;
  let abilityStone: ParsedEquipmentItem | null = null;

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
  }

  return { gear, accessories, bracelet, abilityStone };
}

function parseAvatarItem(item: unknown): ParsedAvatarItem {
  const itemRecord = asRecord(item);
  const tooltip = parseTooltip(itemRecord.Tooltip);
  const elements = getTooltipElements(tooltip);
  const parsed: ParsedAvatarItem = {
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

function parseLegendaryAvatars(avatars: unknown[]) {
  return avatars
    .map(parseAvatarItem)
    .filter((avatar) => avatar.grade === '전설' && avatar.isInner === true);
}

function parseEngravings(engravings: Record<string, unknown>): ParsedEngravingItem[] {
  return asArray(engravings.ArkPassiveEffects).map((item) => {
    const itemRecord = asRecord(item);

    return {
      name: getString(itemRecord, 'Name'),
      grade: getString(itemRecord, 'Grade'),
      level: getNumber(itemRecord, 'Level'),
      abilityStoneLevel: getNumber(itemRecord, 'AbilityStoneLevel'),
    };
  });
}

function getGemKind(name: string | null) {
  if (name?.includes('겁화')) return '겁화';
  if (name?.includes('작열')) return '작열';

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

function parseGems(gems: Record<string, unknown>): ParsedGemSummary {
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

  const items = asArray(gems.Gems).map((item) => {
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
      slot,
      name,
      grade: getString(itemRecord, 'Grade'),
      level: getNumber(itemRecord, 'Level'),
      kind: getGemKind(name),
      skillName,
      effects: effectsToUse,
      bonusEffect,
    };
  });

  return {
    items,
    totalBasicAttack: stripHtml(getString(effects, 'Description') ?? '') || null,
  };
}

function buildSummary(rawPayload: Record<string, unknown>) {
  const profile = asRecord(rawPayload.profiles);
  const equipment = asArray(rawPayload.equipment);
  const engravings = asRecord(rawPayload.engravings);
  const gems = asRecord(rawPayload.gems);
  const avatars = asArray(rawPayload.avatars);
  const equipmentGroups = classifyEquipment(equipment);

  return {
    profile: {
      characterName: getString(profile, 'CharacterName'),
      serverName: getString(profile, 'ServerName'),
      characterClassName: getString(profile, 'CharacterClassName'),
      itemAvgLevel: getString(profile, 'ItemAvgLevel'),
      characterLevel: profile.CharacterLevel ?? null,
      expeditionLevel: profile.ExpeditionLevel ?? null,
      guildName: getString(profile, 'GuildName'),
      title: getString(profile, 'Title'),
      combatPower: profile.CombatPower ?? null,
      honorPoint: profile.HonorPoint ?? null,
    },
    equipment: equipmentGroups.gear,
    accessories: equipmentGroups.accessories,
    bracelet: equipmentGroups.bracelet,
    abilityStone: equipmentGroups.abilityStone,
    engravings: parseEngravings(engravings),
    gems: parseGems(gems),
    legendaryAvatars: parseLegendaryAvatars(avatars),
    needsReview: ['상급재련', '코어', '젬', '카르마'],
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
    return {
      key: section.key,
      status: 'failed',
      data: null,
      error: `${response.status} ${response.statusText}`,
    };
  }

  const data = await response.json();

  return {
    key: section.key,
    status: data === null || (Array.isArray(data) && data.length === 0) ? 'empty' : 'success',
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

    const results = await Promise.all(
      sections.map((section) => fetchSection(characterName, section, apiKey)),
    );

    const rawPayload: Record<string, unknown> = {};
    const sectionStatus: Record<string, SectionStatus> = {};

    for (const result of results) {
      rawPayload[result.key] = result.data;
      sectionStatus[result.key] = result.status;
    }

    if (sectionStatus.arkgrid === 'success') {
      sectionStatus.arkgrid = 'needsReview';
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
          sectionStatus,
          debug: body.debug === true ? results : undefined,
        },
      },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    return Response.json(
      {
        message: 'Unexpected function error.',
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 500, headers: corsHeaders },
    );
  }
});
