import type { TLostarkGem, TResLostarkMainCharacter } from '@/api/lostark/type';

import SummaryCell from './_shared/SummaryCell';
import SummaryCharacterCell from './_shared/SummaryCharacterCell';
import SummarySection from './_shared/SummarySection';
import SummaryTable from './_shared/SummaryTable';

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
      <SummaryTable
        className={styles['summary-table']}
        headCellClassName={styles['matrix-head-cell']}
        columns={[
          { key: 'character', label: '캐릭터' },
          { key: 'level-10', label: '10렙' },
          { key: 'level-9', label: '9렙' },
          { key: 'level-8', label: '8렙' },
          { key: 'level-7', label: '7렙 이하' },
          { key: 'legendary-avatar', label: '전설 아바타' },
        ]}
      >
        {props.characters.map((character) => (
          <CharacterGemAvatarRow key={character.id} character={character} />
        ))}
      </SummaryTable>
    </SummarySection>
  );
}

function CharacterGemAvatarRow(props: { character: TResLostarkMainCharacter }) {
  const { character } = props;
  const avatarCount = character.summary.legendaryAvatars.length;

  return (
    <>
      <SummaryCharacterCell name={character.characterName} className={styles['character-cell']} />

      {GEM_LEVEL_GROUPS.map((levelGroup) => (
        <SummaryCell key={levelGroup.key} className={styles['count-cell']}>
          <CountChip
            count={getGemLevelCount(character.summary.gems, levelGroup.level, levelGroup.maxLevel)}
            tier={levelGroup.tier}
          />
        </SummaryCell>
      ))}

      <SummaryCell className={styles['count-cell']}>
        <CountChip count={avatarCount} tier={avatarCount >= 4 ? 'high' : 'normal'} />
      </SummaryCell>
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
