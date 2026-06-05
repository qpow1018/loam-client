import type { TLostarkArkGrid } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';

import styles from './arkGridSection.module.scss';

const EFFECT_ORDER = ['보스 피해', '추가 피해', '공격력'];

export default function ArkGridSection(props: { arkGrid: TLostarkArkGrid }) {
  const { arkGrid } = props;

  function getEffectOrder(name: string | null) {
    const orderIndex = EFFECT_ORDER.findIndex((effectName) => effectName === name);

    return orderIndex === -1 ? Number.MAX_SAFE_INTEGER : orderIndex;
  }

  const sortedEffects = [...arkGrid.effects].sort(
    (a, b) => getEffectOrder(a.name) - getEffectOrder(b.name),
  );
  const bossDamageEffect = arkGrid.effects.find((effect) => effect.name === '보스 피해');

  return (
    <section className={styles['ark-grid-section']}>
      <div className={styles['core-list']}>
        {arkGrid.cores.map((core, index) => (
          <div key={index} className={styles['core-item']}>
            <ItemSlot imageUrl={core.icon} grade={core.grade} size={36} />

            <div className={styles['core-info']}>
              <p className={styles['core-name']}>{core.name}</p>
              <p className={styles['core-point']}>{core.point}P</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles['effect-section']}>
        <div className={styles['effect-list']}>
          {sortedEffects.map((effect, index) => (
            <div key={index} className={styles['effect-item']}>
              <span className={styles['effect-name']}>{effect.name}</span>
              <span className={styles['effect-level']}>Lv. {effect.level}</span>
            </div>
          ))}
        </div>

        {bossDamageEffect && (
          <div className={styles['boss-damage-box']}>
            <span className={styles['boss-damage-label']}>보스 피해</span>
            <strong className={styles['boss-damage-level']}>Lv. {bossDamageEffect.level}</strong>
          </div>
        )}
      </div>
    </section>
  );
}
