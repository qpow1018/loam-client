import type { TLostarkOrb } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import {
  ItemTooltip,
  ItemTooltipTrigger,
} from '@/components/lostark/itemTooltip/ItemTooltip';

import ItemDetailTooltip from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/ItemDetailTooltip';

import styles from './orbItem.module.scss';

export default function OrbItem(props: { orb: TLostarkOrb | null }) {
  const { orb } = props;

  if (!orb) return null;

  return (
    <ItemTooltipTrigger className={styles['orb-item']}>
      <ItemSlot imageUrl={orb.icon} grade={orb.grade} />
      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <strong>보주</strong>
        </div>
      </div>
      <div className={styles['item-effect']}>
        <p>{orb.paradisePowerText ?? '낙원력 -'}</p>
      </div>

      <ItemTooltip>
        <ItemDetailTooltip
          name={orb.name}
          grade={orb.grade}
          details={[]}
          effects={orb.specialEffects.map((text) => ({ text }))}
        />
      </ItemTooltip>
    </ItemTooltipTrigger>
  );
}
