import { createClient } from '@/lib/supabase/client';
import supabaseFunctionClient from '@/api/supabaseFunctionClient';

import type {
  TResLostarkMyCharacterRow,
  TResLostarkMyCharacter,
  TReqCreateLostarkMyCharacterRow,
  TReqCreateLostarkMyCharacter,
  TResLostarkSiblingCharacters,
  TResLostarkCharacterDetails,
  TReqUpsertLostarkMainCharacterRow,
  TResLostarkMainCharacterRow,
  TResLostarkMainCharacter,
  TResLostarkCharacterSummary,
} from './type';

const LOSTARK_MY_CHARACTERS_TABLE = 'lostark_my_characters';
const LOSTARK_MAIN_CHARACTERS_TABLE = 'lostark_main_characters';
const LOSTARK_MAIN_CHARACTERS_TEST_TABLE = 'lostark_main_characters_test';

function normalizeCharacterSummary(
  summary: TResLostarkCharacterSummary,
): TResLostarkCharacterSummary {
  return {
    ...summary,
    isExtendedDetailsAvailable:
      summary.isExtendedDetailsAvailable ??
      Boolean(summary.cards && summary.combatSkills && summary.avatars),
    profiles: {
      ...summary.profiles,
      stats: summary.profiles.stats ?? [],
      skillPoints: summary.profiles.skillPoints ?? {
        using: null,
        total: null,
      },
    },
    equipment: {
      ...summary.equipment,
      gears: summary.equipment.gears.map((gear) => ({
        ...gear,
        title: gear.title ?? null,
        tier: gear.tier ?? null,
        basicEffects: gear.basicEffects ?? [],
        additionalEffects: gear.additionalEffects ?? [],
        arkPassiveEffects: gear.arkPassiveEffects ?? [],
      })),
      accessories: summary.equipment.accessories.map((accessory) => ({
        ...accessory,
        title: accessory.title ?? null,
        tier: accessory.tier ?? null,
        basicEffects: accessory.basicEffects ?? [],
        additionalEffects: accessory.additionalEffects ?? [],
        polishEffects: accessory.polishEffects ?? [],
        arkPassiveEffects: accessory.arkPassiveEffects ?? [],
      })),
      bracelet: summary.equipment.bracelet
        ? {
            ...summary.equipment.bracelet,
            title: summary.equipment.bracelet.title ?? null,
            tier: summary.equipment.bracelet.tier ?? null,
            basicEffects: summary.equipment.bracelet.basicEffects ?? [],
            additionalEffects: summary.equipment.bracelet.additionalEffects ?? [],
            braceletEffects: summary.equipment.bracelet.braceletEffects ?? [],
          }
        : null,
      abilityStone: summary.equipment.abilityStone
        ? {
            ...summary.equipment.abilityStone,
            title: summary.equipment.abilityStone.title ?? null,
            tier: summary.equipment.abilityStone.tier ?? null,
            basicEffects: summary.equipment.abilityStone.basicEffects ?? [],
            additionalEffects: summary.equipment.abilityStone.additionalEffects ?? [],
            abilityStoneBonusEffects: summary.equipment.abilityStone.abilityStoneBonusEffects ?? [],
            abilityStoneEngravings: summary.equipment.abilityStone.abilityStoneEngravings ?? [],
          }
        : null,
    },
    avatars: summary.avatars ?? [],
    cards: summary.cards ?? {
      cards: [],
      effects: [],
    },
    combatSkills: summary.combatSkills ?? [],
  };
}

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

// 로그인한 사용자의 메인 캐릭터 목록을 조회한다.
export async function getMainCharacters(): Promise<TResLostarkMainCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from(LOSTARK_MAIN_CHARACTERS_TABLE)
    .select(
      'id, user_id, character_name, character_class, item_level, sort_order, summary, raw_payload, created_at, updated_at',
    )
    .eq('user_id', userId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as TResLostarkMainCharacterRow[]).map((row) => ({
    id: row.id,
    characterName: row.character_name,
    characterClass: row.character_class,
    itemLevel: row.item_level,
    sortOrder: row.sort_order,
    summary: normalizeCharacterSummary(row.summary),
    rawPayload: row.raw_payload,
  }));
}

