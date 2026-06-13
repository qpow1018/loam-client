'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import api from '@/api';
import type {
  TMaplestoryEquipmentState,
  TMaplestoryEquipmentStatePatch,
  TReqCreateMaplestoryMyCharacter,
  TResMaplestoryMyCharacter,
  TResMaplestoryUnionCharacter,
} from '@/api/maplestory/type';

const MY_CHARACTERS_QUERY_KEY = ['maplestory', 'myCharacters'] as const;
const UNION_CHARACTERS_QUERY_KEY = ['maplestory', 'unionCharacters'] as const;

function getEquipmentStatesQueryKey(characterId: string | null) {
  return ['maplestory', 'equipmentStates', characterId] as const;
}

function replaceEquipmentState(
  states: TMaplestoryEquipmentState[],
  slotKey: string,
  nextState: TMaplestoryEquipmentState | null,
) {
  const nextStates = states.filter((state) => state.slotKey !== slotKey);
  return nextState === null ? nextStates : [...nextStates, nextState];
}

function createOptimisticEquipmentState(
  characterId: string,
  slotKey: string,
  state: TMaplestoryEquipmentState | undefined,
  isHighlighted: boolean,
): TMaplestoryEquipmentState {
  return {
    id: state?.id ?? '',
    characterId,
    slotKey,
    itemName: state?.itemName ?? null,
    bonusOption: state?.bonusOption ?? null,
    starforce: state?.starforce ?? null,
    scroll: state?.scroll ?? null,
    potential: state?.potential ?? null,
    additionalPotential: state?.additionalPotential ?? null,
    extra: state?.extra ?? null,
    goal: state?.goal ?? null,
    purchasePrice: state?.purchasePrice ?? null,
    isHighlighted,
  };
}

function useMyCharactersMutation<TVariables>(
  mutationFn: (variables: TVariables) => Promise<TResMaplestoryMyCharacter[]>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess(characters) {
      queryClient.setQueryData(MY_CHARACTERS_QUERY_KEY, characters);
    },
  });
}

