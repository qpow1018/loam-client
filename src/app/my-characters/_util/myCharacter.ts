import { v4 as uuidv4 } from 'uuid';

import { storage, StorageKey } from '@/utils/storage';

import type { TCreateLostarkMyCharacter, TLostarkMyCharacter } from '@/api/lostark/type';

function normalizeMyCharacter(character: TLostarkMyCharacter): TLostarkMyCharacter {
  return {
    ...character,
    isMain: character.isMain === true,
  };
}

export function getMyCharacters(): TLostarkMyCharacter[] {
  return storage.local
    .get<TLostarkMyCharacter[]>(StorageKey.MY_CHARACTER_LIST, [])
    .map(normalizeMyCharacter);
}

export function addMyCharacter(character: TCreateLostarkMyCharacter): void {
  const myCharacters = getMyCharacters();
  const next: TLostarkMyCharacter = { id: uuidv4(), isMain: false, ...character };
  storage.local.set(StorageKey.MY_CHARACTER_LIST, [...myCharacters, next]);
}

export function addMyCharacters(characters: TCreateLostarkMyCharacter[]): void {
  const myCharacters = getMyCharacters();
  const nextCharacters = characters.map((character) => ({
    id: uuidv4(),
    isMain: false,
    ...character,
  }));
  storage.local.set(StorageKey.MY_CHARACTER_LIST, [...myCharacters, ...nextCharacters]);
}

export function reorderMyCharacters(characters: TLostarkMyCharacter[]): void {
  storage.local.set(StorageKey.MY_CHARACTER_LIST, characters);
}

export function updateMyCharacters(characters: TLostarkMyCharacter[]): void {
  storage.local.set(StorageKey.MY_CHARACTER_LIST, characters);
}

export function deleteMyCharacter(id: string): void {
  const myCharacters = getMyCharacters();
  storage.local.set(
    StorageKey.MY_CHARACTER_LIST,
    myCharacters.filter((c) => c.id !== id),
  );
}

export function toggleMainCharacter(id: string): TLostarkMyCharacter[] {
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
