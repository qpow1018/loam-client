'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import api from '@/api';
import type { TReqCreateLostarkMyCharacter, TResLostarkMyCharacter } from '@/api/lostark/type';

const MY_CHARACTERS_QUERY_KEY = ['lostark', 'myCharacters'] as const;

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
    return useMyCharactersMutation(api.lostark.toggleMainCharacter);
  },

  useDeleteMyCharacter() {
    return useMyCharactersMutation(api.lostark.deleteMyCharacter);
  },
};

export default lostarkQuery;
