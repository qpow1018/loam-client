import type { TLostarkGear } from '@/api/lostark/type';

import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';
import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';

import ItemDetailTooltip from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/ItemDetailTooltip';

import styles from './gearItem.module.scss';

export default function GearItem(props: { type: string; gear: TLostarkGear | null }) {
  const { type, gear } = props;

  if (!gear) {
    return (
      <div className={styles['gear-item']}>
        <ItemSlot imageUrl={null} />
        <div className={styles['info-box']}>
          <div className={styles['name-box']}>
            <p className={styles['item-name']}>{type}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['gear-item']}>
      <ItemTooltipTrigger>
        <ItemSlot imageUrl={gear.icon} grade={gear.grade} />

        <ItemTooltip>
          <ItemDetailTooltip
            name={gear.name}
            grade={gear.grade}
            details={[
              { label: '강화', value: gear.enhancement !== null ? `+${gear.enhancement}` : null },
              { label: '아이템 레벨', value: gear.itemLevel },
              { label: '품질', value: gear.quality },
            ]}
            effects={[
              ...gear.basicEffects.map((text) => ({ text })),
              ...gear.additionalEffects.map((text) => ({ text })),
              ...gear.arkPassiveEffects.map((text) => ({ text })),
            ]}
          />
        </ItemTooltip>
      </ItemTooltipTrigger>

      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <p className={styles['item-name']}>
            {type}
            {gear.enhancement !== null && ` +${gear.enhancement}`}
          </p>
          {gear.itemLevel && <span className={styles['level-chip']}>{gear.itemLevel}</span>}
        </div>

        <QualityChip quality={gear.quality} />
      </div>
    </div>
  );
}
