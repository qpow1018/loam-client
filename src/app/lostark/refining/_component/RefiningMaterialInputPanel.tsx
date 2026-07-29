import type {
  TRefiningMaterialInput,
  TRefiningMaterialInputs,
  TRefiningMaterialId,
} from '@/app/lostark/refining/_type/refining';
import { REFINING_MATERIALS } from '@/app/lostark/refining/_define/refiningMaterials';

import Button from '@/components/common/button/Button';

import styles from '@/app/lostark/refining/_component/refiningMaterialInputPanel.module.scss';

export default function RefiningMaterialInputPanel(props: {
  visibleMaterialIds: readonly TRefiningMaterialId[];
  marketPrices: Readonly<Record<TRefiningMaterialId, number>>;
  materials: TRefiningMaterialInputs;
  onMaterialChange: (id: TRefiningMaterialId, next: Partial<TRefiningMaterialInput>) => void;
}) {
  const { visibleMaterialIds, marketPrices, materials, onMaterialChange } = props;

  return (
    <section className={styles['input-panel']} aria-label="재련 재료">
      <div className={styles['action-row']}>
        <Button theme="bd-gray" size="small" isDisabled>
          시세 새로고침
        </Button>
      </div>

      <div className={styles['material-list']}>
        {visibleMaterialIds.map((id) => {
          const form = materials[id];
          if (!form) return null;

          return (
            <RefiningMaterialRow
              key={id}
              id={id}
              form={form}
              marketPrice={marketPrices[id]}
              onMaterialChange={onMaterialChange}
            />
          );
        })}
      </div>
    </section>
  );
}

function RefiningMaterialRow(props: {
  id: TRefiningMaterialId;
  form: TRefiningMaterialInput;
  marketPrice: number;
  onMaterialChange: (id: TRefiningMaterialId, next: Partial<TRefiningMaterialInput>) => void;
}) {
  const { id, form, marketPrice, onMaterialChange } = props;

  const material = REFINING_MATERIALS[id];

  return (
    <div className={styles['material-row']}>
      <div className={styles['material-header']}>
        <div className={styles['image-box']}>
          <img src={material.imageUrl} alt="" />
        </div>
        <p className={styles['name']}>{material.name}</p>
        <span className={styles['market-price']}>
          {marketPrice.toLocaleString('ko-KR', { maximumFractionDigits: 3 })} G
        </span>
      </div>

      <div className={styles['material-controls']}>
        <label className={styles['owned-field']}>
          <span>보유 수량</span>
          <span className={styles['quantity-input']}>
            <input
              aria-label={`${material.name} 보유 수량`}
              inputMode="numeric"
              min="0"
              value={form.owned}
              onChange={(event) => onMaterialChange(id, { owned: event.target.value })}
            />
            <span aria-hidden="true">개</span>
          </span>
        </label>

        <label className={styles['zero-price-field']}>
          <input
            type="checkbox"
            aria-label={`${material.name} 가격 0G 처리`}
            checked={form.isZeroPriced}
            onChange={(event) => onMaterialChange(id, { isZeroPriced: event.target.checked })}
          />
          <span>가격 0G 처리</span>
        </label>
      </div>
    </div>
  );
}
