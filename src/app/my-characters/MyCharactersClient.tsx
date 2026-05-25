'use client';

import { useState, useEffect } from 'react';

import { getMyCharacters, addMyCharacter } from '@/app/my-characters/_util/myCharacter';
import type { TMyCharacterInfo } from '@/app/my-characters/_type/myCharacters';

import Header from '@/components/common/header/Header';
import CharacterList from './_component/characterList/CharacterList';
import CreateCharacterModal from './_component/createCharacterModal/CreateCharacterModal';

import styles from './myCharactersClient.module.scss';

export default function MyCharactersClient() {
  const [characterList, setCharacterList] = useState<TMyCharacterInfo[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    setCharacterList(getMyCharacters());
  }, []);

  function handleSubmitCharacter(nickname: string, classValue: string | null) {
    try {
      const trimmed = nickname.trim();
      if (trimmed.length < 2) throw new Error('2글자 이상 입력하세요.');
      if (characterList.some((c) => c.nickname === trimmed)) {
        throw new Error('이미 추가된 캐릭터입니다.');
      }
      if (classValue === null) throw new Error('클래스를 선택하세요.');

      addMyCharacter(trimmed, classValue);
      setCharacterList(getMyCharacters());
      setIsCreateModalOpen(false);
    } catch (error: any) {
      alert(error.message);
    }
  }

  // TODO
  function handleMoveCharacter(_id: string) {
    alert('순서 변경');
  }

  // TODO
  function handleDeleteCharacter(_id: string) {
    alert('삭제');
  }

  return (
    <>
      <Header />

      <div className={styles['my-characters-client']}>
        <CharacterList
          characters={characterList}
          onClickAdd={() => setIsCreateModalOpen(true)}
          onClickItemMove={handleMoveCharacter}
          onClickItemDelete={handleDeleteCharacter}
        />

        {isCreateModalOpen && (
          <CreateCharacterModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleSubmitCharacter}
          />
        )}
      </div>
    </>
  );
}
