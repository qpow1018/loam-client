import type { TLostarkAccessory } from '@/api/lostark/type';

import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';
import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';
import EffectItem from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/EffectItem';

import styles from './accessoryItem.module.scss';

export default function AccessoryItem(props: { accessory: TLostarkAccessory }) {
  const { accessory } = props;

  return (
    <div className={styles['accessory-item']}>
      <ItemTooltipTrigger>
        <ItemSlot imageUrl={accessory.icon} grade={accessory.grade} />
        <ItemTooltip>TODO</ItemTooltip>
      </ItemTooltipTrigger>

      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <p className={styles['item-name']}>{accessory.type ?? '-'}</p>
        </div>
        <QualityChip quality={accessory.quality} />
      </div>

      <div className={styles['effect-list']}>
        {accessory.polishEffects.map((effect, index) => (
          <EffectItem key={`${effect.text}-${index}`} effect={effect} />
        ))}
      </div>
    </div>
  );
}
