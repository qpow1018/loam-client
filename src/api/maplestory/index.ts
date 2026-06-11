import { createClient } from '@/lib/supabase/client';

import type {
  TReqCreateMaplestoryMyCharacter,
  TReqUpsertMaplestoryMyCharacterRow,
  TResMaplestoryMyCharacter,
  TResMaplestoryMyCharacterRow,
} from './type';

const MAPLESTORY_MY_CHARACTERS_TABLE = 'maplestory_my_characters';

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
