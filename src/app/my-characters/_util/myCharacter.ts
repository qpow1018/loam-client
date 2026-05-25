import { v4 as uuidv4 } from 'uuid';

import { storage, StorageKey } from '@/utils/storage';

import type { TMyCharacterInfo } from '@/app/my-characters/_type/myCharacters';

export function getMyCharacters(): TMyCharacterInfo[] {
  return storage.local.get<TMyCharacterInfo[]>(StorageKey.MY_CHARACTER_LIST, []);
}

export function addMyCharacter(nickname: string, classValue: string): void {
  const myCharacters = getMyCharacters();
  const next: TMyCharacterInfo = { id: uuidv4(), nickname, classValue };
  storage.local.set(StorageKey.MY_CHARACTER_LIST, [...myCharacters, next]);
}

export function reorderMyCharacters(characters: TMyCharacterInfo[]): void {
  storage.local.set(StorageKey.MY_CHARACTER_LIST, characters);
}

export function deleteMyCharacter(id: string): void {
  const myCharacters = getMyCharacters();
  storage.local.set(
    StorageKey.MY_CHARACTER_LIST,
    myCharacters.filter((c) => c.id !== id),
  );
}
