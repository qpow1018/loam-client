import type { TClearGoldDifficulty } from '../_type/clearGold';
import { calculateClearGoldSummary, formatGold } from '../_util/clearGold';

import styles from './clearGoldDetail.module.scss';

type TClearGoldDetailProps = {
  contentName?: string;
  difficulty?: TClearGoldDifficulty;
};

export default function ClearGoldDetail({ contentName, difficulty }: TClearGoldDetailProps) {
  if (!contentName || !difficulty) {
    return (
      <section className={styles['empty']}>
        <p>확인할 콘텐츠와 난이도를 선택해 주세요.</p>
      </section>
    );
  }

  const summary = calculateClearGoldSummary(difficulty.gates);

  return (
    <section className={styles['detail']}>
      <header className={styles['detail-header']}>
        <div>
          <p className={styles['content-name']}>{contentName}</p>
          <h1>{difficulty.name}</h1>
        </div>
        <span className={styles['item-level']}>입장 Lv. {difficulty.entryItemLevel}</span>
      </header>

      <ul className={styles['summary-list']}>
        <li>
          <span>일반 골드</span>
          <strong>{formatGold(summary.tradableGold)}</strong>
        </li>
        <li>
          <span>귀속 골드</span>
          <strong>{formatGold(summary.boundGold)}</strong>
        </li>
        <li>
          <span>총 획득 골드</span>
          <strong>{formatGold(summary.totalGold)}</strong>
        </li>
      </ul>

      <div className={styles['gate-region']}>
        <table className={styles['gate-table']}>
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
    </section>
  );
}
