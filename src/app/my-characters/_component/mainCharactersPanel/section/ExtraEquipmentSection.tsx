import type {
  TLostarkAbilityStone,
  TLostarkBracelet,
  TLostarkColoredEffect,
} from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';

import styles from './extraEquipmentSection.module.scss';

export default function ExtraEquipmentSection(props: {
  abilityStone: TLostarkAbilityStone | null;
  bracelet: TLostarkBracelet | null;
}) {
  return (
    <section className={styles['extra-equipment-section']}>
      <AbilityStoneGroup abilityStone={props.abilityStone} />
      <BraceletGroup bracelet={props.bracelet} />
    </section>
  );
}

function AbilityStoneGroup(props: { abilityStone: TLostarkAbilityStone | null }) {
  const { abilityStone } = props;

  if (!abilityStone) {
    return null;
  }

  const positiveLevelSum = abilityStone.abilityStoneEngravings
    .slice(0, 2)
    .reduce((sum, engraving) => sum + (engraving.level ?? 0), 0);
  const isNineSevenStone = positiveLevelSum >= 5;

  return (
    <div className={styles['ability-stone-item']}>
      <ItemSlot imageUrl={abilityStone.icon} grade={abilityStone.grade} />

      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <p className={styles['name']}>어빌리티 스톤</p>
          {isNineSevenStone && <span className={styles['stone-chip']}>97돌</span>}
        </div>

        <div className={styles['stone-engraving-list']}>
          {abilityStone.abilityStoneEngravings.map((engraving, index) => (
            <div
              key={`${engraving.name}-${index}`}
              className={`${styles['stone-engraving']} ${index >= 2 ? styles['negative'] : ''}`}
            >
              <span className={styles['level']}>{`+${engraving.level}`}</span>
              <span className={styles['name']}>{engraving.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BraceletGroup(props: { bracelet: TLostarkBracelet | null }) {
  const { bracelet } = props;

  if (!bracelet) return null;

  function isBraceletCombinedOption(effect: TLostarkColoredEffect) {
    return effect.color?.replace('#', '').toUpperCase() === '99FF99';
  }

  function getBraceletEffects(effects: TLostarkColoredEffect[]) {
    return effects.reduce<TLostarkColoredEffect[]>((combinedEffects, effect) => {
      const previousEffect = combinedEffects[combinedEffects.length - 1];

      if (isBraceletCombinedOption(effect) && previousEffect) {
        previousEffect.text = `${previousEffect.text}\n${effect.text}`;
        return combinedEffects;
      }

      combinedEffects.push({ ...effect });
      return combinedEffects;
    }, []);
  }

  const braceletEffects = getBraceletEffects(bracelet.braceletEffects);

  return (
    <div className={styles['bracelet-item']}>
      <ItemSlot imageUrl={bracelet.icon} grade={bracelet.grade} />

      <div className={styles['info-box']}>
        <div className={styles['name-box']}>
          <p className={styles['name']}>팔찌</p>
        </div>
      </div>

      <div className={styles['item-effect']}>
        {braceletEffects.map((effect, index) => (
          <p key={index} className={styles['effect']}>
            <span
              className={styles['effect-marker']}
              style={{ backgroundColor: `#${effect.color}` }}
            />
            <span className={styles['effect-text']}>{effect.text}</span>
          </p>
        ))}
      </div>
    </div>
  );
}
