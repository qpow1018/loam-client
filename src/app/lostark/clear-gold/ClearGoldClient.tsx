'use client';

import { useState } from 'react';

import LostarkHeader from '@/components/lostark/header/LostarkHeader';

import ClearGoldContentList from './_component/ClearGoldContentList';
import ClearGoldDetail from './_component/ClearGoldDetail';
import { CLEAR_GOLD_CATEGORIES } from './_define/clearGoldContents';
import type { TClearGoldContent } from './_type/clearGold';

import styles from './clearGoldClient.module.scss';

const CLEAR_GOLD_CONTENTS = CLEAR_GOLD_CATEGORIES.flatMap<TClearGoldContent>(
  (category) => category.contents,
);
const DEFAULT_DIFFICULTY_ID = CLEAR_GOLD_CATEGORIES[0]?.contents[0]?.difficulties[0]?.id ?? '';

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
          categories={CLEAR_GOLD_CATEGORIES}
          selectedDifficultyId={selectedDifficultyId}
          onSelectDifficulty={setSelectedDifficultyId}
        />
        <ClearGoldDetail contentName={selectedContent?.name} difficulty={selectedDifficulty} />
      </main>
    </div>
  );
}
