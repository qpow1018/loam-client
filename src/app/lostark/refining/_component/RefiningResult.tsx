import type { ReactNode } from 'react';

import { REFINING_MATERIALS } from '@/app/lostark/refining/_define/refiningMaterials';
import type {
  TBookOption,
  TRefiningAction,
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

function isSameAction(left: TRefiningAction, right: TRefiningAction) {
  if (left.breathQuantity !== right.breathQuantity || left.book.kind !== right.book.kind)
    return false;
  if (left.book.kind === 'none' || right.book.kind === 'none') return true;
  return left.book.materialId === right.book.materialId;
}

function formatStrategySummary(plan: TRefiningPlan) {
  const summaries: string[] = [];
  let startIndex = 0;

  while (startIndex < plan.conditionalActions.length) {
    const start = plan.conditionalActions[startIndex];
    const isGuaranteed = start.action.successRate === 10_000;
    let endIndex = startIndex;
    while (
      endIndex + 1 < plan.conditionalActions.length &&
      isSameAction(plan.conditionalActions[endIndex + 1].action, start.action) &&
      (plan.conditionalActions[endIndex + 1].action.successRate === 10_000) === isGuaranteed
    )
      endIndex += 1;

    const attemptRange =
      startIndex === endIndex ? `${startIndex + 1}회차` : `${startIndex + 1}~${endIndex + 1}회차`;
    summaries.push(
      isGuaranteed
        ? `${attemptRange} 장인 100% 확정`
        : `${attemptRange} 숨결 ${start.action.breathQuantity}개 · ${formatBook(start.action.book)}`,
    );
    startIndex = endIndex + 1;
  }

  return summaries.join(' → ');
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
          <div className={styles['metric-primary']}>
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
                <td className={styles['number-cell']}>
                  {formatQuantity(material?.expectedTotalUsed ?? 0)}
                </td>
                <td className={styles['number-cell']}>
                  {formatQuantity(material?.expectedOwnedUsed ?? 0)}
                </td>
                <td className={styles['number-cell']}>
                  {formatQuantity(material?.expectedPurchased ?? 0)}
                </td>
                <td className={`${styles['number-cell']} ${styles['purchase-cost']}`}>
                  {formatGold(material?.expectedGold ?? 0)}
                </td>
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
        <p className={styles['strategy-summary']}>{formatStrategySummary(plan)}</p>
        <ResultTable
          caption="시도 순서별 권장 재련 전략"
          headings={['시도', '숨결', '책', '성공률', '장인의 기운']}
          className={styles['strategy-table']}
        >
          {plan.conditionalActions.map((item, index) => {
            const previous = plan.conditionalActions[index - 1];
            const isActionChanged =
              Boolean(previous) && !isSameAction(previous.action, item.action);
            const isGuaranteed = item.action.successRate === 10_000;
            const rowClassName = [
              styles['strategy-row'],
              isActionChanged && styles['strategy-row--changed'],
              isGuaranteed && styles['strategy-row--guaranteed'],
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <tr key={`${item.failureBonusRate}-${item.artisanEnergy}`} className={rowClassName}>
                <th scope="row">{index + 1}회차</th>
                <td className={styles['number-cell']}>{item.action.breathQuantity}개</td>
                <td>{formatBook(item.action.book)}</td>
                <td className={styles['number-cell']}>
                  {(item.action.successRate / 100).toFixed(2)}%
                </td>
                <td className={styles['number-cell']}>{item.artisanEnergy.toFixed(2)}%</td>
              </tr>
            );
          })}
        </ResultTable>
      </section>
    </div>
  );
}

function ResultTable(props: {
  caption: string;
  headings: readonly string[];
  children: ReactNode;
  className?: string;
}) {
  const { caption, headings, children, className } = props;
  return (
    <div className={[styles['table-scroll'], className].filter(Boolean).join(' ')}>
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
