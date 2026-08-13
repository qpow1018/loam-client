import type { TLostarkAbilityStone } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';

import EquipmentTooltip from './EquipmentTooltip';

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
        <ItemTooltip>
          <EquipmentTooltip
            name={abilityStone.name}
            grade={abilityStone.grade}
            details={[
              { label: '상세 이름', value: abilityStone.title },
              { label: '종류', value: abilityStone.type },
              { label: '티어', value: abilityStone.tier },
            ]}
            effectGroups={[
              {
                label: '기본 효과',
                effects: abilityStone.basicEffects.map((text) => ({ text, color: null })),
              },
              {
                label: '추가 효과',
                effects: abilityStone.additionalEffects.map((text) => ({ text, color: null })),
              },
              {
                label: '어빌리티 스톤 효과',
                effects: abilityStone.abilityStoneBonusEffects.map((text) => ({
                  text,
                  color: null,
                })),
              },
              {
                label: '세공 각인',
                effects: abilityStone.abilityStoneEngravings.map((engraving) => ({
                  text: `${engraving.name} +${engraving.level ?? 0}`,
                  color: null,
                })),
              },
            ]}
          />
        </ItemTooltip>
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
