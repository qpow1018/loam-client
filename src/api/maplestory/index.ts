import { createClient } from '@/lib/supabase/client';

import type {
  TReqCreateMaplestoryMyCharacter,
  TReqUpsertMaplestoryUnionUserStateRow,
  TReqUpsertMaplestoryMyCharacterRow,
  TResMaplestoryMyCharacter,
  TResMaplestoryMyCharacterRow,
  TResMaplestoryUnionCharacter,
  TResMaplestoryUnionCharacterRow,
  TResMaplestoryUnionUserStateRow,
} from './type';

const MAPLESTORY_MY_CHARACTERS_TABLE = 'maplestory_my_characters';
const MAPLESTORY_UNION_CHARACTERS_TABLE = 'maplestory_union_characters';
const MAPLESTORY_UNION_USER_STATES_TABLE = 'maplestory_union_user_states';

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