// 상세 화면 개발에 사용하는 테스트 메인 캐릭터 목록을 조회한다.
export async function getTestMainCharacters(): Promise<TResLostarkMainCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from(LOSTARK_MAIN_CHARACTERS_TEST_TABLE)
    .select(
      'id, user_id, character_name, character_class, item_level, sort_order, summary, raw_payload, created_at, updated_at',
    )
    .eq('user_id', userId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  return ((data ?? []) as TResLostarkMainCharacterRow[]).map((row) => ({
    id: row.id,
    characterName: row.character_name,
    characterClass: row.character_class,
    itemLevel: row.item_level,
    sortOrder: row.sort_order,
    summary: normalizeCharacterSummary(row.summary),
    rawPayload: row.raw_payload,
  }));
}

// 테스트 테이블이 비어 있을 때 운영 메인 캐릭터 데이터를 한 번 복사한다.
export async function initializeTestMainCharacters(): Promise<TResLostarkMainCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const { count, error: countError } = await supabase
    .from(LOSTARK_MAIN_CHARACTERS_TEST_TABLE)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (countError) {
    throw countError;
  }

  if ((count ?? 0) > 0) {
    return getTestMainCharacters();
  }

  const { data, error } = await supabase
    .from(LOSTARK_MAIN_CHARACTERS_TABLE)
    .select('character_name, character_class, item_level, sort_order, summary, raw_payload')
    .eq('user_id', userId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    throw error;
  }

  const rows = (data ?? []).map((row) => ({
    user_id: userId,
    character_name: row.character_name,
    character_class: row.character_class,
    item_level: row.item_level,
    sort_order: row.sort_order,
    summary: row.summary,
    raw_payload: row.raw_payload,
  }));

  if (rows.length === 0) {
    return [];
  }

  const { error: insertError } = await supabase
    .from(LOSTARK_MAIN_CHARACTERS_TEST_TABLE)
    .upsert(rows, { onConflict: 'user_id,character_name' });

  if (insertError) {
    throw insertError;
  }

  return getTestMainCharacters();
}

// 메인 캐릭터의 현재 상세 정보를 저장한다.
export async function saveMainCharacter(
  character: TResLostarkMainCharacter,
): Promise<TResLostarkMainCharacter> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const row: TReqUpsertLostarkMainCharacterRow = {
    user_id: userId,
    character_name: character.characterName,
    character_class: character.characterClass,
    item_level: character.itemLevel,
    sort_order: character.sortOrder,
    summary: normalizeCharacterSummary(character.summary),
    raw_payload: character.rawPayload,
  };

  const { data, error } = await supabase
    .from(LOSTARK_MAIN_CHARACTERS_TABLE)
    .update(row)
    .eq('id', character.id)
    .eq('user_id', userId)
    .select(
      'id, user_id, character_name, character_class, item_level, sort_order, summary, raw_payload, created_at, updated_at',
    )
    .single();

  if (error) {
    throw error;
  }

  const saved = data as TResLostarkMainCharacterRow;

  return {
    id: saved.id,
    characterName: saved.character_name,
    characterClass: saved.character_class,
    itemLevel: saved.item_level,
    sortOrder: saved.sort_order,
    summary: normalizeCharacterSummary(saved.summary),
    rawPayload: saved.raw_payload,
  };
}

