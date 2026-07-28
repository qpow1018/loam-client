import type {
  TMaterialForm,
  TMaterialForms,
  TMaterialInputErrors,
  TMarketMaterialId,
  TRefiningRule,
} from '@/app/lostark/refining/_type/refining';
import { REFINING_MATERIALS } from '@/app/lostark/refining/_define/refiningMaterials';

import styles from '@/app/lostark/refining/_component/refiningMaterialInputPanel.module.scss';

const DEFAULT_MATERIAL_FORM: TMaterialForm = { price: '', owned: '0', isZeroValued: false };

export default function RefiningMaterialInputPanel(props: {
  step: TRefiningRule;
  materials: TMaterialForms;
  materialErrors: TMaterialInputErrors;
  hasErrors: boolean;
  onMaterialChange: (
    id: TMarketMaterialId,
    next: Partial<TMaterialForm>,
    errorField?: 'price' | 'owned',
  ) => void;
}) {
  const { step, materials, materialErrors, hasErrors, onMaterialChange } = props;
  const materialIds = step.inputMaterialIds;

  return (
    <section className={styles['input-panel']} aria-labelledby="refining-input-heading">
      <h2 id="refining-input-heading">재료 단가</h2>
      {hasErrors && (
        <p className={styles['input-error-summary']} role="alert">
          필수 입력값을 확인해 주세요.
        </p>
      )}

      <fieldset className={styles['field-group']}>
        <legend>재료별 입력</legend>
        <p className={styles['field-description']}>
          보유 재료는 입력한 거래소 가격으로 계산합니다. ‘가치 0G 처리’를 선택하면 보유분만 0G로
          계산합니다.
        </p>
        <div className={styles['table-scroll']}>
          <table>
            <caption>재련 재료 단가와 보유 수량</caption>
            <thead>
              <tr>
                <th scope="col">재료</th>
                <th scope="col">거래소 가격</th>
                <th scope="col">보유 수량</th>
                <th scope="col">가치 0G 처리</th>
              </tr>
            </thead>
            <tbody>
              {materialIds.map((id) => {
                const form = materials[id] ?? DEFAULT_MATERIAL_FORM;
                const priceError = materialErrors[id]?.price;
                const ownedError = materialErrors[id]?.owned;
                const priceErrorId = `price-${id}-error`;
                const ownedErrorId = `owned-${id}-error`;
                return (
                  <tr key={id}>
                    <th scope="row">{REFINING_MATERIALS[id].name}</th>
                    <td>
                      <input
                        aria-label={`${REFINING_MATERIALS[id].name} 개당 단가`}
                        aria-describedby={priceError ? priceErrorId : undefined}
                        aria-invalid={Boolean(priceError)}
                        inputMode="decimal"
                        value={form.price}
                        onChange={(event) =>
                          onMaterialChange(id, { price: event.target.value }, 'price')
                        }
                      />
                      {priceError && (
                        <span id={priceErrorId} className={styles['field-error']}>
                          {priceError}
                        </span>
                      )}
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
                          aria-label={`${REFINING_MATERIALS[id].name} 가치 0G 처리`}
                          checked={form.isZeroValued}
                          onChange={(event) =>
                            onMaterialChange(id, { isZeroValued: event.target.checked })
                          }
                        />
                        <span>가치 0G 처리</span>
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </fieldset>
    </section>
  );
}
