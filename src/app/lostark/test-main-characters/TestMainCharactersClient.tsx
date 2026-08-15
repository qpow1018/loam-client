'use client';

import { useEffect, useState } from 'react';

import type { TResLostarkMainCharacter } from '@/api/lostark/type';
import lostarkQuery from '@/queries/lostarkQuery';
import toast from '@/utils/toast';

import Button from '@/components/common/button/Button';
import BoxLoading from '@/components/common/loading/BoxLoading';
import CharacterDetail from './_component/characterDetail/CharacterDetail';
import CharacterSummaryList from './_component/characterSummaryList/CharacterSummaryList';
import MainCharacterOrderModal from './_component/mainCharacterOrder/MainCharacterOrderModal';

import styles from './testMainCharactersClient.module.scss';

export default function TestMainCharactersClient() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const { data: characters = [], isLoading, isError } = lostarkQuery.useGetMainCharacters();
  const reorderMainCharacters = lostarkQuery.useReorderMainCharacters();

  useEffect(() => {
    if (isError) {
      toast.error('메인 캐릭터 목록을 불러오지 못했습니다.');
    }
  }, [isError]);

  function handleOpenCharacterDetail(characterId: string) {
    setSelectedCharacterId(characterId);
  }

  function handleOpenSummary() {
    setSelectedCharacterId(null);
  }

  async function handleSubmitMainCharacterOrder(nextCharacters: TResLostarkMainCharacter[]) {
    try {
      await reorderMainCharacters.mutateAsync(nextCharacters);
      setIsOrderModalOpen(false);
      toast.success('메인 캐릭터 순서를 저장했습니다.');
    } catch {
      toast.error('메인 캐릭터 순서를 저장하지 못했습니다.');
    }
  }

  return (
    <main className={styles['test-main-characters-client']}>
      <MainCharacterNavigation
        characters={characters}
        selectedCharacterId={selectedCharacterId}
        onSelectSummary={handleOpenSummary}
        onSelectCharacter={handleOpenCharacterDetail}
        onOpenOrder={() => setIsOrderModalOpen(true)}
        isOrderDisabled={isLoading || characters.length < 2}
      />

      {isLoading && <BoxLoading height={280} />}

      {!isLoading && !isError && characters.length === 0 && (
        <div className={styles['empty']}>
          <p>등록된 메인 캐릭터가 없습니다.</p>
          <span>내 캐릭터 관리에서 메인 캐릭터를 등록해주세요.</span>
        </div>
      )}

      {!isLoading && characters.length > 0 && selectedCharacterId === null && (
        <CharacterSummaryList
          characters={characters}
          onSelectCharacter={handleOpenCharacterDetail}
        />
      )}

      {!isLoading && selectedCharacterId !== null && (
        <CharacterDetail key={selectedCharacterId} characterId={selectedCharacterId} />
      )}

      {isOrderModalOpen && (
        <MainCharacterOrderModal
          isOpen={isOrderModalOpen}
          isSaving={reorderMainCharacters.isPending}
          characters={characters}
          onClose={() => setIsOrderModalOpen(false)}
          onSubmit={handleSubmitMainCharacterOrder}
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
  onOpenOrder: () => void;
  isOrderDisabled: boolean;
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

      <Button
        color="gray"
        fill="solid"
        size="small"
        className={styles['order-button']}
        onClick={props.onOpenOrder}
        isDisabled={props.isOrderDisabled}
      >
        순서 변경
      </Button>
    </nav>
  );
}
