'use client';

import { useEffect, useState } from 'react';

import api from '@/api';
import type { TResLostarkMainCharacter } from '@/api/lostark/type';
import BoxLoading from '@/components/common/loading/BoxLoading';
// import type { TLostarkMyCharacter } from '@/api/lostark/type';
import toast from '@/utils/toast';

// import MainCharacterSpecList from '../mainCharacterSpec/MainCharacterSpecList';
import styles from './mainCharactersPanel.module.scss';

export default function MainCharactersPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [mainCharacters, setMainCharacters] = useState<TResLostarkMainCharacter[]>([]);

  // const [anonymousClientId, setAnonymousClientId] = useState('');
  // const [specsByName, setSpecsByName] = useState<Record<string, TCharacterSpec | undefined>>({});
  // const [dirtyCharacterNames, setDirtyCharacterNames] = useState<Set<string>>(new Set());
  // const [loadingCharacterNames, setLoadingCharacterNames] = useState<Set<string>>(new Set());
  // const [savingCharacterNames, setSavingCharacterNames] = useState<Set<string>>(new Set());

  // useEffect(() => {
  //   // eslint-disable-next-line react-hooks/set-state-in-effect
  //   setAnonymousClientId(getAnonymousClientId());
  // }, []);

  // useEffect(() => {
  //   if (!anonymousClientId) return;

  //   if (props.characters.length === 0) {
  //     return;
  //   }

  //   async function loadSpecs() {
  //     try {
  //       const response = await api.lostark.getMainCharacterSpecs({
  //         anonymousClientId,
  //         characterNames: props.characters.map((character) => character.nickname),
  //       });

  //       const specs = response.data;

  //       for (const spec of specs) {
  //         logCharacterSpecDebug('db-load', spec);
  //       }

  //       setSpecsByName(
  //         specs.reduce<Record<string, TCharacterSpec | undefined>>((acc, spec) => {
  //           acc[spec.characterName] = spec;
  //           return acc;
  //         }, {}),
  //       );
  //     } catch {
  //       toast.error('저장된 메인캐릭터 스펙을 불러오지 못했습니다.');
  //     }
  //   }

  //   void loadSpecs();
  // }, [anonymousClientId, props.characters]);

  // async function handleRefreshCharacterSpec(character: TLostarkMyCharacter) {
  //   addLoadingName(setLoadingCharacterNames, character.nickname);

  //   try {
  //     const response = await api.lostark.getCharacterDetails({
  //       characterName: character.nickname,
  //       debug: isLostarkSpecDebugEnabled(),
  //     });

  //     const spec: TCharacterSpec = {
  //       ...response.data,
  //       savedAt: specsByName[character.nickname]?.savedAt ?? null,
  //       updatedAt: null,
  //     };

  //     logCharacterSpecDebug('refresh', spec);

  //     setSpecsByName((current) => ({ ...current, [character.nickname]: spec }));
  //     setDirtyCharacterNames((current) => new Set(current).add(character.nickname));
  //     toast.success('스펙을 갱신했습니다.');
  //   } catch {
  //     toast.error('스펙 갱신에 실패했습니다.');
  //   } finally {
  //     removeLoadingName(setLoadingCharacterNames, character.nickname);
  //   }
  // }

  // async function handleSaveCharacterSpec(character: TLostarkMyCharacter) {
  //   if (!anonymousClientId) return;

  //   const spec = specsByName[character.nickname];
  //   if (!spec) {
  //     toast.error('저장할 스펙 정보가 없습니다.');
  //     return;
  //   }

  //   addLoadingName(setSavingCharacterNames, character.nickname);

  //   try {
  //     const response = await api.lostark.saveMainCharacterSpec({
  //       anonymousClientId,
  //       spec,
  //     });

  //     setSpecsByName((current) => ({
  //       ...current,
  //       [character.nickname]: response.data,
  //     }));
  //     logCharacterSpecDebug('save', response.data);
  //     setDirtyCharacterNames((current) => {
  //       const next = new Set(current);
  //       next.delete(character.nickname);
  //       return next;
  //     });
  //     toast.success('스펙을 저장했습니다.');
  //   } catch {
  //     toast.error('스펙 저장에 실패했습니다.');
  //   } finally {
  //     removeLoadingName(setSavingCharacterNames, character.nickname);
  //   }
  // }

  useEffect(() => {
    async function loadMainCharacters() {
      try {
        const response = await api.lostark.getMainCharacters();
        setMainCharacters(response);
      } catch {
        toast.error('메인 캐릭터 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadMainCharacters();
  }, []);

  return (
    <section className={styles['main-characters-panel']}>
      <div className={styles['list-header']}>
        <p className={styles['title']}>메인 캐릭터 목록</p>
      </div>

      {isLoading && <BoxLoading height={180} />}

      {!isLoading && mainCharacters.length === 0 && (
        <div className={styles['empty']}>
          <p className={styles['empty-message']}>등록된 메인 캐릭터가 없습니다.</p>
        </div>
      )}

      {!isLoading && mainCharacters.length > 0 && (
        <ul className={styles['character-list']}>
          {mainCharacters.map((character) => (
            <li key={character.id} className={styles['character-item']}>
              <p className={styles['character-name']}>{character.characterName}</p>
              <p className={styles['character-meta']}>
                {character.characterClass} · {character.itemLevel}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
