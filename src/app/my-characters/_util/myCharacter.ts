import { v4 as uuidv4 } from 'uuid';

import { storage, StorageKey } from '@/utils/storage';

import type {
  TCreateMyCharacterInfo,
  TMyCharacterInfo,
} from '@/app/my-characters/_type/myCharacters';

export function getMyCharacters(): TMyCharacterInfo[] {
  return storage.local.get<TMyCharacterInfo[]>(StorageKey.MY_CHARACTER_LIST, []);
}

export function addMyCharacter(character: TCreateMyCharacterInfo): void {
  const myCharacters = getMyCharacters();
  const next: TMyCharacterInfo = { id: uuidv4(), ...character };
  storage.local.set(StorageKey.MY_CHARACTER_LIST, [...myCharacters, next]);
}

export function addMyCharacters(characters: TCreateMyCharacterInfo[]): void {
  const myCharacters = getMyCharacters();
  const nextCharacters = characters.map((character) => ({
    id: uuidv4(),
    ...character,
  }));
  storage.local.set(StorageKey.MY_CHARACTER_LIST, [...myCharacters, ...nextCharacters]);
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
