import type { TLostarkAbilityStone } from '@/api/lostark/type';

import styles from './equipmentSupplementSummary.module.scss';

export default function EquipmentSupplementSummary(props: {
  abilityStone: TLostarkAbilityStone | null;
  braceletScore: number | null;
}) {
  const { abilityStone, braceletScore } = props;
  console.log('abilityStone', abilityStone);

  const abilityStoneEngravings = abilityStone?.abilityStoneEngravings.slice(0, 2) ?? [];
  const isHighLevelStone = hasHighLevelStone(abilityStoneEngravings);

  return (
    <div className={styles['equipment-supplement-summary']}>
      <div className={styles['bracelet-summary']}>
        <p className={styles['label']}>팔찌</p>
        <p className={styles['bracelet-score']}>{braceletScore ? `${braceletScore} %` : '-'}</p>
      </div>

      <div
        className={`${styles['ability-stone']} ${
          isHighLevelStone ? styles['ability-stone-high-level'] : ''
        }`}
      >
        {abilityStoneEngravings.map((engraving, index) => (
          <p key={`${engraving.name}-${index}`} className={styles['stone-engraving']}>
            <span className={styles['stone-level']}>{`+${engraving.level ?? 0}`}</span>
            {engraving.name}
          </p>
        ))}
      </div>
    </div>
  );
}

function hasHighLevelStone(engravings: TLostarkAbilityStone['abilityStoneEngravings']) {
  return engravings.reduce((sum, engraving) => sum + (engraving.level ?? 0), 0) >= 5;
}
