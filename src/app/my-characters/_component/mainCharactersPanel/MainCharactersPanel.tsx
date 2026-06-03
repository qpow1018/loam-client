'use client';

import { useEffect, useState } from 'react';

import api from '@/api';
import type { TResLostarkMainCharacter } from '@/api/lostark/type';
import toast from '@/utils/toast';

import BoxLoading from '@/components/common/loading/BoxLoading';
import MainCharacterCard from './MainCharacterCard';

import styles from './mainCharactersPanel.module.scss';

export default function MainCharactersPanel() {
  const [isLoading, setIsLoading] = useState(true);
  const [mainCharacters, setMainCharacters] = useState<TResLostarkMainCharacter[]>([]);

  useEffect(() => {
    async function loadMainCharacters() {
      try {
        const response = await api.lostark.getMainCharacters();
        setMainCharacters(response);

        console.log('response', response);
      } catch {
        toast.error('메인 캐릭터 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadMainCharacters();
  }, []);

  return (
    <section className={styles['main-characters-panel']}>
      {isLoading && <BoxLoading height={180} />}

      {!isLoading && mainCharacters.length === 0 && (
        <div className={styles['empty']}>
          <p className={styles['empty-message']}>등록된 메인 캐릭터가 없습니다.</p>
        </div>
      )}

      {!isLoading && mainCharacters.length > 0 && (
        <div className={styles['character-list']}>
          {mainCharacters.map((character) => (
            <MainCharacterCard key={character.id} character={character} />
          ))}
        </div>
      )}
    </section>
  );
}
