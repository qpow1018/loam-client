import type { TClearGoldContent } from '../_type/clearGold';

import styles from './clearGoldContentList.module.scss';

type TClearGoldContentListProps = {
  contents: readonly TClearGoldContent[];
  selectedDifficultyId: string;
  onSelectDifficulty: (difficultyId: string) => void;
};

export default function ClearGoldContentList({
  contents,
  selectedDifficultyId,
  onSelectDifficulty,
}: TClearGoldContentListProps) {
  return (
    <aside className={styles['content-list']} aria-label="클리어 골드 콘텐츠 목록">
      <h1 className={styles['title']}>클리어 골드</h1>

      <div className={styles['content-groups']}>
        {contents.map((content) => (
          <section className={styles['content-group']} key={content.id}>
            <h2 className={styles['content-name']}>{content.name}</h2>

            <div className={styles['difficulty-list']}>
              {content.difficulties.map((difficulty) => {
                const isSelected = difficulty.id === selectedDifficultyId;

                return (
                  <button
                    className={`${styles['difficulty-button']} ${
                      isSelected ? styles['is-selected'] : ''
                    }`}
                    type="button"
                    aria-pressed={isSelected}
                    key={difficulty.id}
                    onClick={() => onSelectDifficulty(difficulty.id)}
                  >
                    <span>{difficulty.name}</span>
                    <span className={styles['item-level']}>Lv. {difficulty.entryItemLevel}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
