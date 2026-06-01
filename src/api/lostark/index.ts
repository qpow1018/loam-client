import apiRequest from '@/api/apiBase';

import type { TLostarkSiblingCharactersResponse } from './type';

export async function getSiblingCharacters(characterName: string) {
  return apiRequest.post<TLostarkSiblingCharactersResponse>(
    '/lostark-sibling-characters',
    { characterName },
  );
}
