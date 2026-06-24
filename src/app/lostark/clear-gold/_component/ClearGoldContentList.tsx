import type { TClearGoldCategory } from '../_type/clearGold';

import styles from './clearGoldContentList.module.scss';

type TClearGoldContentListProps = {
  categories: readonly TClearGoldCategory[];
  selectedDifficultyId: string;
  onSelectDifficulty: (difficultyId: string) => void;
};

export default function ClearGoldContentList({
  categories,
  selectedDifficultyId,
  onSelectDifficulty,
}: TClearGoldContentListProps) {
  return (
    <aside className={styles['content-list']} aria-label="클리어 골드 콘텐츠 목록">
      <h1 className={styles['title']}>클리어 골드</h1>

      <div className={styles['category-groups']}>
        {categories.map((category) => (
          <section className={styles['category-group']} key={category.id}>
            <h2 className={styles['category-name']}>{category.name}</h2>

            <div className={styles['content-groups']}>
              {category.contents.map((content) => (
                <section className={styles['content-group']} key={content.id}>
                  <h3 className={styles['content-name']}>{content.name}</h3>

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
                          <span className={styles['item-level']}>
                            Lv. {difficulty.entryItemLevel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
