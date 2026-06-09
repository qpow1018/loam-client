import type { TLostarkGem, TResLostarkMainCharacter } from '@/api/lostark/type';

import SummaryTable from './_shared/SummaryTable';
import SummarySection from './_shared/SummarySection';
import SummaryCharacterRow from './_shared/SummaryCharacterRow';
import SummaryCell from './_shared/SummaryCell';
import CellValueChip from './_shared/CellValueChip';

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
        columns={[
          { key: 'level-10', label: '10렙' },
          { key: 'level-9', label: '9렙' },
          { key: 'level-8', label: '8렙' },
          { key: 'level-7', label: '7렙 이하' },
          { key: 'legendary-avatar', label: '전설 아바타' },
        ]}
        gridClassName={styles['gem-grid']}
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

  return (
    <SummaryCharacterRow name={character.characterName} className={styles['gem-grid']}>
      {GEM_LEVEL_GROUPS.map((levelGroup) => {
        const count = getGemLevelCount(
          character.summary.gems,
          levelGroup.level,
          levelGroup.maxLevel,
        );

        return (
          <SummaryCell key={levelGroup.key} className={styles['count-cell']}>
            <CellValueChip grade={count === 0 ? 'none' : levelGroup.tier}>
              {count === 0 ? '-' : count}
            </CellValueChip>
          </SummaryCell>
        );
      })}

      <SummaryCell>
        <CellValueChip grade={avatarCount >= 4 ? 'high' : avatarCount >= 1 ? 'middle' : 'none'}>
          {avatarCount === 0 ? '-' : avatarCount}
        </CellValueChip>
      </SummaryCell>
    </SummaryCharacterRow>
  );
}
