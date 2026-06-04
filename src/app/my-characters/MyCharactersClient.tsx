'use client';

import { useState } from 'react';

import Header from '@/components/common/header/Header';
import Tabs from '@/components/common/tabs/Tabs';
import MainCharactersPanel from './_component/mainCharactersPanel/MainCharactersPanel';
import AllCharactersPanel from './_component/allCharactersPanel/AllCharactersPanel';

import styles from './myCharactersClient.module.scss';

type TMyCharactersTab = 'main' | 'all';

const MY_CHARACTER_TABS = [
  { value: 'main', label: '메인캐릭터' },
  { value: 'all', label: '전체캐릭터' },
] as const;

export default function MyCharactersClient() {
  const [activeTab, setActiveTab] = useState<TMyCharactersTab>('main');

  return (
    <div className={styles['my-characters-client']}>
      <Header />

      <div className={styles['my-characters-client-container']}>
        <Tabs options={MY_CHARACTER_TABS} value={activeTab} onChange={setActiveTab} />

        <div className={styles['character-section']}>
          {activeTab === 'main' && <MainCharactersPanel />}
          {activeTab === 'all' && <AllCharactersPanel />}
        </div>
      </div>
    </div>
  );
}
