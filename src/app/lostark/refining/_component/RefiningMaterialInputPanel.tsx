import Button from '@/components/common/button/Button';

import { MATERIAL_NAMES } from '@/app/lostark/refining/_define/refiningMaterials';
import type {
  TMaterialForm,
  TMaterialForms,
  TMaterialInputErrors,
  TMarketMaterialId,
} from '@/app/lostark/refining/_type/refining';
import styles from '@/app/lostark/refining/_component/refiningMaterialInputPanel.module.scss';

const DEFAULT_MATERIAL_FORM: TMaterialForm = { price: '', owned: '0', isValuedAtMarket: false };

export default function RefiningMaterialInputPanel(props: {
  materialIds: readonly TMarketMaterialId[];
  materials: TMaterialForms;
  materialErrors: TMaterialInputErrors;
  hasErrors: boolean;
  isCalculating: boolean;
  onMaterialChange: (
    id: TMarketMaterialId,
    next: Partial<TMaterialForm>,
    errorField?: 'price' | 'owned',
  ) => void;
  onCalculate: () => void;
}) {
  const {
    materialIds,
    materials,
    materialErrors,
    hasErrors,
    isCalculating,
    onMaterialChange,
    onCalculate,
  } = props;

  return (
    <section className={styles['input-panel']} aria-labelledby="refining-input-heading">
      <h2 id="refining-input-heading">조건과 재료 단가</h2>
      {hasErrors && (
        <p className={styles['input-error-summary']} role="alert">
          필수 입력값을 확인해 주세요.
        </p>
      )}

      <fieldset className={styles['field-group']}>
        <legend>재료별 입력</legend>
        <p className={styles['field-description']}>
          보유분은 기본 0G이며, ‘시장가 반영’을 선택하면 입력 단가로 계산합니다.
        </p>
        <div className={styles['table-scroll']}>
          <table>
            <caption>재련 재료 단가와 보유 수량</caption>
            <thead>
              <tr>
                <th scope="col">재료</th>
                <th scope="col">개당 G</th>
                <th scope="col">보유 수량</th>
                <th scope="col">시장가 반영</th>
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
                    <th scope="row">{MATERIAL_NAMES[id]}</th>
                    <td>
                      <input
                        aria-label={`${MATERIAL_NAMES[id]} 개당 단가`}
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
                        aria-label={`${MATERIAL_NAMES[id]} 보유 수량`}
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
                          aria-label={`${MATERIAL_NAMES[id]} 보유분 시장가 반영`}
                          checked={form.isValuedAtMarket}
                          onChange={(event) =>
                            onMaterialChange(id, { isValuedAtMarket: event.target.checked })
                          }
                        />
                        <span>시장가 반영</span>
                      </label>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </fieldset>
      <Button theme="bg-pri" size="large" isLoading={isCalculating} onClick={onCalculate}>
        {isCalculating ? '계산 중' : '계산하기'}
      </Button>
    </section>
  );
}
