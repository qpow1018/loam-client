import type { TLostarkAbilityStone } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import {
  ItemTooltip,
  ItemTooltipTrigger,
} from '@/components/lostark/itemTooltip/ItemTooltip';

import ItemDetailTooltip from '@/app/lostark/test-main-characters/_component/characterDetail/equipmentSection/ItemDetailTooltip';

import styles from './abilityStoneItem.module.scss';

export default function AbilityStoneItem(props: {
  abilityStone: TLostarkAbilityStone | null;
}) {
  const { abilityStone } = props;

  if (!abilityStone) return null;

  const positiveLevelSum = abilityStone.abilityStoneEngravings
    .slice(0, 2)
    .reduce((sum, engraving) => sum + (engraving.level ?? 0), 0);

  return (
    <ItemTooltipTrigger className={styles['ability-stone-item']}>
      <ItemSlot imageUrl={abilityStone.icon} grade={abilityStone.grade} />

      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <strong>어빌리티 스톤</strong>
          {positiveLevelSum >= 5 && <span className={styles['stone-chip']}>97돌</span>}
        </div>
        <div className={styles['stone-engraving-list']}>
          {abilityStone.abilityStoneEngravings.map((engraving, index) => (
            <div
              key={`${engraving.name}-${index}`}
              className={`${styles['stone-engraving']} ${index >= 2 ? styles['negative'] : ''}`}
            >
              <b>{`+${engraving.level ?? 0}`}</b>
              <span>{engraving.name}</span>
            </div>
          ))}
        </div>
      </div>

      <ItemTooltip>
        <ItemDetailTooltip
          name={abilityStone.name}
          grade={abilityStone.grade}
          details={[]}
          effects={[
            ...abilityStone.basicEffects.map((text) => ({ text })),
            ...abilityStone.additionalEffects.map((text) => ({ text })),
            ...abilityStone.abilityStoneBonusEffects.map((text) => ({ text })),
          ]}
        />
      </ItemTooltip>
    </ItemTooltipTrigger>
  );
}
