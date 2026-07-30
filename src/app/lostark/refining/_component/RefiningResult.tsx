import type { ReactNode } from 'react';

import { REFINING_MATERIALS } from '@/app/lostark/refining/_define/refiningMaterials';
import type {
  TBookOption,
  TRefiningPlan,
  TRefiningRule,
} from '@/app/lostark/refining/_type/refining';

import styles from '@/app/lostark/refining/_component/refiningResult.module.scss';

function formatGold(value: number) {
  return `${Math.round(value).toLocaleString('ko-KR')} G`;
}

function formatQuantity(value: number) {
  return value.toLocaleString('ko-KR', { maximumFractionDigits: 2 });
}

function formatBook(book: TBookOption) {
  return book.kind === 'none' ? '미사용' : REFINING_MATERIALS[book.materialId].name;
}

export default function RefiningResult(props: {
  plan: TRefiningPlan;
  refiningRule: TRefiningRule;
}) {
  const { plan, refiningRule } = props;

  return (
    <div className={styles['result-content']}>
      <section className={styles['cost-section']} aria-labelledby="cost-heading">
        <h3 id="cost-heading">강화 예상 비용</h3>
        <dl className={styles['metric-grid']}>
          <div>
            <dt>기대 비용</dt>
            <dd>{formatGold(plan.expectedGold)}</dd>
          </div>
          <div>
            <dt>기대 시도</dt>
            <dd>{formatQuantity(plan.expectedAttempts)}회</dd>
          </div>
          <div>
            <dt>기대 실링</dt>
            <dd>{formatQuantity(plan.expectedShilling)} 실링</dd>
          </div>
        </dl>
        <div className={styles['guarantee-reference']}>
          <strong>최악 경로 · 장인 100% 확정</strong>
          <dl>
            <div>
              <dt>최대 시도</dt>
              <dd>{plan.recommendedWorstCase.attempts}회</dd>
            </div>
            <div>
              <dt>누적 비용</dt>
              <dd>{formatGold(plan.recommendedWorstCase.gold)}</dd>
            </div>
            <div>
              <dt>누적 실링</dt>
              <dd>{formatQuantity(plan.recommendedWorstCase.shilling)} 실링</dd>
            </div>
          </dl>
        </div>
        <ResultTable
          caption="재료별 기대 사용량과 구매 비용"
          headings={['재료', '총 기대 필요량', '보유 재료 사용량', '기대 구매량', '기대 구매 비용']}
        >
          {refiningRule.inputMaterialIds.map((id) => {
            const material = plan.materialExpectations[id];
            return (
              <tr key={id}>
                <th scope="row">{REFINING_MATERIALS[id].name}</th>
                <td>{formatQuantity(material?.expectedTotalUsed ?? 0)}</td>
                <td>{formatQuantity(material?.expectedOwnedUsed ?? 0)}</td>
                <td>{formatQuantity(material?.expectedPurchased ?? 0)}</td>
                <td>{formatGold(material?.expectedGold ?? 0)}</td>
              </tr>
            );
          })}
        </ResultTable>
        <div className={styles['notice']}>
          <p>보유 재료는 0G · 재료비 제외 재료는 비용에서 제외 · 실링은 골드 최적화에서 제외</p>
          <p>이벤트 미반영</p>
          <p>장인 100% 확정 성공 행은 보조재를 사용하지 않습니다.</p>
        </div>
      </section>
      <section className={styles['strategy-section']} aria-labelledby="strategy-heading">
        <h3 id="strategy-heading">권장 재련 전략</h3>
        <ResultTable
          caption="시도 순서별 권장 재련 전략"
          headings={['시도', '숨결', '책', '성공률', '장인의 기운']}
        >
          {plan.conditionalActions.map((item, index) => (
            <tr key={`${item.failureBonusRate}-${item.artisanEnergy}`}>
              <th scope="row">{index + 1}회차</th>
              <td>{item.action.breathQuantity}개</td>
              <td>{formatBook(item.action.book)}</td>
              <td>{(item.action.successRate / 100).toFixed(2)}%</td>
              <td>{item.artisanEnergy.toFixed(2)}%</td>
            </tr>
          ))}
        </ResultTable>
      </section>
    </div>
  );
}

function ResultTable(props: { caption: string; headings: readonly string[]; children: ReactNode }) {
  const { caption, headings, children } = props;
  return (
    <div className={styles['table-scroll']}>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {headings.map((heading) => (
              <th key={heading} scope="col">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
