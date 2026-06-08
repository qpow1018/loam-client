'use client';

import Header from '@/components/common/header/Header';
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
          <MainCharactersPanel />
        </div>
      </div>
    </div>
  );
}
