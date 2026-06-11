'use client';

import { useEffect, useState } from 'react';

import api from '@/api';
import type {
  TReqCreateMaplestoryMyCharacter,
  TResMaplestoryMyCharacter,
} from '@/api/maplestory/type';
import toast from '@/utils/toast';

import Button from '@/components/common/button/Button';
import BoxLoading from '@/components/common/loading/BoxLoading';
import MaplestoryHeader from '@/components/maplestory/header/MaplestoryHeader';
import CharacterList from './_component/CharacterList';
import CreateCharacterModal from './_component/CreateCharacterModal';

import styles from './myCharactersClient.module.scss';

export default function MyCharactersClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [characters, setCharacters] = useState<TResMaplestoryMyCharacter[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deletingCharacterId, setDeletingCharacterId] = useState<string | null>(null);

  useEffect(() => {
    async function loadMyCharacters() {
      try {
        const response = await api.maplestory.getMyCharacters();
        setCharacters(response);
      } catch {
        toast.error('내 캐릭터 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    loadMyCharacters();
  }, []);

  async function handleCreateCharacter(
    character: TReqCreateMaplestoryMyCharacter,
  ): Promise<boolean> {
    try {
      const response = await api.maplestory.addMyCharacter(character, characters.length);
      setCharacters(response);
      setIsCreateModalOpen(false);
      toast.success('캐릭터를 등록했습니다.');
      return true;
    } catch {
      toast.error('캐릭터 등록에 실패했습니다.');
      return false;
    }
  }

  async function handleReorder(nextCharacters: TResMaplestoryMyCharacter[]) {
    const previousCharacters = characters;
    setCharacters(nextCharacters);

    try {
      const response = await api.maplestory.reorderMyCharacters(nextCharacters);
      setCharacters(response);
    } catch {
      setCharacters(previousCharacters);
      toast.error('캐릭터 순서 변경에 실패했습니다.');
    }
  }

  async function handleDeleteCharacter(id: string) {
    if (deletingCharacterId !== null) return;

    setDeletingCharacterId(id);

    try {
      const response = await api.maplestory.deleteMyCharacter(id);
      setCharacters(response);
      toast.success('캐릭터를 삭제했습니다.');
    } catch {
      toast.error('캐릭터 삭제에 실패했습니다.');
    } finally {
      setDeletingCharacterId(null);
    }
  }

  return (
    <div className={styles['my-characters-client']}>
      <MaplestoryHeader />

      <div className={styles['my-characters-client-container']}>
        <section className={styles['character-section']}>
          <div className={styles['list-header']}>
            <p className={styles['title']}>내 캐릭터 목록</p>
            <Button onClick={() => setIsCreateModalOpen(true)} theme="bg-pri">
              캐릭터 등록
            </Button>
          </div>

          {isLoading && <BoxLoading height={240} />}

          {!isLoading && characters.length === 0 && (
            <div className={styles['empty']}>
              <p className={styles['empty-message']}>캐릭터를 등록해 주세요.</p>
            </div>
          )}

          {!isLoading && characters.length > 0 && (
            <CharacterList
              characters={characters}
              deletingCharacterId={deletingCharacterId}
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
