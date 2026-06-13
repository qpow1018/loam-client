import { createClient } from '@/lib/supabase/client';

import type {
  TMaplestoryEquipmentState,
  TMaplestoryEquipmentStatePatch,
  TReqCreateMaplestoryMyCharacter,
  TReqUpsertMaplestoryEquipmentStateRow,
  TReqUpsertMaplestoryUnionUserStateRow,
  TReqUpsertMaplestoryMyCharacterRow,
  TResMaplestoryEquipmentStateRow,
  TResMaplestoryMyCharacter,
  TResMaplestoryMyCharacterRow,
  TResMaplestoryUnionCharacter,
  TResMaplestoryUnionCharacterRow,
  TResMaplestoryUnionUserStateRow,
} from './type';

const MAPLESTORY_MY_CHARACTERS_TABLE = 'maplestory_my_characters';
const MAPLESTORY_UNION_CHARACTERS_TABLE = 'maplestory_union_characters';
const MAPLESTORY_UNION_USER_STATES_TABLE = 'maplestory_union_user_states';
const MAPLESTORY_EQUIPMENT_STATES_TABLE = 'maplestory_equipment_states';
const MAPLESTORY_EQUIPMENT_STATE_COLUMNS = `
  id,
  character_id,
  slot_key,
  item_name,
  bonus_option,
  starforce,
  scroll,
  potential,
  additional_potential,
  extra,
  goal,
  purchase_price,
  is_highlighted,
  created_at,
  updated_at
`;

async function getCurrentUserId(): Promise<string> {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || user === null) {
    throw new Error('Login is required.');
  }

  return user.id;
}

function mapCharacterRow(row: TResMaplestoryMyCharacterRow): TResMaplestoryMyCharacter {
  return {
    id: row.id,
    nickname: row.nickname,
    className: row.class_name,
    sortOrder: row.sort_order,
  };
}

function mapEquipmentStateRow(row: TResMaplestoryEquipmentStateRow): TMaplestoryEquipmentState {
  return {
    id: row.id,
    characterId: row.character_id,
    slotKey: row.slot_key,
    itemName: row.item_name,
    bonusOption: row.bonus_option,
    starforce: row.starforce,
    scroll: row.scroll,
    potential: row.potential,
    additionalPotential: row.additional_potential,
    extra: row.extra,
    goal: row.goal,
    purchasePrice: row.purchase_price,
    isHighlighted: row.is_highlighted,
  };
}

function normalizeText(value: string | null | undefined): string | null {
  const normalizedValue = value?.trim() ?? '';
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function getPatchedText(
  patch: TMaplestoryEquipmentStatePatch,
  key:
    | 'itemName'
    | 'bonusOption'
    | 'starforce'
    | 'scroll'
    | 'potential'
    | 'additionalPotential'
    | 'extra'
    | 'goal'
    | 'purchasePrice',
  currentValue: string | null | undefined,
): string | null {
  const value = Object.prototype.hasOwnProperty.call(patch, key) ? patch[key] : currentValue;
  return normalizeText(value);
}

function buildEquipmentStateRow(
  characterId: string,
  slotKey: string,
  currentState: TMaplestoryEquipmentState | null,
  patch: TMaplestoryEquipmentStatePatch,
): TReqUpsertMaplestoryEquipmentStateRow {
  return {
    character_id: characterId,
    slot_key: slotKey,
    item_name: getPatchedText(patch, 'itemName', currentState?.itemName),
    bonus_option: getPatchedText(patch, 'bonusOption', currentState?.bonusOption),
    starforce: getPatchedText(patch, 'starforce', currentState?.starforce),
    scroll: getPatchedText(patch, 'scroll', currentState?.scroll),
    potential: getPatchedText(patch, 'potential', currentState?.potential),
    additional_potential: getPatchedText(
      patch,
      'additionalPotential',
      currentState?.additionalPotential,
    ),
    extra: getPatchedText(patch, 'extra', currentState?.extra),
    goal: getPatchedText(patch, 'goal', currentState?.goal),
    purchase_price: getPatchedText(patch, 'purchasePrice', currentState?.purchasePrice),
    is_highlighted: patch.isHighlighted ?? currentState?.isHighlighted ?? false,
  };
}

function isEmptyEquipmentStateRow(row: TReqUpsertMaplestoryEquipmentStateRow): boolean {
  return (
    row.item_name === null &&
    row.bonus_option === null &&
    row.starforce === null &&
    row.scroll === null &&
    row.potential === null &&
    row.additional_potential === null &&
    row.extra === null &&
    row.goal === null &&
    row.purchase_price === null &&
    !row.is_highlighted
  );
}

export async function getMyCharacters(): Promise<TResMaplestoryMyCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from(MAPLESTORY_MY_CHARACTERS_TABLE)
    .select('id, user_id, nickname, class_name, sort_order, created_at, updated_at')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as TResMaplestoryMyCharacterRow[]).map(mapCharacterRow);
}

export async function addMyCharacter(
  character: TReqCreateMaplestoryMyCharacter,
  sortOrder: number,
): Promise<TResMaplestoryMyCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const row: TReqUpsertMaplestoryMyCharacterRow = {
    user_id: userId,
    nickname: character.nickname,
    class_name: character.className,
    sort_order: sortOrder,
  };
  const { error } = await supabase.from(MAPLESTORY_MY_CHARACTERS_TABLE).insert(row);

  if (error) {
    throw error;
  }

  return getMyCharacters();
}

