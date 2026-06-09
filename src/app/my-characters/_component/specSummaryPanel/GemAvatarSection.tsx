import type { TLostarkGem, TResLostarkMainCharacter } from '@/api/lostark/type';

import SummarySection from './SummarySection';

import styles from './gemAvatarSection.module.scss';

const GEM_LEVEL_GROUPS = [
  { key: 'level-10', label: '10렙', level: 10, maxLevel: undefined, tier: 'perfect' },
  { key: 'level-9', label: '9렙', level: 9, maxLevel: undefined, tier: 'high' },
  { key: 'level-8', label: '8렙', level: 8, maxLevel: undefined, tier: 'middle' },
  { key: 'level-7', label: '7렙 이하', level: undefined, maxLevel: 7, tier: 'low' },
] as const;

export default function GemAvatarSection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <SummarySection title="보석 / 전설 아바타" className={styles['gem-avatar-section']}>
      <div className={styles['summary-table']}>
        <div className={styles['matrix-head-cell']}>캐릭터</div>
        <div className={styles['matrix-head-cell']}>10렙</div>
        <div className={styles['matrix-head-cell']}>9렙</div>
        <div className={styles['matrix-head-cell']}>8렙</div>
        <div className={styles['matrix-head-cell']}>7렙 이하</div>
        <div className={styles['matrix-head-cell']}>전설 아바타</div>

        {props.characters.map((character) => (
          <CharacterGemAvatarRow key={character.id} character={character} />
        ))}
      </div>
    </SummarySection>
  );
}

function CharacterGemAvatarRow(props: { character: TResLostarkMainCharacter }) {
  const { character } = props;
  const avatarCount = character.summary.legendaryAvatars.length;

  return (
    <>
      <div className={styles['character-cell']}>
        <strong className={styles['character-name']}>{character.characterName}</strong>
      </div>

      {GEM_LEVEL_GROUPS.map((levelGroup) => (
        <div key={levelGroup.key} className={styles['count-cell']}>
          <CountChip
            count={getGemLevelCount(character.summary.gems, levelGroup.level, levelGroup.maxLevel)}
            tier={levelGroup.tier}
          />
        </div>
      ))}

      <div className={styles['count-cell']}>
        <CountChip count={avatarCount} tier={avatarCount >= 4 ? 'high' : 'normal'} />
      </div>
    </>
  );
}

function CountChip(props: { count: number; tier: string }) {
  if (props.count === 0) {
    return <span className={styles['count-chip-empty']}>-</span>;
  }

  return <span className={styles[`count-chip-${props.tier}`]}>{props.count}</span>;
}

function getGemLevelCount(gems: TLostarkGem[], levelValue?: number, maxLevel?: number) {
  return gems.filter((gem) => {
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