// 상세 화면에서 갱신한 메인 캐릭터 정보를 테스트 테이블에만 저장한다.
export async function saveTestMainCharacter(
  character: TResLostarkMainCharacter,
): Promise<TResLostarkMainCharacter> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const row: TReqUpsertLostarkMainCharacterRow = {
    user_id: userId,
    character_name: character.characterName,
    character_class: character.characterClass,
    item_level: character.itemLevel,
    sort_order: character.sortOrder,
    summary: normalizeCharacterSummary(character.summary),
    raw_payload: character.rawPayload,
  };

  const { data, error } = await supabase
    .from(LOSTARK_MAIN_CHARACTERS_TEST_TABLE)
    .update(row)
    .eq('id', character.id)
    .eq('user_id', userId)
    .select(
      'id, user_id, character_name, character_class, item_level, sort_order, summary, raw_payload, created_at, updated_at',
    )
    .single();

  if (error) {
    throw error;
  }

  const saved = data as TResLostarkMainCharacterRow;

  return {
    id: saved.id,
    characterName: saved.character_name,
    characterClass: saved.character_class,
    itemLevel: saved.item_level,
    sortOrder: saved.sort_order,
    summary: normalizeCharacterSummary(saved.summary),
    rawPayload: saved.raw_payload,
  };
}

// 메인 캐릭터 목록의 표시 순서를 저장한다.
export async function reorderMainCharacters(
  characters: TResLostarkMainCharacter[],
): Promise<TResLostarkMainCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const rows: TReqUpsertLostarkMainCharacterRow[] = characters.map((character, index) => ({
    user_id: userId,
    character_name: character.characterName,
    character_class: character.characterClass,
    item_level: character.itemLevel,
    sort_order: index,
    summary: normalizeCharacterSummary(character.summary),
    raw_payload: character.rawPayload,
  }));

  const { error } = await supabase.from(LOSTARK_MAIN_CHARACTERS_TABLE).upsert(rows, {
    onConflict: 'user_id,character_name',
  });

  if (error) {
    throw error;
  }

  return getMainCharacters();
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

async function updateMyCharacterMainStatus(
  id: string,
  isMain: boolean,
): Promise<TResLostarkMyCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from(LOSTARK_MY_CHARACTERS_TABLE)
    .update({ is_main: isMain })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    throw error;
  }

  return getMyCharacters();
}

// 캐릭터를 메인 캐릭터 목록에 등록하고 상세 정보를 저장한다.
export async function registerMainCharacter(
  character: TResLostarkMyCharacter,
): Promise<TResLostarkMyCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const response = await getCharacterDetails(character.nickname);
  const details = response.data;
  const mainCharacters = await getMainCharacters();

  const row: TReqUpsertLostarkMainCharacterRow = {
    user_id: userId,
    character_name: details.characterName || character.nickname,
    character_class: details.characterClass || character.className,
    item_level: details.itemLevel || character.itemLevel,
    sort_order: mainCharacters.length,
    summary: normalizeCharacterSummary(details.summary),
    raw_payload: details.rawPayload ?? null,
  };

  const { error } = await supabase.from(LOSTARK_MAIN_CHARACTERS_TABLE).upsert(row, {
    onConflict: 'user_id,character_name',
  });

  if (error) {
    throw error;
  }

  return updateMyCharacterMainStatus(character.id, true);
}

// 캐릭터를 메인 캐릭터 목록에서 해제한다.
export async function unregisterMainCharacter(
  character: TResLostarkMyCharacter,
): Promise<TResLostarkMyCharacter[]> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from(LOSTARK_MAIN_CHARACTERS_TABLE)
    .delete()
    .eq('user_id', userId)
    .eq('character_name', character.nickname);

  if (error) {
    throw error;
  }

  return updateMyCharacterMainStatus(character.id, false);
}

// 캐릭터의 메인 여부를 토글한다.
export async function toggleMainCharacter(
  character: TResLostarkMyCharacter,
): Promise<TResLostarkMyCharacter[]> {
  if (character.isMain === true) {
    return unregisterMainCharacter(character);
  }

  return registerMainCharacter(character);
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

// Lost Ark API에서 캐릭터 상세 정보를 조회한다.
export async function getCharacterDetails(characterName: string) {
  const response = await supabaseFunctionClient.post<TResLostarkCharacterDetails>(
    '/lostark-character-details',
    {
      characterName,
    },
  );

  return {
    ...response,
    data: {
      ...response.data,
      summary: normalizeCharacterSummary(response.data.summary),
    },
  };
}
