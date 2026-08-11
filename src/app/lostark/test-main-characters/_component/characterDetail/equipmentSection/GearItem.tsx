import type { TLostarkGear } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import {
  ItemTooltip,
  ItemTooltipTrigger,
} from '@/components/lostark/itemTooltip/ItemTooltip';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';

import ItemDetailTooltip from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/ItemDetailTooltip';

import styles from './gearItem.module.scss';

export default function GearItem(props: { gear: TLostarkGear }) {
  const { gear } = props;

  return (
    <ItemTooltipTrigger className={styles['gear-item']}>
      <ItemSlot imageUrl={gear.icon} grade={gear.grade} />

      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <strong>{`${gear.type ?? '-'}${gear.enhancement !== null ? ` +${gear.enhancement}` : ''}`}</strong>
          {gear.itemLevel && <span className={styles['level-chip']}>{gear.itemLevel}</span>}
        </div>
        <QualityChip quality={gear.quality} />
      </div>

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
  );
}