const maplestoryQuery = {
  useGetMyCharacters() {
    return useQuery({
      queryKey: MY_CHARACTERS_QUERY_KEY,
      queryFn: api.maplestory.getMyCharacters,
    });
  },

  useAddMyCharacter() {
    return useMyCharactersMutation(
      (variables: { character: TReqCreateMaplestoryMyCharacter; sortOrder: number }) =>
        api.maplestory.addMyCharacter(variables.character, variables.sortOrder),
    );
  },

  useReorderMyCharacters() {
    return useMyCharactersMutation(api.maplestory.reorderMyCharacters);
  },

  useDeleteMyCharacter() {
    return useMyCharactersMutation(api.maplestory.deleteMyCharacter);
  },

  useGetUnionCharacters() {
    return useQuery({
      queryKey: UNION_CHARACTERS_QUERY_KEY,
      queryFn: api.maplestory.getUnionCharacters,
    });
  },

  useSaveUnionCharacterLevel() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: api.maplestory.saveUnionCharacterLevel,
      async onMutate(character) {
        await queryClient.cancelQueries({ queryKey: UNION_CHARACTERS_QUERY_KEY });
        const previousCharacter = queryClient
          .getQueryData<TResMaplestoryUnionCharacter[]>(UNION_CHARACTERS_QUERY_KEY)
          ?.find((item) => item.id === character.id);
        queryClient.setQueryData<TResMaplestoryUnionCharacter[]>(
          UNION_CHARACTERS_QUERY_KEY,
          (characters = []) =>
            characters.map((item) => (item.id === character.id ? character : item)),
        );

        return { previousCharacter };
      },
      onError(_error, character, context) {
        const previousCharacter = context?.previousCharacter;
        if (previousCharacter === undefined) return;

        queryClient.setQueryData<TResMaplestoryUnionCharacter[]>(
          UNION_CHARACTERS_QUERY_KEY,
          (characters = []) =>
            characters.map((item) => (item.id === character.id ? previousCharacter : item)),
        );
      },
    });
  },

  useReorderUnionCharacters() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: api.maplestory.reorderUnionCharacters,
      async onMutate(reorderedCharacters) {
        await queryClient.cancelQueries({ queryKey: UNION_CHARACTERS_QUERY_KEY });
        const reorderedIds = new Set(reorderedCharacters.map((character) => character.id));
        const previousCharacters = (
          queryClient.getQueryData<TResMaplestoryUnionCharacter[]>(UNION_CHARACTERS_QUERY_KEY) ?? []
        ).filter((character) => reorderedIds.has(character.id));
        const nextOrderById = new Map(
          reorderedCharacters.map((character, index) => [character.id, index]),
        );
        queryClient.setQueryData<TResMaplestoryUnionCharacter[]>(
          UNION_CHARACTERS_QUERY_KEY,
          (characters = []) =>
            characters.map((character) => ({
              ...character,
              sortOrder: nextOrderById.get(character.id) ?? character.sortOrder,
            })),
        );

        return { previousCharacters };
      },
      onError(_error, _characters, context) {
        if (context === undefined) return;

        const previousCharacterById = new Map(
          context.previousCharacters.map((character) => [character.id, character]),
        );
        queryClient.setQueryData<TResMaplestoryUnionCharacter[]>(
          UNION_CHARACTERS_QUERY_KEY,
          (characters = []) =>
            characters.map((character) => previousCharacterById.get(character.id) ?? character),
        );
      },
    });
  },

  useGetEquipmentStates(characterId: string | null) {
    return useQuery({
      queryKey: getEquipmentStatesQueryKey(characterId),
      queryFn: () => api.maplestory.getEquipmentStates(characterId!),
      enabled: characterId !== null,
    });
  },

  useSaveEquipmentState() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (variables: {
        characterId: string;
        slotKey: string;
        patch: TMaplestoryEquipmentStatePatch;
      }) =>
        api.maplestory.saveEquipmentState(
          variables.characterId,
          variables.slotKey,
          variables.patch,
        ),
      onSuccess(state, variables) {
        queryClient.setQueryData<TMaplestoryEquipmentState[]>(
          getEquipmentStatesQueryKey(variables.characterId),
          (states = []) => replaceEquipmentState(states, variables.slotKey, state),
        );
      },
    });
  },

  useToggleEquipmentHighlight() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (variables: { characterId: string; slotKey: string; isHighlighted: boolean }) =>
        api.maplestory.saveEquipmentState(variables.characterId, variables.slotKey, {
          isHighlighted: variables.isHighlighted,
        }),
      async onMutate(variables) {
        const queryKey = getEquipmentStatesQueryKey(variables.characterId);
        await queryClient.cancelQueries({ queryKey });
        const previousState = queryClient
          .getQueryData<TMaplestoryEquipmentState[]>(queryKey)
          ?.find((state) => state.slotKey === variables.slotKey);
        const optimisticState = createOptimisticEquipmentState(
          variables.characterId,
          variables.slotKey,
          previousState,
          variables.isHighlighted,
        );
        queryClient.setQueryData<TMaplestoryEquipmentState[]>(queryKey, (states = []) =>
          replaceEquipmentState(states, variables.slotKey, optimisticState),
        );

        return { previousState };
      },
      onSuccess(state, variables) {
        queryClient.setQueryData<TMaplestoryEquipmentState[]>(
          getEquipmentStatesQueryKey(variables.characterId),
          (states = []) => replaceEquipmentState(states, variables.slotKey, state),
        );
      },
      onError(_error, variables, context) {
        queryClient.setQueryData<TMaplestoryEquipmentState[]>(
          getEquipmentStatesQueryKey(variables.characterId),
          (states = []) =>
            replaceEquipmentState(states, variables.slotKey, context?.previousState ?? null),
        );
      },
    });
  },
};

export default maplestoryQuery;
