'use client';

import { useState } from 'react';

import LostarkHeader from '@/components/lostark/header/LostarkHeader';
import Tabs from '@/components/common/tabs/Tabs';
import ClearGoldPanel from './_component/ClearGoldPanel';
import LevelGoldPanel from './_component/LevelGoldPanel';

import styles from './clearGoldClient.module.scss';

type TClearGoldTab = 'clear-gold' | 'level-gold';

const CLEAR_GOLD_TABS = [
  { value: 'level-gold', label: '레벨별 골드' },
  { value: 'clear-gold', label: '클리어 골드' },
] as const;

export default function ClearGoldClient() {
  const [activeTab, setActiveTab] = useState<TClearGoldTab>('level-gold');

  return (
    <div className={styles['clear-gold-client']}>
      <LostarkHeader />

      <main className={styles['clear-gold-container']}>
        <div className={styles['tab-section']}>
          <Tabs<TClearGoldTab>
            options={CLEAR_GOLD_TABS}
            value={activeTab}
            onChange={(next) => setActiveTab(next)}
          />
        </div>

        {activeTab === 'level-gold' && <LevelGoldPanel />}
        {activeTab === 'clear-gold' && <ClearGoldPanel />}
      </main>
    </div>
  );
}