export async function reorderMyCharacters(
  characters: TResMaplestoryMyCharacter[],
): Promise<TResMaplestoryMyCharacter[]> {
  if (characters.length === 0) {
    return getMyCharacters();
  }

  const supabase = createClient();
  const userId = await getCurrentUserId();
  const rows: TReqUpsertMaplestoryMyCharacterRow[] = characters.map((character, index) => ({
    id: character.id,
    user_id: userId,
    nickname: character.nickname,
    class_name: character.className,
    sort_order: index,
  }));
  const { error } = await supabase.from(MAPLESTORY_MY_CHARACTERS_TABLE).upsert(rows, {
    onConflict: 'id',
  });

  if (error) {
    throw error;
  }

  return getMyCharacters();
}

export async function deleteMyCharacter(id: string): Promise<TResMaplestoryMyCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from(MAPLESTORY_MY_CHARACTERS_TABLE)
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  const remainingCharacters = await getMyCharacters();
  return reorderMyCharacters(remainingCharacters);
}

export async function getUnionCharacters(): Promise<TResMaplestoryUnionCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const [charactersResult, statesResult] = await Promise.all([
    supabase
      .from(MAPLESTORY_UNION_CHARACTERS_TABLE)
      .select('id, class_name, union_effect, link_effect, group_key, default_sort_order'),
    supabase
      .from(MAPLESTORY_UNION_USER_STATES_TABLE)
      .select('user_id, character_id, level, sort_order')
      .eq('user_id', userId),
  ]);

  if (charactersResult.error) {
    throw charactersResult.error;
  }

  if (statesResult.error) {
    throw statesResult.error;
  }

  const states = new Map(
    ((statesResult.data ?? []) as TResMaplestoryUnionUserStateRow[]).map((state) => [
      state.character_id,
      state,
    ]),
  );

  return ((charactersResult.data ?? []) as TResMaplestoryUnionCharacterRow[]).map((character) => {
    const state = states.get(character.id);

    return {
      id: character.id,
      className: character.class_name,
      unionEffect: character.union_effect,
      linkEffect: character.link_effect,
      group: character.group_key,
      level: state?.level ?? null,
      sortOrder: state?.sort_order ?? character.default_sort_order,
    };
  });
}

export async function saveUnionCharacterLevel(
  character: TResMaplestoryUnionCharacter,
): Promise<void> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const row: TReqUpsertMaplestoryUnionUserStateRow = {
    user_id: userId,
    character_id: character.id,
    level: character.level,
    sort_order: character.sortOrder,
  };
  const { error } = await supabase.from(MAPLESTORY_UNION_USER_STATES_TABLE).upsert(row, {
    onConflict: 'user_id,character_id',
  });

  if (error) {
    throw error;
  }
}

export async function reorderUnionCharacters(
  characters: TResMaplestoryUnionCharacter[],
): Promise<void> {
  if (characters.length === 0) return;

  const supabase = createClient();
  const userId = await getCurrentUserId();
  const rows: TReqUpsertMaplestoryUnionUserStateRow[] = characters.map((character, index) => ({
    user_id: userId,
    character_id: character.id,
    level: character.level,
    sort_order: index,
  }));
  const { error } = await supabase.from(MAPLESTORY_UNION_USER_STATES_TABLE).upsert(rows, {
    onConflict: 'user_id,character_id',
  });

  if (error) {
    throw error;
  }
}

export async function getEquipmentStates(
  characterId: string,
): Promise<TMaplestoryEquipmentState[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from(MAPLESTORY_EQUIPMENT_STATES_TABLE)
    .select(MAPLESTORY_EQUIPMENT_STATE_COLUMNS)
    .eq('character_id', characterId)
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as TResMaplestoryEquipmentStateRow[]).map(mapEquipmentStateRow);
}

export async function saveEquipmentState(
  characterId: string,
  slotKey: string,
  patch: TMaplestoryEquipmentStatePatch,
): Promise<TMaplestoryEquipmentState | null> {
  const supabase = createClient();
  const { data: currentData, error: currentError } = await supabase
    .from(MAPLESTORY_EQUIPMENT_STATES_TABLE)
    .select(MAPLESTORY_EQUIPMENT_STATE_COLUMNS)
    .eq('character_id', characterId)
    .eq('slot_key', slotKey)
    .maybeSingle();

  if (currentError) {
    throw currentError;
  }

  const currentState = currentData
    ? mapEquipmentStateRow(currentData as TResMaplestoryEquipmentStateRow)
    : null;
  const row = buildEquipmentStateRow(characterId, slotKey, currentState, patch);

  if (isEmptyEquipmentStateRow(row)) {
    if (currentState !== null) {
      const { error } = await supabase
        .from(MAPLESTORY_EQUIPMENT_STATES_TABLE)
        .delete()
        .eq('id', currentState.id);

      if (error) {
        throw error;
      }
    }

    return null;
  }

  const { data, error } = await supabase
    .from(MAPLESTORY_EQUIPMENT_STATES_TABLE)
    .upsert(row, { onConflict: 'character_id,slot_key' })
    .select(MAPLESTORY_EQUIPMENT_STATE_COLUMNS)
    .single();

  if (error) {
    throw error;
  }

  return mapEquipmentStateRow(data as TResMaplestoryEquipmentStateRow);
}
