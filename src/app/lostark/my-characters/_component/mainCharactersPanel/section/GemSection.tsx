import type { TLostarkGem } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';

import styles from './gemSection.module.scss';

export default function GemSection(props: { gems: TLostarkGem[] }) {
  const GEM_LEVEL_GROUPS = [
    { label: '10렙', level: 10 },
    { label: '9렙', level: 9 },
    { label: '8렙', level: 8 },
    { label: '7렙 이하', maxLevel: 7 },
  ];

  function sortGemLevel(gems: TLostarkGem[]) {
    return [...gems].sort((a, b) => {
      const levelOrder = (b.level ?? 0) - (a.level ?? 0);

      if (levelOrder !== 0) {
        return levelOrder;
      }

      return (a.slot ?? 0) - (b.slot ?? 0);
    });
  }

  function divideGemByEffectType() {
    const sortedGems = sortGemLevel(props.gems);

    return {
      damageGems: sortedGems.filter((gem) => gem.effectType === 'damage'),
      cooldownGems: sortedGems.filter((gem) => gem.effectType === 'cooldown'),
    };
  }

  function getGemLevelCount(levelValue?: number, maxLevel?: number) {
    return props.gems.filter((gem) => {
      const level = gem.level ?? 0;

      if (levelValue !== undefined) {
        return level === levelValue;
      }

      if (maxLevel !== undefined) {
        return level <= maxLevel;
      }

      return false;
    }).length;
  }

  const { damageGems, cooldownGems } = divideGemByEffectType();
  const gemLevelCounts = GEM_LEVEL_GROUPS.map((levelGroup) => ({
    label: levelGroup.label,
    count: getGemLevelCount(levelGroup.level, levelGroup.maxLevel),
  })).filter((levelGroup) => levelGroup.count > 0);

  return (
    <section className={styles['gem-section']}>
      <div className={styles['level-count-list']}>
        {gemLevelCounts.map((levelGroup) => (
          <span key={levelGroup.label} className={styles['level-count']}>
            <span className={styles['level-label']}>{levelGroup.label}</span>
            <span className={styles['level-value']}>{levelGroup.count}개</span>
          </span>
        ))}
      </div>

      <div className={styles['gem-box']}>
        {damageGems.map((gem, index) => (
          <GemItem key={index} gem={gem} />
        ))}
        <div className={styles['blank']} />
        {cooldownGems.map((gem, index) => (
          <GemItem key={index} gem={gem} />
        ))}
      </div>
    </section>
  );
}

function GemItem(props: { gem: TLostarkGem }) {
  const { gem } = props;

  return (
    <div className={styles['gem-item']}>
      <ItemSlot imageUrl={gem.icon} grade={gem.grade} />

      <p className={styles['gem-title']}>
        {gem.level} {gem.kind}
      </p>
    </div>
  );
}
