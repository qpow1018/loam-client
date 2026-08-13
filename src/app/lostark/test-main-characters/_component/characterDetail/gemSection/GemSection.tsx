import type { TLostarkGem } from '@/api/lostark/type';

import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';
import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';
import DetailPanel from '@/app/lostark/test-main-characters/_component/characterDetail/DetailPanel';

import GemTooltip from './GemTooltip';

import styles from './gemSection.module.scss';

const GEM_LEVEL_GROUPS = [
  { label: '10렙', level: 10 },
  { label: '9렙', level: 9 },
  { label: '8렙', level: 8 },
  { label: '7렙 이하', maxLevel: 7 },
];

export default function GemSection(props: { gems: TLostarkGem[] }) {
  const { gems } = props;

  const gemGroups = groupGems(gems);
  const basicAttackPower = getBasicAttackPower(gems);
  const gemLevelCounts = GEM_LEVEL_GROUPS.map((levelGroup) => ({
    label: levelGroup.label,
    count: getGemLevelCount(gems, levelGroup.level, levelGroup.maxLevel),
  })).filter((levelGroup) => levelGroup.count > 0);

  return (
    <DetailPanel title="보석">
      <div className={styles['gem-section']}>
        <div className={styles['level-count-list']}>
          {gemLevelCounts.map((levelGroup) => (
            <span key={levelGroup.label} className={styles['level-count']}>
              <span className={styles['level-label']}>{levelGroup.label}</span>
              <span className={styles['level-value']}>{levelGroup.count}개</span>
            </span>
          ))}
          {basicAttackPower !== null && (
            <span className={styles['level-count']}>
              <span className={styles['level-label']}>기본 공격력</span>
              <span className={styles['level-value']}>{`+${basicAttackPower.toFixed(2)}%`}</span>
            </span>
          )}
        </div>

        <div className={styles['gem-list']}>
          {gemGroups.damage.map((gem, index) => (
            <GemItem key={`${gem.slot}-${index}`} gem={gem} />
          ))}
          <div className={styles['blank']} />
          {gemGroups.cooldown.map((gem, index) => (
            <GemItem key={`${gem.slot}-${index}`} gem={gem} />
          ))}
        </div>
      </div>
    </DetailPanel>
  );
}

function GemItem(props: { gem: TLostarkGem }) {
  const { gem } = props;

  return (
    <div className={styles['gem-item']}>
      <ItemTooltipTrigger>
        <ItemSlot imageUrl={gem.icon} grade={gem.grade} />
        <ItemTooltip>
          <GemTooltip gem={gem} />
        </ItemTooltip>
      </ItemTooltipTrigger>
      <p className={styles['gem-title']}>{`${gem.level ?? '-'} ${gem.kind ?? '-'}`}</p>
    </div>
  );
}

function groupGems(gems: TLostarkGem[]) {
  const sortedGems = [...gems].sort((left, right) => {
    const levelOrder = (right.level ?? 0) - (left.level ?? 0);

    if (levelOrder !== 0) return levelOrder;

    return (left.slot ?? 0) - (right.slot ?? 0);
  });

  return {
    damage: sortedGems.filter((gem) => gem.effectType === 'damage'),
    cooldown: sortedGems.filter((gem) => gem.effectType === 'cooldown'),
  };
}

function getGemLevelCount(gems: TLostarkGem[], level?: number, maxLevel?: number) {
  return gems.filter((gem) => {
    if (level !== undefined) return gem.level === level;
    if (maxLevel !== undefined) return (gem.level ?? 0) <= maxLevel;

    return false;
  }).length;
}

function getBasicAttackPower(gems: TLostarkGem[]) {
  const values = gems
    .map((gem) => gem.bonusEffect?.match(/기본 공격력\s+(\d+(?:\.\d+)?)%\s+증가/)?.[1])
    .filter((value): value is string => value !== undefined);

  if (values.length === 0) return null;

  return values.reduce((total, value) => total + Number(value), 0);
}
