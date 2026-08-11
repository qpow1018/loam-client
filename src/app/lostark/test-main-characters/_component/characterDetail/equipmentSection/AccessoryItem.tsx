import type { TLostarkAccessory } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import {
  ItemTooltip,
  ItemTooltipTrigger,
} from '@/components/lostark/itemTooltip/ItemTooltip';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';

import EffectItem from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/EffectItem';

import styles from './accessoryItem.module.scss';

export default function AccessoryItem(props: { accessory: TLostarkAccessory }) {
  const { accessory } = props;
  const basicEffect = getPrimaryStatBasicEffect(accessory.basicEffects);

  return (
    <div className={styles['accessory-item']}>
      <ItemTooltipTrigger>
        <ItemSlot imageUrl={accessory.icon} grade={accessory.grade} />
        <ItemTooltip>TODO</ItemTooltip>
      </ItemTooltipTrigger>

      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <strong>{accessory.type ?? '-'}</strong>
        </div>
        <QualityChip quality={accessory.quality} />
      </div>

      <div className={styles['item-effect']}>
        {basicEffect && <p className={styles['basic-effect']}>{`스텟 ${basicEffect}`}</p>}
        {accessory.polishEffects.map((effect, index) => (
          <EffectItem key={`${effect.text}-${index}`} effect={effect} />
        ))}
      </div>

    </div>
  );
}

function getPrimaryStatBasicEffect(effects: string[]) {
  const basicEffect = effects
    .map((effect) => effect.match(/(힘|민첩|지능)\s*\+?\s*([\d,]+)/)?.[2] ?? null)
    .find((effect) => effect !== null);

  return basicEffect ? `+${basicEffect}` : null;
}
