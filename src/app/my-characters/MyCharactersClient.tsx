'use client';

import { useState, useEffect } from 'react';

import type { TMyCharacterInfo } from '@/app/my-characters/_type/myCharacters';
import {
  getMyCharacters,
  addMyCharacter,
  reorderMyCharacters,
  deleteMyCharacter,
} from '@/app/my-characters/_util/myCharacter';

import Button from '@/components/common/button/Button';
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

  function handleSubmitCharacter(nickname: string, classValue: string | null) {
    const trimmed = nickname.trim();
    if (trimmed.length < 2) {
      alert('2글자 이상 입력하세요.');
      return;
    }
    if (characters.some((c) => c.nickname === trimmed)) {
      alert('이미 추가된 캐릭터입니다.');
      return;
    }
    if (classValue === null) {
      alert('클래스를 선택하세요.');
      return;
    }

    addMyCharacter(trimmed, classValue);
    setCharacters(getMyCharacters());
    setIsCreateModalOpen(false);
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
            추가하기
          </Button>
        </div>

        {characters.length === 0 ? (
          <div className={styles['empty']}>
            <p className={styles['empty-message']}>내 캐릭터를 추가하세요.</p>
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
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleSubmitCharacter}
        />
      )}
    </div>
  );
}
