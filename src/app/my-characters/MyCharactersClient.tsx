'use client';

import { useState, useEffect } from 'react';

import api from '@/api';
import type {
  TCreateMyCharacterInfo,
  TMyCharacterInfo,
} from '@/app/my-characters/_type/myCharacters';
import {
  getMyCharacters,
  addMyCharacters,
  reorderMyCharacters,
  updateMyCharacters,
  deleteMyCharacter,
} from '@/app/my-characters/_util/myCharacter';

import Button from '@/components/common/button/Button';
import Header from '@/components/common/header/Header';
import toast from '@/utils/toast';
import CharacterList from './_component/CharacterList';
import CreateCharacterModal from './_component/createCharacterModal/CreateCharacterModal';

import styles from './myCharactersClient.module.scss';

export default function MyCharactersClient() {
  const [characters, setCharacters] = useState<TMyCharacterInfo[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCharacters(getMyCharacters());
  }, []);

  function handleReorder(next: TMyCharacterInfo[]) {
    setCharacters(next);
    reorderMyCharacters(next);
  }

  function handleSubmitCharacters(nextCharacters: TCreateMyCharacterInfo[]) {
    if (nextCharacters.length === 0) {
      return;
    }

    addMyCharacters(nextCharacters);
    setCharacters(getMyCharacters());
    setIsCreateModalOpen(false);
    toast.success('캐릭터를 등록했습니다.');
  }

  function handleDeleteCharacter(id: string) {
    deleteMyCharacter(id);
    setCharacters(getMyCharacters());
  }

  async function handleRefreshCharacters() {
    if (characters.length === 0 || isRefreshing) return;

    setIsRefreshing(true);

    try {
      const response = await api.lostark.getSiblingCharacters(characters[0].nickname);
      const itemLevelByCharacterName = new Map(
        response.data.map((character) => [character.CharacterName, character.ItemAvgLevel]),
      );

      const nextCharacters = characters.map((character) => {
        const nextItemLevel = itemLevelByCharacterName.get(character.nickname);
        if (nextItemLevel === undefined) {
          return character;
        }

        return {
          ...character,
          itemLevel: nextItemLevel,
        };
      });

      updateMyCharacters(nextCharacters);
      setCharacters(nextCharacters);
      toast.success('원정대를 갱신했습니다.');
    } catch {
      toast.error('원정대 갱신에 실패했습니다.');
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className={styles['my-characters-client']}>
      <Header />

      <main className={styles['my-characters-client-container']}>
        <section className={styles['character-list-container']}>
          <div className={styles['list-header']}>
            <p className={styles['title']}>내 캐릭터 목록</p>
            <div className={styles['header-actions']}>
              <Button
                onClick={handleRefreshCharacters}
                theme="bg-gray600"
                isLoading={isRefreshing}
                isDisabled={characters.length === 0}
              >
                원정대 갱신
              </Button>
              <Button onClick={() => setIsCreateModalOpen(true)} theme="bg-pri">
                원정대 불러오기
              </Button>
            </div>
          </div>

          {characters.length === 0 ? (
            <div className={styles['empty']}>
              <p className={styles['empty-message']}>원정대 캐릭터를 불러오세요.</p>
            </div>
          ) : (
            <CharacterList
              characters={characters}
              onReorder={handleReorder}
              onDeleteItem={handleDeleteCharacter}
            />
          )}
        </section>
      </main>

      {isCreateModalOpen && (
        <CreateCharacterModal
          isOpen={isCreateModalOpen}
          registeredCharacters={characters}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleSubmitCharacters}
        />
      )}
    </div>
  );
}
