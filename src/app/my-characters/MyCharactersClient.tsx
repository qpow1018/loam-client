'use client';

import { useEffect, useState } from 'react';

import api from '@/api';
import type { TResLostarkMainCharacter } from '@/api/lostark/type';
import toast from '@/utils/toast';

import Header from '@/components/common/header/Header';
import BoxLoading from '@/components/common/loading/BoxLoading';
import Tabs from '@/components/common/tabs/Tabs';
import MainCharactersPanel from './_component/mainCharactersPanel/MainCharactersPanel';

import styles from './myCharactersClient.module.scss';

type TMyCharactersTab = 'main';

const MY_CHARACTER_TABS = [
  { value: 'main', label: '메인캐릭터' },
] as const;

function handleTabChange(_next: TMyCharactersTab) {
  return undefined;
}

export default function MyCharactersClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [mainCharacters, setMainCharacters] = useState<TResLostarkMainCharacter[]>([]);

  useEffect(() => {
    async function loadMainCharacters() {
      try {
        const response = await api.lostark.getMainCharacters();
        setMainCharacters(response);
      } catch {
        toast.error('메인 캐릭터 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadMainCharacters();
  }, []);

  return (
    <div className={styles['my-characters-client']}>
      <Header />

      <div className={styles['my-characters-client-container']}>
        <Tabs<TMyCharactersTab>
          options={MY_CHARACTER_TABS}
          value="main"
          onChange={handleTabChange}
        />

        <div className={styles['character-section']}>
          {isLoading && <BoxLoading height={180} />}

          {!isLoading && mainCharacters.length === 0 && (
            <div className={styles['empty']}>
              <p className={styles['empty-message']}>등록된 메인 캐릭터가 없습니다.</p>
            </div>
          )}

          {!isLoading && mainCharacters.length > 0 && (
            <MainCharactersPanel
              characters={mainCharacters}
              onChangeCharacters={setMainCharacters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
