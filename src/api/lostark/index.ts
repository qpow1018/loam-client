import apiRequest from '@/api/apiBase';

import type {
  TReqLostarkCharacterSpec,
  TReqMainCharacterSpecs,
  TReqSaveMainCharacterSpec,
  TResLostarkCharacterSpec,
  TResLostarkSiblingCharacters,
  TResMainCharacterSpecs,
  TResSaveMainCharacterSpec,
} from './type';

export async function getSiblingCharacters(characterName: string) {
  return apiRequest.post<TResLostarkSiblingCharacters>('/lostark-sibling-characters', {
    characterName,
  });
}

export async function getCharacterSpec(params: TReqLostarkCharacterSpec) {
  return apiRequest.post<TResLostarkCharacterSpec>('/lostark-character-spec', params);
}

export async function getMainCharacterSpecs(params: TReqMainCharacterSpecs) {
  return apiRequest.post<TResMainCharacterSpecs>('/main-character-specs', {
    action: 'list',
    ...params,
  });
}

export async function saveMainCharacterSpec(params: TReqSaveMainCharacterSpec) {
  return apiRequest.post<TResSaveMainCharacterSpec>('/main-character-specs', {
    action: 'save',
    ...params,
  });
}
