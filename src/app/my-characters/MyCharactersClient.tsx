'use client';

import { useEffect, useMemo, useState } from 'react';

import type { TMyCharacterInfo } from '@/app/my-characters/_type/myCharacters';
import { getMyCharacters } from '@/app/my-characters/_util/myCharacter';

import Header from '@/components/common/header/Header';
import Tabs from '@/components/common/tabs/Tabs';
import AllCharactersPanel from './_component/allCharactersPanel/AllCharactersPanel';
import MainCharactersPanel from './_component/mainCharactersPanel/MainCharactersPanel';

import styles from './myCharactersClient.module.scss';

type TMyCharactersTab = 'main' | 'all';

const MY_CHARACTER_TABS = [
  { value: 'main', label: '메인캐릭터' },
  { value: 'all', label: '전체캐릭터' },
] as const;

export default function MyCharactersClient() {
  const [characters, setCharacters] = useState<TMyCharacterInfo[]>([]);
  const [activeTab, setActiveTab] = useState<TMyCharactersTab>('main');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCharacters(getMyCharacters());
  }, []);

  // const mainCharacters = useMemo(
  //   () => characters.filter((character) => character.isMain === true),
  //   [characters],
  // );

  return (
    <div className={styles['my-characters-client']}>
      <Header />

      <div className={styles['my-characters-client-container']}>
        <Tabs options={MY_CHARACTER_TABS} value={activeTab} onChange={setActiveTab} />

        <div className={styles['character-list-container']}>
          {activeTab === 'main' && (
            <>
              TODO
              {/* <MainCharactersPanel characters={mainCharacters} /> */}
            </>
          )}

          {activeTab === 'all' && (
            <AllCharactersPanel characters={characters} onCharactersChange={setCharacters} />
          )}
        </div>
      </div>
    </div>
  );
}
