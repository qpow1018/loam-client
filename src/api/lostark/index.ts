import apiRequest from '@/api/apiBase';

import type { TResLostarkSiblingCharacters } from './type';

export async function getSiblingCharacters(characterName: string) {
  return apiRequest.post<TResLostarkSiblingCharacters>(
    '/lostark-sibling-characters',
    { characterName },
  );
}
