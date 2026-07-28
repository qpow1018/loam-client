import type {
  TRefiningMaterialInput,
  TRefiningMaterialInputs,
  TMaterialInputErrors,
  TRefiningMaterialId,
  TRefiningRule,
} from '@/app/lostark/refining/_type/refining';
import { REFINING_MATERIALS } from '@/app/lostark/refining/_define/refiningMaterials';

import styles from '@/app/lostark/refining/_component/refiningMaterialInputPanel.module.scss';

export default function RefiningMaterialInputPanel(props: {
  rule: TRefiningRule;
  marketPrices: Readonly<Record<TRefiningMaterialId, number>>;
  materials: TRefiningMaterialInputs;
  materialErrors: TMaterialInputErrors;
  hasErrors: boolean;
  onMaterialChange: (
    id: TRefiningMaterialId,
    next: Partial<TRefiningMaterialInput>,
    errorField?: 'owned',
  ) => void;
}) {
  const { rule, marketPrices, materials, materialErrors, hasErrors, onMaterialChange } = props;

  return (
    <section className={styles['input-panel']} aria-labelledby="refining-input-heading">
      <h2 id="refining-input-heading">재련 재료</h2>
      {hasErrors && (
        <p className={styles['input-error-summary']} role="alert">
          필수 입력값을 확인해 주세요.
        </p>
      )}

      <p className={styles['field-description']}>
        재료 가격을 0G로 처리하면 보유 수량과 관계없이 비용에서 제외됩니다.
      </p>
      <table>
        <caption>재련 재료 단가와 보유 수량</caption>
        <thead>
          <tr>
            <th scope="col">재료</th>
            <th scope="col">단가</th>
            <th scope="col">보유</th>
            <th scope="col">가격 0G</th>
          </tr>
        </thead>
        <tbody>
          {rule.inputMaterialIds.map((id) => {
            const form = materials[id];
            if (!form) return null;
            const ownedError = materialErrors[id]?.owned;
            const ownedErrorId = `owned-${id}-error`;
            return (
              <tr key={id}>
                <th scope="row">{REFINING_MATERIALS[id].name}</th>
                <td className={styles['market-price']}>
                  {marketPrices[id].toLocaleString('ko-KR', { maximumFractionDigits: 3 })} G
                </td>
                <td>
                  <input
                    aria-label={`${REFINING_MATERIALS[id].name} 보유 수량`}
                    aria-describedby={ownedError ? ownedErrorId : undefined}
                    aria-invalid={Boolean(ownedError)}
                    inputMode="numeric"
                    min="0"
                    value={form.owned}
                    onChange={(event) =>
                      onMaterialChange(id, { owned: event.target.value }, 'owned')
                    }
                  />
                  {ownedError && (
                    <span id={ownedErrorId} className={styles['field-error']}>
                      {ownedError}
                    </span>
                  )}
                </td>
                <td>
                  <label className={styles['check-label']}>
                    <input
                      type="checkbox"
                      aria-label={`${REFINING_MATERIALS[id].name} 가격 0G 처리`}
                      checked={form.isZeroPriced}
                      onChange={(event) =>
                        onMaterialChange(id, { isZeroPriced: event.target.checked })
                      }
                    />
                    <span>가격 0G 처리</span>
                  </label>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
