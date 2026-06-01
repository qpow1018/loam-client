'use client';

import { useState, useEffect } from 'react';

import type {
  TCreateMyCharacterInfo,
  TMyCharacterInfo,
} from '@/app/my-characters/_type/myCharacters';
import {
  getMyCharacters,
  addMyCharacters,
  reorderMyCharacters,
  deleteMyCharacter,
} from '@/app/my-characters/_util/myCharacter';

import Button from '@/components/common/button/Button';
import toast from '@/utils/toast';
import CharacterList from './_component/CharacterList';
import CreateCharacterModal from './_component/createCharacterModal/CreateCharacterModal';

import styles from './myCharactersClient.module.scss';

export default function MyCharactersClient() {
  const [characters, setCharacters] = useState<TMyCharacterInfo[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  return (
    <div className={styles['my-characters-client']}>
      <section className={styles['character-list-container']}>
        <div className={styles['list-header']}>
          <p className={styles['title']}>내 캐릭터 목록</p>
          <Button onClick={() => setIsCreateModalOpen(true)} theme="bg-pri">
            원정대 불러오기
          </Button>
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
