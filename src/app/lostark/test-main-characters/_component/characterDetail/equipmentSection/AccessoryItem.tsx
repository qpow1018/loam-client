import type { TLostarkAccessory } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import {
  ItemTooltip,
  ItemTooltipTrigger,
} from '@/components/lostark/itemTooltip/ItemTooltip';
import QualityChip from '@/components/lostark/qualityChip/QualityChip';

import EffectItem from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/EffectItem';
import ItemDetailTooltip from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/ItemDetailTooltip';

import styles from './accessoryItem.module.scss';

export default function AccessoryItem(props: { accessory: TLostarkAccessory }) {
  const { accessory } = props;
  const basicEffect = getPrimaryStatBasicEffect(accessory.basicEffects);

  return (
    <ItemTooltipTrigger className={styles['accessory-item']}>
      <ItemSlot imageUrl={accessory.icon} grade={accessory.grade} />

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

      <ItemTooltip>
        <ItemDetailTooltip
          name={accessory.name}
          grade={accessory.grade}
          details={[{ label: '품질', value: accessory.quality }]}
          effects={[
            ...accessory.basicEffects.map((text) => ({ text })),
            ...accessory.additionalEffects.map((text) => ({ text })),
            ...accessory.polishEffects,
            ...accessory.arkPassiveEffects.map((text) => ({ text })),
          ]}
        />
      </ItemTooltip>
    </ItemTooltipTrigger>
  );
}

function getPrimaryStatBasicEffect(effects: string[]) {
  const basicEffect = effects
    .map((effect) => effect.match(/(힘|민첩|지능)\s*\+?\s*([\d,]+)/)?.[2] ?? null)
    .find((effect) => effect !== null);

  return basicEffect ? `+${basicEffect}` : null;
}
