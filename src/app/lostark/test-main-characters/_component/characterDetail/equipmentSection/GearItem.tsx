import type { TLostarkGear } from '@/api/lostark/type';

import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';
import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';

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

        <ItemTooltip>TODO</ItemTooltip>
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
