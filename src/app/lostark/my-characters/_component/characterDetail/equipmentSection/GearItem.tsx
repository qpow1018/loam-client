import type { TLostarkGear } from '@/api/lostark/type';

import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';
import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';

import EquipmentTooltip from './EquipmentTooltip';

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
          <EquipmentTooltip
            name={gear.name}
            grade={gear.grade}
            details={[
              { label: '상세 이름', value: gear.title },
              { label: '종류', value: gear.type },
              { label: '티어', value: gear.tier },
              { label: '강화', value: gear.enhancement !== null ? `+${gear.enhancement}` : null },
              { label: '아이템 레벨', value: gear.itemLevel },
              { label: '품질', value: gear.quality },
            ]}
            effectGroups={[
              {
                label: '기본 효과',
                effects: gear.basicEffects.map((text) => ({ text, color: null })),
              },
              {
                label: '추가 효과',
                effects: gear.additionalEffects.map((text) => ({ text, color: null })),
              },
              {
                label: '아크 패시브 효과',
                effects: gear.arkPassiveEffects.map((text) => ({ text, color: null })),
              },
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
