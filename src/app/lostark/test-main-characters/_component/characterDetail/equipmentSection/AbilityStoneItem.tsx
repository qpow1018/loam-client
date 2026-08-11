import type { TLostarkAbilityStone } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';

import styles from './abilityStoneItem.module.scss';

export default function AbilityStoneItem(props: { abilityStone: TLostarkAbilityStone | null }) {
  const { abilityStone } = props;

  if (!abilityStone) return null;

  const positiveLevelSum = abilityStone.abilityStoneEngravings
    .slice(0, 2)
    .reduce((sum, engraving) => sum + (engraving.level ?? 0), 0);

  return (
    <div className={styles['ability-stone-item']}>
      <ItemTooltipTrigger>
        <ItemSlot imageUrl={abilityStone.icon} grade={abilityStone.grade} />
        <ItemTooltip>TODO</ItemTooltip>
      </ItemTooltipTrigger>

      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <p className={styles['item-name']}>어빌리티 스톤</p>
          {positiveLevelSum >= 5 && <span className={styles['stone-chip']}>97돌</span>}
        </div>
        <div className={styles['stone-engraving-list']}>
          {abilityStone.abilityStoneEngravings.slice(0, 2).map((engraving, index) => (
            <div key={`${engraving.name}-${index}`} className={styles['stone-engraving']}>
              <b>{`+${engraving.level ?? 0}`}</b>
              <span>{engraving.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
