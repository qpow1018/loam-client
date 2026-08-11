import type { TLostarkBracelet, TLostarkColoredEffect } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import {
  ItemTooltip,
  ItemTooltipTrigger,
} from '@/components/lostark/itemTooltip/ItemTooltip';

import EffectItem from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/EffectItem';
import ItemDetailTooltip from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/ItemDetailTooltip';

import styles from './braceletItem.module.scss';

export default function BraceletItem(props: { bracelet: TLostarkBracelet | null }) {
  const { bracelet } = props;

  if (!bracelet) return null;

  return (
    <ItemTooltipTrigger className={styles['bracelet-item']}>
      <ItemSlot imageUrl={bracelet.icon} grade={bracelet.grade} />
      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <strong>팔찌</strong>
        </div>
      </div>
      <div className={styles['item-effect']}>
        {getBraceletEffects(bracelet.braceletEffects).map((effect, index) => (
          <EffectItem key={`${effect.text}-${index}`} effect={effect} />
        ))}
      </div>

      <ItemTooltip>
        <ItemDetailTooltip
          name={bracelet.name}
          grade={bracelet.grade}
          details={[]}
          effects={bracelet.braceletEffects}
        />
      </ItemTooltip>
    </ItemTooltipTrigger>
  );
}

function getBraceletEffects(effects: TLostarkColoredEffect[]) {
  return effects.reduce<TLostarkColoredEffect[]>((combinedEffects, effect) => {
    const previousEffect = combinedEffects[combinedEffects.length - 1];
    const isCombinedOption = effect.color?.replace('#', '').toUpperCase() === '99FF99';

    if (isCombinedOption && previousEffect) {
      previousEffect.text = `${previousEffect.text}\n${effect.text}`;
      return combinedEffects;
    }

    combinedEffects.push({ ...effect });
    return combinedEffects;
  }, []);
}
