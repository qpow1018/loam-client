'use client';

import { useState } from 'react';

import type { TClearGoldContent } from '../_type/clearGold';
import { CLEAR_GOLD_CATEGORIES } from '../_define/clearGoldContents';
import ClearGoldContentList from './ClearGoldContentList';
import ClearGoldDetail from './ClearGoldDetail';

import styles from './clearGoldPanel.module.scss';

const CLEAR_GOLD_CONTENTS = CLEAR_GOLD_CATEGORIES.flatMap<TClearGoldContent>(
  (category) => category.contents,
);
const DEFAULT_CONTENT_ID = CLEAR_GOLD_CATEGORIES[0]?.contents[0]?.id ?? '';

export default function ClearGoldPanel() {
  const [selectedContentId, setSelectedContentId] = useState<string>(DEFAULT_CONTENT_ID);
  const selectedContent = CLEAR_GOLD_CONTENTS.find((content) => content.id === selectedContentId);

  return (
    <section className={styles['clear-gold-panel']}>
      <ClearGoldContentList
        categories={CLEAR_GOLD_CATEGORIES}
        selectedContentId={selectedContentId}
        onSelectContent={setSelectedContentId}
      />
      <ClearGoldDetail content={selectedContent} />
    </section>
  );
}
