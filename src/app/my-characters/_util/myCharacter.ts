import { v4 as uuidv4 } from 'uuid';

import { storage, StorageKey } from '@/utils/storage';

import type {
  TCreateMyCharacterInfo,
  TMyCharacterInfo,
} from '@/app/my-characters/_type/myCharacters';

function normalizeMyCharacter(character: TMyCharacterInfo): TMyCharacterInfo {
  return {
    ...character,
    isMain: character.isMain === true,
  };
}

export function getMyCharacters(): TMyCharacterInfo[] {
  return storage.local
    .get<TMyCharacterInfo[]>(StorageKey.MY_CHARACTER_LIST, [])
    .map(normalizeMyCharacter);
}

export function addMyCharacter(character: TCreateMyCharacterInfo): void {
  const myCharacters = getMyCharacters();
  const next: TMyCharacterInfo = { id: uuidv4(), isMain: false, ...character };
  storage.local.set(StorageKey.MY_CHARACTER_LIST, [...myCharacters, next]);
}

export function addMyCharacters(characters: TCreateMyCharacterInfo[]): void {
  const myCharacters = getMyCharacters();
  const nextCharacters = characters.map((character) => ({
    id: uuidv4(),
    isMain: false,
    ...character,
  }));
  storage.local.set(StorageKey.MY_CHARACTER_LIST, [...myCharacters, ...nextCharacters]);
}

export function reorderMyCharacters(characters: TMyCharacterInfo[]): void {
  storage.local.set(StorageKey.MY_CHARACTER_LIST, characters);
}

export function updateMyCharacters(characters: TMyCharacterInfo[]): void {
  storage.local.set(StorageKey.MY_CHARACTER_LIST, characters);
}

export function deleteMyCharacter(id: string): void {
  const myCharacters = getMyCharacters();
  storage.local.set(
    StorageKey.MY_CHARACTER_LIST,
    myCharacters.filter((c) => c.id !== id),
  );
}

export function toggleMainCharacter(id: string): TMyCharacterInfo[] {
  const nextCharacters = getMyCharacters().map((character) => {
    if (character.id !== id) {
      return character;
    }

    return {
      ...character,
      isMain: character.isMain !== true,
    };
  });

  updateMyCharacters(nextCharacters);
  return nextCharacters;
}
