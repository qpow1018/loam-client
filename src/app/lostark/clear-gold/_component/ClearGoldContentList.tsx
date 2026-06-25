import type { TClearGoldCategory } from '../_type/clearGold';

import styles from './clearGoldContentList.module.scss';

type TClearGoldContentListProps = {
  categories: readonly TClearGoldCategory[];
  selectedContentId: string;
  onSelectContent: (contentId: string) => void;
};

export default function ClearGoldContentList({
  categories,
  selectedContentId,
  onSelectContent,
}: TClearGoldContentListProps) {
  const contents = categories.flatMap((category) => category.contents);

  return (
    <section className={styles['content-list']} aria-label="클리어 골드 레이드 목록">
      <h1 className={styles['title']}>레이드 선택</h1>

      <div className={styles['content-list-row']}>
        {contents.map((content) => (
          <button
            className={`${styles['content-chip']} ${
              content.id === selectedContentId ? styles['is-selected'] : ''
            }`}
            type="button"
            aria-pressed={content.id === selectedContentId}
            key={content.id}
            onClick={() => onSelectContent(content.id)}
          >
            {content.name}
          </button>
        ))}
      </div>
    </section>
  );
}
