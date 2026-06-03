import { createClient } from '@/lib/supabase/client';
import supabaseFunctionClient from '@/api/supabaseFunctionClient';

import type {
  TResLostarkMyCharacterRow,
  TResLostarkMyCharacter,
  TReqCreateLostarkMyCharacterRow,
  TReqCreateLostarkMyCharacter,
  TResLostarkSiblingCharacters,

  // TReqLostarkCharacterDetails,
  // TReqMainCharacterSpecs,
  // TReqSaveMainCharacterSpec,
  // TResLostarkCharacterDetails,
  // TResMainCharacterSpecs,
  // TResSaveMainCharacterSpec,
} from './type';

const LOSTARK_MY_CHARACTERS_TABLE = 'lostark_my_characters';

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

// 로그인한 사용자의 저장된 내 캐릭터 목록을 조회한다.
export async function getMyCharacters(): Promise<TResLostarkMyCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from(LOSTARK_MY_CHARACTERS_TABLE)
    .select('id, user_id, nickname, class_name, item_level, is_main, sort_order')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as TResLostarkMyCharacterRow[]).map((row) => ({
    id: row.id,
    nickname: row.nickname,
    className: row.class_name,
    itemLevel: row.item_level,
    isMain: row.is_main,
  }));
}

// 선택한 원정대 캐릭터들을 내 캐릭터 목록에 추가한다.
export async function addMyCharacters(
  characters: TReqCreateLostarkMyCharacter[],
  startSortOrder: number,
): Promise<TResLostarkMyCharacter[]> {
  if (characters.length === 0) {
    return getMyCharacters();
  }

  const supabase = createClient();
  const userId = await getCurrentUserId();
  const rows: TReqCreateLostarkMyCharacterRow[] = characters.map((character, index) => ({
    user_id: userId,
    nickname: character.nickname,
    class_name: character.className,
    item_level: character.itemLevel,
    is_main: false,
    sort_order: startSortOrder + index,
  }));

  const { error } = await supabase.from(LOSTARK_MY_CHARACTERS_TABLE).insert(rows);

  if (error) {
    throw error;
  }

  return getMyCharacters();
}

// 내 캐릭터 목록의 캐릭터 정보를 일괄 갱신한다.
export async function updateMyCharacters(
  characters: TResLostarkMyCharacter[],
): Promise<TResLostarkMyCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const rows: TReqCreateLostarkMyCharacterRow[] = characters.map((character, index) => ({
    id: character.id,
    user_id: userId,
    nickname: character.nickname,
    class_name: character.className,
    item_level: character.itemLevel,
    is_main: character.isMain === true,
    sort_order: index,
  }));

  const { error } = await supabase.from(LOSTARK_MY_CHARACTERS_TABLE).upsert(rows, {
    onConflict: 'id',
  });

  if (error) {
    throw error;
  }

  return getMyCharacters();
}

// 내 캐릭터 목록의 표시 순서를 저장한다.
export async function reorderMyCharacters(
  characters: TResLostarkMyCharacter[],
): Promise<TResLostarkMyCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const rows: TReqCreateLostarkMyCharacterRow[] = characters.map((character, index) => ({
    id: character.id,
    user_id: userId,
    nickname: character.nickname,
    class_name: character.className,
    item_level: character.itemLevel,
    is_main: character.isMain === true,
    sort_order: index,
  }));

  const { error } = await supabase.from(LOSTARK_MY_CHARACTERS_TABLE).upsert(rows, {
    onConflict: 'id',
  });

  if (error) {
    throw error;
  }

  return getMyCharacters();
}

// 캐릭터의 메인 여부를 토글한다.
export async function toggleMainCharacter(id: string): Promise<TResLostarkMyCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const currentCharacters = await getMyCharacters();
  const target = currentCharacters.find((character) => character.id === id);

  if (!target) {
    throw new Error('Character not found.');
  }

  const { error } = await supabase
    .from(LOSTARK_MY_CHARACTERS_TABLE)
    .update({ is_main: target.isMain !== true })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return getMyCharacters();
}

// 내 캐릭터 목록에서 캐릭터 하나를 삭제한다.
export async function deleteMyCharacter(id: string): Promise<TResLostarkMyCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const { error } = await supabase
    .from(LOSTARK_MY_CHARACTERS_TABLE)
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return getMyCharacters();
}

// 대표 캐릭터명으로 같은 원정대 캐릭터 목록을 조회한다.
export async function getSiblingCharacters(characterName: string) {
  return supabaseFunctionClient.post<TResLostarkSiblingCharacters>('/lostark-sibling-characters', {
    characterName,
  });
}

// // Lost Ark API에서 캐릭터 상세 정보를 조회한다.
// export async function getCharacterDetails(params: TReqLostarkCharacterDetails) {
//   return supabaseFunctionClient.post<TResLostarkCharacterDetails>(
//     '/lostark-character-details',
//     params,
//   );
// }

// // 저장된 메인 캐릭터 상세 스펙 목록을 조회한다.
// export async function getMainCharacterSpecs(params: TReqMainCharacterSpecs) {
//   return supabaseFunctionClient.post<TResMainCharacterSpecs>('/main-character-specs', {
//     action: 'list',
//     ...params,
//   });
// }

// // 메인 캐릭터 상세 스펙을 저장한다.
// export async function saveMainCharacterSpec(params: TReqSaveMainCharacterSpec) {
//   return supabaseFunctionClient.post<TResSaveMainCharacterSpec>('/main-character-specs', {
//     action: 'save',
//     ...params,
//   });
// }
