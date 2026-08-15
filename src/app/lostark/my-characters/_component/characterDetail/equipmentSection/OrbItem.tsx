import type { TLostarkOrb } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';

import EquipmentTooltip from './EquipmentTooltip';

import styles from './orbItem.module.scss';

export default function OrbItem(props: { orb: TLostarkOrb | null }) {
  const { orb } = props;

  if (!orb) return null;

  return (
    <div className={styles['orb-item']}>
      <ItemTooltipTrigger>
        <ItemSlot imageUrl={orb.icon} grade={orb.grade} />
        <ItemTooltip>
          <EquipmentTooltip
            name={orb.name}
            grade={orb.grade}
            details={[
              { label: '상세 이름', value: orb.title },
              { label: '종류', value: orb.type },
              { label: '티어', value: orb.tier },
              { label: '낙원력', value: orb.paradisePowerText },
            ]}
            effectGroups={[
              {
                label: '특수 효과',
                effects: orb.specialEffects.map((text) => ({ text, color: null })),
              },
            ]}
          />
        </ItemTooltip>
      </ItemTooltipTrigger>
      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <p className={styles['item-name']}>보주</p>
        </div>
      </div>
      <div className={styles['item-effect']}>
        <p>{orb.paradisePowerText ?? '낙원력 -'}</p>
      </div>
    </div>
  );
}
