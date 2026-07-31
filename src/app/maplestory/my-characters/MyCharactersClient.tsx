'use client';

import { useEffect, useState } from 'react';

import type {
  TReqCreateMaplestoryMyCharacter,
  TResMaplestoryMyCharacter,
} from '@/api/maplestory/type';
import maplestoryQuery from '@/queries/maplestoryQuery';
import toast from '@/utils/toast';

import Button from '@/components/common/button/Button';
import BoxLoading from '@/components/common/loading/BoxLoading';
import MaplestoryHeader from '@/components/maplestory/header/MaplestoryHeader';
import CharacterList from './_component/CharacterList';
import CreateCharacterModal from './_component/CreateCharacterModal';

import styles from './myCharactersClient.module.scss';

export default function MyCharactersClient() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: characters = [], isLoading, isError } = maplestoryQuery.useGetMyCharacters();
  const addMyCharacter = maplestoryQuery.useAddMyCharacter();
  const reorderMyCharacters = maplestoryQuery.useReorderMyCharacters();
  const deleteMyCharacter = maplestoryQuery.useDeleteMyCharacter();

  useEffect(() => {
    if (isError) {
      toast.error('내 캐릭터 목록을 불러오지 못했습니다.');
    }
  }, [isError]);

  async function handleCreateCharacter(
    character: TReqCreateMaplestoryMyCharacter,
  ): Promise<boolean> {
    try {
      await addMyCharacter.mutateAsync({ character, sortOrder: characters.length });
      setIsCreateModalOpen(false);
      toast.success('캐릭터를 등록했습니다.');
      return true;
    } catch {
      toast.error('캐릭터 등록에 실패했습니다.');
      return false;
    }
  }

  async function handleReorder(nextCharacters: TResMaplestoryMyCharacter[]) {
    try {
      await reorderMyCharacters.mutateAsync(nextCharacters);
    } catch {
      toast.error('캐릭터 순서 변경에 실패했습니다.');
    }
  }

  async function handleDeleteCharacter(id: string) {
    if (deleteMyCharacter.isPending) return;

    try {
      await deleteMyCharacter.mutateAsync(id);
      toast.success('캐릭터를 삭제했습니다.');
    } catch {
      toast.error('캐릭터 삭제에 실패했습니다.');
    }
  }

  return (
    <div className={styles['my-characters-client']}>
      <MaplestoryHeader />

      <div className={styles['my-characters-client-container']}>
        <section className={styles['character-section']}>
          <div className={styles['list-header']}>
            <p className={styles['title']}>내 캐릭터 목록</p>
            <Button onClick={() => setIsCreateModalOpen(true)} color="mint" fill="solid">
              캐릭터 등록
            </Button>
          </div>

          {isLoading && <BoxLoading height={240} />}

          {!isLoading && !isError && characters.length === 0 && (
            <div className={styles['empty']}>
              <p className={styles['empty-message']}>캐릭터를 등록해 주세요.</p>
            </div>
          )}

          {!isLoading && characters.length > 0 && (
            <CharacterList
              characters={characters}
              deletingCharacterId={
                deleteMyCharacter.isPending ? (deleteMyCharacter.variables ?? null) : null
              }
              onReorder={handleReorder}
              onDeleteItem={handleDeleteCharacter}
            />
          )}

          {isCreateModalOpen && (
            <CreateCharacterModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSubmit={handleCreateCharacter}
            />
          )}
        </section>
      </div>
    </div>
  );
}
