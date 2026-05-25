import { v4 as uuidv4 } from 'uuid';

import { storage, StorageKey } from '@/utils/storage';

import type { TMyCharacterInfo } from '@/app/my-characters/_type/myCharacter';

export function getMyCharacters(): TMyCharacterInfo[] {
  return storage.local.get<TMyCharacterInfo[]>(StorageKey.MY_CHARACTER_LIST, []);
}

export function addMyCharacter(nickname: string, classValue: string): void {
  const myCharacters = getMyCharacters();
  const next: TMyCharacterInfo = { id: uuidv4(), nickname, classValue };
  storage.local.set(StorageKey.MY_CHARACTER_LIST, [...myCharacters, next]);
}
