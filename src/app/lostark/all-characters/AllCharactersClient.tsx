'use client';

import { useEffect, useState } from 'react';

import type { TReqCreateLostarkMyCharacter, TResLostarkMyCharacter } from '@/api/lostark/type';
import lostarkQuery from '@/queries/lostarkQuery';
import toast from '@/utils/toast';

import Button from '@/components/common/button/Button';
import BoxLoading from '@/components/common/loading/BoxLoading';
import LostarkHeader from '@/components/lostark/header/LostarkHeader';
import CharacterList from './_component/CharacterList';
import CreateCharacterModal from './_component/CreateCharacterModal';

import styles from './allCharactersClient.module.scss';

export default function AllCharactersClient() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: allCharacters = [], isLoading, isError } = lostarkQuery.useGetMyCharacters();
  const addMyCharacters = lostarkQuery.useAddMyCharacters();
  const refreshMyCharacters = lostarkQuery.useRefreshMyCharacters();
  const reorderMyCharacters = lostarkQuery.useReorderMyCharacters();
  const toggleMainCharacter = lostarkQuery.useToggleMainCharacter();
  const deleteMyCharacter = lostarkQuery.useDeleteMyCharacter();

  useEffect(() => {
    if (isError) {
      toast.error('내 캐릭터 목록을 불러오지 못했습니다.');
    }
  }, [isError]);

  async function handleSubmitCharacters(nextCharacters: TReqCreateLostarkMyCharacter[]) {
    if (nextCharacters.length === 0) {
      return;
    }

    try {
      await addMyCharacters.mutateAsync({
        characters: nextCharacters,
        startSortOrder: allCharacters.length,
      });
      setIsCreateModalOpen(false);
      toast.success('캐릭터를 등록했습니다.');
    } catch {
      toast.error('캐릭터 등록에 실패했습니다.');
    }
  }

  async function handleRefreshCharacters() {
    if (allCharacters.length === 0 || refreshMyCharacters.isPending) return;

    try {
      await refreshMyCharacters.mutateAsync(allCharacters);
      toast.success('원정대를 갱신했습니다.');
    } catch {
      toast.error('원정대 갱신에 실패했습니다.');
    }
  }

  async function handleReorder(next: TResLostarkMyCharacter[]) {
    try {
      await reorderMyCharacters.mutateAsync(next);
    } catch {
      toast.error('캐릭터 순서 변경에 실패했습니다.');
    }
  }

  async function handleToggleMainCharacter(character: TResLostarkMyCharacter) {
    if (toggleMainCharacter.isPending) return;

    try {
      await toggleMainCharacter.mutateAsync(character);

      toast.success(
        character.isMain === true ? '메인 캐릭터를 해제했습니다.' : '메인 캐릭터를 등록했습니다.',
      );
    } catch {
      toast.error('메인 캐릭터 변경에 실패했습니다.');
    }
  }

  async function handleDeleteCharacter(id: string) {
    try {
      await deleteMyCharacter.mutateAsync(id);
      toast.success('캐릭터를 삭제했습니다.');
    } catch {
      toast.error('캐릭터 삭제에 실패했습니다.');
    }
  }

  return (
    <div className={styles['all-characters-client']}>
      <LostarkHeader />

      <div className={styles['all-characters-client-container']}>
        <section className={styles['character-section']}>
          <div className={styles['list-header']}>
            <p className={styles['title']}>내 캐릭터 목록</p>
            <div className={styles['header-actions']}>
              <Button
                onClick={handleRefreshCharacters}
                color="gray"
                fill="solid"
                isLoading={refreshMyCharacters.isPending}
                isDisabled={allCharacters.length === 0}
              >
                원정대 갱신
              </Button>

              <Button onClick={() => setIsCreateModalOpen(true)} color="mint" fill="solid">
                원정대 불러오기
              </Button>
            </div>
          </div>

          {isLoading && <BoxLoading height={240} />}

          {!isLoading && !isError && allCharacters.length === 0 && (
            <div className={styles['empty']}>
              <p className={styles['empty-message']}>원정대 캐릭터를 불러오세요.</p>
            </div>
          )}

          {!isLoading && allCharacters.length > 0 && (
            <CharacterList
              characters={allCharacters}
              togglingMainCharacterId={toggleMainCharacter.variables?.id}
              onReorder={handleReorder}
              onToggleMain={handleToggleMainCharacter}
              onDeleteItem={handleDeleteCharacter}
            />
          )}

          {isCreateModalOpen && (
            <CreateCharacterModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              registeredCharacters={allCharacters}
              onSubmit={handleSubmitCharacters}
            />
          )}
        </section>
      </div>
    </div>
  );
}
