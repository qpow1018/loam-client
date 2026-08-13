import type { TLostarkBracelet, TLostarkColoredEffect } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';

import EffectItem from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/EffectItem';

import EquipmentTooltip from './EquipmentTooltip';

import styles from './braceletItem.module.scss';

export default function BraceletItem(props: { bracelet: TLostarkBracelet | null }) {
  const { bracelet } = props;

  if (!bracelet) return null;

  return (
    <div className={styles['bracelet-item']}>
      <ItemTooltipTrigger>
        <ItemSlot imageUrl={bracelet.icon} grade={bracelet.grade} />
        <ItemTooltip>
          <EquipmentTooltip
            name={bracelet.name}
            grade={bracelet.grade}
            details={[
              { label: '상세 이름', value: bracelet.title },
              { label: '종류', value: bracelet.type },
              { label: '티어', value: bracelet.tier },
            ]}
            effectGroups={[
              {
                label: '기본 효과',
                effects: bracelet.basicEffects.map((text) => ({ text, color: null })),
              },
              {
                label: '추가 효과',
                effects: bracelet.additionalEffects.map((text) => ({ text, color: null })),
              },
              { label: '팔찌 효과', effects: bracelet.braceletEffects },
            ]}
          />
        </ItemTooltip>
      </ItemTooltipTrigger>
      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <strong>팔찌</strong>
        </div>
      </div>
      <div className={styles['effect-list']}>
        {getBraceletEffects(bracelet.braceletEffects).map((effect, index) => (
          <EffectItem key={`${effect.text}-${index}`} effect={effect} />
        ))}
      </div>
    </div>
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
