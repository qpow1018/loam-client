'use client';

import { useState } from 'react';

import type { TClearGoldCategory, TClearGoldContent } from '../_type/clearGold';
import { CLEAR_GOLD_CATEGORIES } from '../_define/clearGoldContents';
import { calculateClearGoldSummary, formatGold } from '../_util/clearGold';

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
      <RaidChipList
        categories={CLEAR_GOLD_CATEGORIES}
        selectedContentId={selectedContentId}
        onSelectContent={setSelectedContentId}
      />
      <RaidGoldDetail content={selectedContent} />
    </section>
  );
}

function RaidChipList(props: {
  categories: readonly TClearGoldCategory[];
  selectedContentId: string;
  onSelectContent: (contentId: string) => void;
}) {
  const contents = props.categories.flatMap<TClearGoldContent>((category) => category.contents);

  return (
    <section className={styles['content-list']} aria-label="클리어 골드 레이드 목록">
      <div className={styles['content-list-row']}>
        {contents.map((content) => (
          <button
            className={`${styles['content-chip']} ${
              content.id === props.selectedContentId ? styles['is-selected'] : ''
            }`}
            type="button"
            aria-pressed={content.id === props.selectedContentId}
            key={content.id}
            onClick={() => props.onSelectContent(content.id)}
          >
            {content.name}
          </button>
        ))}
      </div>
    </section>
  );
}

function RaidGoldDetail(props: { content?: TClearGoldContent }) {
  if (!props.content) {
    return (
      <section className={styles['empty']}>
        <p>확인할 레이드를 선택해 주세요.</p>
      </section>
    );
  }

  const { content } = props;

  return (
    <section className={styles['detail']}>
      <h2 className={styles['content-name']}>{content.name}</h2>

      <div className={styles['difficulty-list']}>
        {content.difficulties.map((difficulty, index) => {
          const summary = calculateClearGoldSummary(difficulty.gates);

          return (
            <details className={styles['difficulty-item']} key={difficulty.id} open={index === 0}>
              <summary className={styles['difficulty-summary']}>
                <div className={styles['summary-item']}>
                  <span>난이도</span>
                  <strong>{difficulty.name}</strong>
                </div>
                <div className={styles['summary-item']}>
                  <span>입장 레벨</span>
                  <strong>Lv. {difficulty.entryItemLevel}</strong>
                </div>
                <div className={`${styles['summary-item']} ${styles['gold-summary']}`}>
                  <span>골드</span>
                  <strong>{formatGold(summary.totalGold)}</strong>
                </div>
              </summary>

              <div className={styles['gate-region']}>
                <table className={styles['gate-table']}>
                  <caption className={styles['caption']}>
                    {content.name} {difficulty.name} 관문별 클리어 골드
                  </caption>
                  <colgroup>
                    <col />
                    <col className={styles['gold-column']} />
                    <col className={styles['gold-column']} />
                    <col className={styles['gold-column']} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th scope="col">관문</th>
                      <th scope="col">일반 골드</th>
                      <th scope="col">귀속 골드</th>
                      <th scope="col">합계</th>
                    </tr>
                  </thead>
                  <tbody>
                    {difficulty.gates.map((gate) => (
                      <tr key={gate.name}>
                        <th scope="row">{gate.name}</th>
                        <td>{formatGold(gate.tradableGold)}</td>
                        <td>{formatGold(gate.boundGold)}</td>
                        <td className={styles['gate-total']}>
                          {formatGold(gate.tradableGold + gate.boundGold)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className={styles['updated-date']}>데이터 기준: {difficulty.updatedAt}</p>
            </details>
          );
        })}
      </div>
    </section>
  );
}
