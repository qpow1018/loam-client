import type { TClearGoldContent } from '../_type/clearGold';
import { calculateClearGoldSummary, formatGold } from '../_util/clearGold';

import styles from './clearGoldDetail.module.scss';

type TClearGoldDetailProps = {
  content?: TClearGoldContent;
};

export default function ClearGoldDetail({ content }: TClearGoldDetailProps) {
  if (!content) {
    return (
      <section className={styles['empty']}>
        <p>확인할 레이드를 선택해 주세요.</p>
      </section>
    );
  }

  return (
    <section className={styles['detail']}>
      {content.difficulties.map((difficulty) => {
        const summary = calculateClearGoldSummary(difficulty.gates);

        return (
          <article className={styles['difficulty-card']} key={difficulty.id}>
            <header className={styles['detail-header']}>
              <div className={styles['summary-item']}>
                <span>이름</span>
                <strong>{content.name}</strong>
              </div>
              <div className={styles['summary-item']}>
                <span>클리어 골드</span>
                <strong>{formatGold(summary.totalGold)}</strong>
              </div>
              <div className={styles['summary-item']}>
                <span>난이도</span>
                <strong>{difficulty.name}</strong>
              </div>
              <div className={styles['summary-item']}>
                <span>입장 레벨</span>
                <strong>Lv. {difficulty.entryItemLevel}</strong>
              </div>
            </header>

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
          </article>
        );
      })}
    </section>
  );
}
