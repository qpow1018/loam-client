'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import api from '@/api';
import type {
  TReqCreateLostarkMyCharacter,
  TResLostarkMainCharacter,
  TResLostarkMyCharacter,
} from '@/api/lostark/type';

const MY_CHARACTERS_QUERY_KEY = ['lostark', 'myCharacters'] as const;
const MAIN_CHARACTERS_QUERY_KEY = ['lostark', 'mainCharacters'] as const;

function useMyCharactersMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<TResLostarkMyCharacter[]>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess(characters) {
      queryClient.setQueryData(MY_CHARACTERS_QUERY_KEY, characters);
    },
  });
}

const lostarkQuery = {
  useGetMyCharacters() {
    return useQuery({
      queryKey: MY_CHARACTERS_QUERY_KEY,
      queryFn: api.lostark.getMyCharacters,
    });
  },

  useGetSiblingCharacters(searchNickname: string) {
    return useQuery({
      queryKey: ['lostark', 'siblingCharacters', searchNickname],
      queryFn: () => api.lostark.getSiblingCharacters(searchNickname),
      enabled: searchNickname.length > 0,
    });
  },

  useGetMainCharacters() {
    return useQuery({
      queryKey: MAIN_CHARACTERS_QUERY_KEY,
      queryFn: api.lostark.getMainCharacters,
    });
  },

  useAddMyCharacters() {
    return useMyCharactersMutation(
      (variables: { characters: TReqCreateLostarkMyCharacter[]; startSortOrder: number }) =>
        api.lostark.addMyCharacters(variables.characters, variables.startSortOrder),
    );
  },

  useRefreshMyCharacters() {
    return useMyCharactersMutation(async (characters: TResLostarkMyCharacter[]) => {
      if (characters.length === 0) {
        return characters;
      }

      const siblingCharacters = await api.lostark.getSiblingCharacters(characters[0].nickname);
      const itemLevelByCharacterName = new Map(
        siblingCharacters.data.map((character) => [
          character.CharacterName,
          character.ItemAvgLevel,
        ]),
      );
      const nextCharacters = characters.map((character) => ({
        ...character,
        itemLevel: itemLevelByCharacterName.get(character.nickname) ?? character.itemLevel,
      }));

      return api.lostark.updateMyCharacters(nextCharacters);
    });
  },

  useReorderMyCharacters() {
    return useMyCharactersMutation(api.lostark.reorderMyCharacters);
  },

  useToggleMainCharacter() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: api.lostark.toggleMainCharacter,
      async onSuccess(characters) {
        queryClient.setQueryData(MY_CHARACTERS_QUERY_KEY, characters);
        await queryClient.invalidateQueries({ queryKey: MAIN_CHARACTERS_QUERY_KEY });
      },
    });
  },

  useDeleteMyCharacter() {
    return useMyCharactersMutation(api.lostark.deleteMyCharacter);
  },

  useReorderMainCharacters() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: api.lostark.reorderMainCharacters,
      onSuccess(characters) {
        queryClient.setQueryData(MAIN_CHARACTERS_QUERY_KEY, characters);
      },
    });
  },

  useRefreshMainCharacter() {
    return useMutation({
      async mutationFn(character: TResLostarkMainCharacter) {
        const response = await api.lostark.getCharacterDetails(character.characterName);
        const details = response.data;

        return {
          ...character,
          characterName: details.characterName || character.characterName,
          characterClass: details.characterClass || character.characterClass,
          itemLevel: details.itemLevel || character.itemLevel,
          summary: details.summary,
          rawPayload: details.rawPayload ?? null,
        };
      },
    });
  },

  useSaveMainCharacter() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: api.lostark.saveMainCharacter,
      onSuccess(character) {
        queryClient.setQueryData<TResLostarkMainCharacter[]>(
          MAIN_CHARACTERS_QUERY_KEY,
          (characters = []) =>
            characters.map((item) => (item.id === character.id ? character : item)),
        );
      },
    });
  },
};

export default lostarkQuery;
