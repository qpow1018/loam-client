import type { TLostarkOrb } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';

import styles from './orbItem.module.scss';

export default function OrbItem(props: { orb: TLostarkOrb | null }) {
  const { orb } = props;

  if (!orb) return null;

  return (
    <div className={styles['orb-item']}>
      <ItemTooltipTrigger>
        <ItemSlot imageUrl={orb.icon} grade={orb.grade} />
        <ItemTooltip>TODO</ItemTooltip>
      </ItemTooltipTrigger>
      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <strong>보주</strong>
        </div>
      </div>
      <div className={styles['item-effect']}>
        <p>{orb.paradisePowerText ?? '낙원력 -'}</p>
      </div>
    </div>
  );
}
