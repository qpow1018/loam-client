'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';

import api from '@/api';
import type { TCharacterSpec } from '@/api/lostark/type';
import type { TLostarkMyCharacter } from '@/api/lostark/type';
import { getAnonymousClientId } from '@/app/my-characters/_util/anonymousClient';
import {
  isLostarkSpecDebugEnabled,
  logCharacterSpecDebug,
} from '@/app/my-characters/_util/specDebug';
import toast from '@/utils/toast';

import MainCharacterSpecList from '../mainCharacterSpec/MainCharacterSpecList';

function addLoadingName(setter: Dispatch<SetStateAction<Set<string>>>, name: string) {
  setter((current) => new Set(current).add(name));
}

function removeLoadingName(setter: Dispatch<SetStateAction<Set<string>>>, name: string) {
  setter((current) => {
    const next = new Set(current);
    next.delete(name);
    return next;
  });
}

export default function MainCharactersPanel(props: { characters: TLostarkMyCharacter[] }) {
  const [anonymousClientId, setAnonymousClientId] = useState('');
  const [specsByName, setSpecsByName] = useState<Record<string, TCharacterSpec | undefined>>({});
  const [dirtyCharacterNames, setDirtyCharacterNames] = useState<Set<string>>(new Set());
  const [loadingCharacterNames, setLoadingCharacterNames] = useState<Set<string>>(new Set());
  const [savingCharacterNames, setSavingCharacterNames] = useState<Set<string>>(new Set());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnonymousClientId(getAnonymousClientId());
  }, []);

  useEffect(() => {
    if (!anonymousClientId) return;

    if (props.characters.length === 0) {
      return;
    }

    async function loadSpecs() {
      try {
        const response = await api.lostark.getMainCharacterSpecs({
          anonymousClientId,
          characterNames: props.characters.map((character) => character.nickname),
        });

        const specs = response.data;

        for (const spec of specs) {
          logCharacterSpecDebug('db-load', spec);
        }

        setSpecsByName(
          specs.reduce<Record<string, TCharacterSpec | undefined>>((acc, spec) => {
            acc[spec.characterName] = spec;
            return acc;
          }, {}),
        );
      } catch {
        toast.error('저장된 메인캐릭터 스펙을 불러오지 못했습니다.');
      }
    }

    void loadSpecs();
  }, [anonymousClientId, props.characters]);

  async function handleRefreshCharacterSpec(character: TLostarkMyCharacter) {
    addLoadingName(setLoadingCharacterNames, character.nickname);

    try {
      const response = await api.lostark.getCharacterSpec({
        characterName: character.nickname,
        debug: isLostarkSpecDebugEnabled(),
      });

      const spec: TCharacterSpec = {
        ...response.data,
        savedAt: specsByName[character.nickname]?.savedAt ?? null,
        updatedAt: null,
      };

      logCharacterSpecDebug('refresh', spec);

      setSpecsByName((current) => ({ ...current, [character.nickname]: spec }));
      setDirtyCharacterNames((current) => new Set(current).add(character.nickname));
      toast.success('스펙을 갱신했습니다.');
    } catch {
      toast.error('스펙 갱신에 실패했습니다.');
    } finally {
      removeLoadingName(setLoadingCharacterNames, character.nickname);
    }
  }

  async function handleSaveCharacterSpec(character: TLostarkMyCharacter) {
    if (!anonymousClientId) return;

    const spec = specsByName[character.nickname];
    if (!spec) {
      toast.error('저장할 스펙 정보가 없습니다.');
      return;
    }

    addLoadingName(setSavingCharacterNames, character.nickname);

    try {
      const response = await api.lostark.saveMainCharacterSpec({
        anonymousClientId,
        spec,
      });

      setSpecsByName((current) => ({
        ...current,
        [character.nickname]: response.data,
      }));
      logCharacterSpecDebug('save', response.data);
      setDirtyCharacterNames((current) => {
        const next = new Set(current);
        next.delete(character.nickname);
        return next;
      });
      toast.success('스펙을 저장했습니다.');
    } catch {
      toast.error('스펙 저장에 실패했습니다.');
    } finally {
      removeLoadingName(setSavingCharacterNames, character.nickname);
    }
  }

  return (
    <MainCharacterSpecList
      characters={props.characters}
      specsByName={specsByName}
      dirtyCharacterNames={dirtyCharacterNames}
      loadingCharacterNames={loadingCharacterNames}
      savingCharacterNames={savingCharacterNames}
      onRefresh={handleRefreshCharacterSpec}
      onSave={handleSaveCharacterSpec}
    />
  );
}
