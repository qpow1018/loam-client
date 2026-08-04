'use client';

import { useEffect, useState } from 'react';

import type { TResLostarkMainCharacter } from '@/api/lostark/type';
import lostarkQuery from '@/queries/lostarkQuery';
import toast from '@/utils/toast';

import BoxLoading from '@/components/common/loading/BoxLoading';
import CharacterDetail from './_component/CharacterDetail';
import CharacterSummaryList from './_component/CharacterSummaryList';

import styles from './testMainCharactersClient.module.scss';

type TTestMainCharactersView = 'summary' | 'detail';

export default function TestMainCharactersClient() {
  const [activeView, setActiveView] = useState<TTestMainCharactersView>('summary');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const { data: characters = [], isLoading, isError } = lostarkQuery.useGetMainCharacters();

  const selectedCharacter =
    characters.find((character) => character.id === selectedCharacterId) ?? characters[0] ?? null;

  useEffect(() => {
    if (isError) toast.error('메인 캐릭터 목록을 불러오지 못했습니다.');
  }, [isError]);

  function handleOpenCharacterDetail(characterId: string) {
    setSelectedCharacterId(characterId);
    setActiveView('detail');
  }

  function handleOpenSummary() {
    setActiveView('summary');
  }

  return (
    <div className={styles['test-main-characters-client']}>
      <MainCharacterNavigation
        characters={characters}
        isSummarySelected={activeView === 'summary'}
        selectedCharacterId={selectedCharacter?.id ?? null}
        onSelectSummary={handleOpenSummary}
        onSelectCharacter={handleOpenCharacterDetail}
      />

      <main className={styles['content']}>
        <section className={styles['panel']}>
          {isLoading && <BoxLoading height={280} />}

          {!isLoading && !isError && characters.length === 0 && (
            <div className={styles['empty']}>
              <p>등록된 메인 캐릭터가 없습니다.</p>
              <span>기존 메인캐릭터 페이지에서 캐릭터를 등록해 주세요.</span>
            </div>
          )}

          {!isLoading && characters.length > 0 && activeView === 'summary' && (
            <CharacterSummaryList
              characters={characters}
              onSelectCharacter={handleOpenCharacterDetail}
            />
          )}

          {!isLoading && selectedCharacter && activeView === 'detail' && (
            <CharacterDetail selectedCharacter={selectedCharacter} />
          )}
        </section>
      </main>
    </div>
  );
}

function MainCharacterNavigation(props: {
  characters: TResLostarkMainCharacter[];
  isSummarySelected: boolean;
  selectedCharacterId: string | null;
  onSelectSummary: () => void;
  onSelectCharacter: (characterId: string) => void;
}) {
  return (
    <nav className={styles['main-character-navigation']} aria-label="메인 캐릭터 보기">
      <button
        type="button"
        className={`${styles['summary-button']} ${
          props.isSummarySelected ? styles['selected'] : ''
        }`}
        aria-pressed={props.isSummarySelected}
        onClick={props.onSelectSummary}
      >
        전체보기
      </button>

      <div className={styles['character-list']}>
        {props.characters.map((character) => {
          const profile = character.summary.profiles;
          const isSelected =
            !props.isSummarySelected && character.id === props.selectedCharacterId;

          return (
            <button
              key={character.id}
              type="button"
              className={`${styles['character-button']} ${isSelected ? styles['selected'] : ''}`}
              aria-pressed={isSelected}
              onClick={() => props.onSelectCharacter(character.id)}
            >
              <span className={styles['portrait']}>
                {profile.characterImage && <img src={profile.characterImage} alt="" />}
              </span>
              <span className={styles['character-copy']}>
                <strong>{profile.characterName ?? '-'}</strong>
                <small>{profile.itemAvgLevel ?? '-'}</small>
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
