'use client';

import { useEffect, useState } from 'react';

import type { TLostarkManualMetrics, TResLostarkMainCharacter } from '@/api/lostark/type';
import lostarkQuery from '@/queries/lostarkQuery';
import toast from '@/utils/toast';

import Button from '@/components/common/button/Button';
import BoxLoading from '@/components/common/loading/BoxLoading';
import CharacterDetail from './_component/characterDetail/CharacterDetail';
import CharacterSummaryList from './_component/CharacterSummaryList';

import styles from './testMainCharactersClient.module.scss';

type TTestMainCharactersView = 'summary' | 'detail';

export default function TestMainCharactersClient() {
  const [activeView, setActiveView] = useState<TTestMainCharactersView>('summary');
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [draftCharacters, setDraftCharacters] = useState<Record<string, TResLostarkMainCharacter>>(
    {},
  );

  const {
    data: savedCharacters = [],
    isLoading,
    isError,
  } = lostarkQuery.useGetTestMainCharacters();
  const initializeTestMainCharacters = lostarkQuery.useInitializeTestMainCharacters();
  const refreshMainCharacter = lostarkQuery.useRefreshMainCharacter();
  const saveTestMainCharacter = lostarkQuery.useSaveTestMainCharacter();
  const characters = savedCharacters.map((character) => draftCharacters[character.id] ?? character);

  const selectedCharacter =
    characters.find((character) => character.id === selectedCharacterId) ?? characters[0] ?? null;
  const hasUnsavedChanges = selectedCharacter
    ? draftCharacters[selectedCharacter.id] !== undefined
    : false;

  useEffect(() => {
    if (isError) {
      toast.error('테스트 메인 캐릭터 목록을 불러오지 못했습니다.');
    }
  }, [isError]);

  async function handleInitializeTestCharacters() {
    try {
      const initializedCharacters = await initializeTestMainCharacters.mutateAsync();

      if (initializedCharacters.length === 0) {
        toast.error('복사할 운영 메인 캐릭터가 없습니다.');
        return;
      }

      toast.success('운영 데이터를 테스트 테이블로 복사했습니다.');
    } catch {
      toast.error('테스트 데이터를 준비하지 못했습니다.');
    }
  }

  async function handleRefreshCharacter() {
    if (!selectedCharacter || refreshMainCharacter.isPending) return;

    try {
      const refreshedCharacter = await refreshMainCharacter.mutateAsync(selectedCharacter);
      setDraftCharacters((prev) => ({
        ...prev,
        [refreshedCharacter.id]: refreshedCharacter,
      }));
      toast.success('테스트용 최신 정보를 불러왔습니다.');
    } catch {
      toast.error('테스트용 최신 정보를 불러오지 못했습니다.');
    }
  }

  async function handleSaveCharacter() {
    if (!selectedCharacter || !hasUnsavedChanges || saveTestMainCharacter.isPending) return;

    try {
      await saveTestMainCharacter.mutateAsync(selectedCharacter);
      setDraftCharacters((prev) => {
        const next = { ...prev };
        delete next[selectedCharacter.id];
        return next;
      });
      toast.success('테스트 테이블에 저장했습니다.');
    } catch {
      toast.error('테스트 테이블에 저장하지 못했습니다.');
    }
  }

  function handleOpenCharacterDetail(characterId: string) {
    setSelectedCharacterId(characterId);
    setActiveView('detail');
  }

  function handleOpenSummary() {
    setActiveView('summary');
  }

  function handleChangeManualMetrics(manualMetrics: TLostarkManualMetrics) {
    if (!selectedCharacter) return;

    setDraftCharacters((prev) => ({
      ...prev,
      [selectedCharacter.id]: {
        ...selectedCharacter,
        manualMetrics,
      },
    }));
  }

  return (
    <main className={styles['test-main-characters-client']}>
      <MainCharacterNavigation
        characters={characters}
        selectedCharacterId={activeView === 'detail' ? (selectedCharacter?.id ?? null) : null}
        onSelectSummary={handleOpenSummary}
        onSelectCharacter={handleOpenCharacterDetail}
      />

      {isLoading && <BoxLoading height={280} />}

      {!isLoading && !isError && characters.length === 0 && (
        <div className={styles['empty']}>
          <p>테스트 데이터가 없습니다.</p>
          <span>운영 메인 캐릭터를 복사해 별도 공간에서 작업합니다.</span>
          <Button
            color="rose"
            fill="solid"
            size="small"
            isLoading={initializeTestMainCharacters.isPending}
            onClick={() => void handleInitializeTestCharacters()}
          >
            운영 데이터 가져오기
          </Button>
        </div>
      )}

      {!isLoading && characters.length > 0 && activeView === 'summary' && (
        <CharacterSummaryList
          characters={characters}
          onSelectCharacter={handleOpenCharacterDetail}
        />
      )}

      {!isLoading && selectedCharacter && activeView === 'detail' && (
        <CharacterDetail
          selectedCharacter={selectedCharacter}
          isRefreshing={refreshMainCharacter.isPending}
          isSaving={saveTestMainCharacter.isPending}
          isSaveDisabled={!hasUnsavedChanges}
          onRefresh={() => void handleRefreshCharacter()}
          onSave={() => void handleSaveCharacter()}
          onChangeManualMetrics={handleChangeManualMetrics}
        />
      )}
    </main>
  );
}

function MainCharacterNavigation(props: {
  characters: TResLostarkMainCharacter[];
  selectedCharacterId: string | null;
  onSelectSummary: () => void;
  onSelectCharacter: (characterId: string) => void;
}) {
  return (
    <nav className={styles['main-character-navigation']} aria-label="메인 캐릭터 보기">
      <button
        type="button"
        className={`${styles['navigation-button']} ${styles['summary-button']} ${
          props.selectedCharacterId === null ? styles['selected'] : ''
        }`}
        aria-pressed={props.selectedCharacterId === null}
        onClick={props.onSelectSummary}
      >
        <span className={styles['navigation-item-level']}>
          {`${props.characters.length}캐릭터`}
        </span>
        <span className={styles['navigation-item-name']}>요약 목록</span>
      </button>

      <div className={styles['character-list']}>
        {props.characters.map((character) => {
          const profile = character.summary.profiles;
          const isSelected = character.id === props.selectedCharacterId;

          return (
            <button
              key={character.id}
              type="button"
              className={`${styles['navigation-button']} ${isSelected ? styles['selected'] : ''}`}
              aria-pressed={isSelected}
              onClick={() => props.onSelectCharacter(character.id)}
            >
              <span className={styles['navigation-item-level']}>{profile.itemAvgLevel ?? '-'}</span>
              <span className={styles['navigation-item-name']}>{profile.characterName ?? '-'}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
