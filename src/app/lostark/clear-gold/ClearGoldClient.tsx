'use client';

import { useState } from 'react';

import LostarkHeader from '@/components/lostark/header/LostarkHeader';

import ClearGoldContentList from './_component/ClearGoldContentList';
import ClearGoldDetail from './_component/ClearGoldDetail';
import { CLEAR_GOLD_CONTENTS } from './_define/clearGoldContents';

import styles from './clearGoldClient.module.scss';

const DEFAULT_DIFFICULTY_ID = CLEAR_GOLD_CONTENTS[0]?.difficulties[0]?.id ?? '';

export default function ClearGoldClient() {
  const [selectedDifficultyId, setSelectedDifficultyId] = useState<string>(DEFAULT_DIFFICULTY_ID);
  const selectedContent = CLEAR_GOLD_CONTENTS.find((content) =>
    content.difficulties.some((difficulty) => difficulty.id === selectedDifficultyId),
  );
  const selectedDifficulty = selectedContent?.difficulties.find(
    (difficulty) => difficulty.id === selectedDifficultyId,
  );

  return (
    <div className={styles['clear-gold-client']}>
      <LostarkHeader />
      <main className={styles['clear-gold-container']}>
        <ClearGoldContentList
          contents={CLEAR_GOLD_CONTENTS}
          selectedDifficultyId={selectedDifficultyId}
          onSelectDifficulty={setSelectedDifficultyId}
        />
        <ClearGoldDetail contentName={selectedContent?.name} difficulty={selectedDifficulty} />
      </main>
    </div>
  );
}
