import type { TLostarkAbilityStone, TResLostarkMainCharacter } from '@/api/lostark/type';

import SummaryCell from './_shared/SummaryCell';
import SummaryCharacterCell from './_shared/SummaryCharacterCell';
import SummarySection from './_shared/SummarySection';
import SummaryTable from './_shared/SummaryTable';

import styles from './abilityStoneSection.module.scss';

export default function AbilityStoneSection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <SummarySection
      title="어빌리티 스톤"
      className={styles['ability-stone-section']}
      legendItems={[
        { label: '합 5+', color: '#f59e0b' },
        { label: '합 4-', color: '#62636c' },
      ]}
    >
      <SummaryTable
        className={styles['stone-table']}
        headCellClassName={styles['matrix-head-cell']}
        columns={[
          { key: 'character', label: '캐릭터' },
          { key: 'effect-1', label: '효과 1' },
          { key: 'effect-2', label: '효과 2' },
          { key: 'level-sum', label: '합레벨' },
        ]}
      >
        {props.characters.map((character) => (
          <CharacterStoneRow key={character.id} character={character} />
        ))}
      </SummaryTable>
    </SummarySection>
  );
}

function CharacterStoneRow(props: { character: TResLostarkMainCharacter }) {
  const { character } = props;
  const summary = getAbilityStoneSummary(character.summary.equipment.abilityStone);

  return (
    <>
      <SummaryCharacterCell name={character.characterName} className={styles['character-cell']} />
      <StoneEngravingCell engraving={summary.positiveEngravings[0]} />
      <StoneEngravingCell engraving={summary.positiveEngravings[1]} />
      <SummaryCell className={styles['level-sum-cell']}>
        <span className={styles[`level-sum-${summary.tier}`]}>{summary.label}</span>
      </SummaryCell>
    </>
  );
}

function StoneEngravingCell(props: { engraving: TStoneEngravingSummary | undefined }) {
  if (!props.engraving) {
    return <SummaryCell className={styles['empty-cell']}>-</SummaryCell>;
  }

  return (
    <div className={styles['engraving-cell']}>
      <span className={styles['engraving-level']}>{`+${props.engraving.level}`}</span>
      <span className={styles['engraving-name']}>{props.engraving.name}</span>
    </div>
  );
}

type TStoneEngravingSummary = {
  name: string;
  level: number;
};

type TAbilityStoneSummary = {
  positiveEngravings: TStoneEngravingSummary[];
  levelSum: number;
  label: string;
  tier: 'high' | 'normal' | 'empty';
};

function getAbilityStoneSummary(abilityStone: TLostarkAbilityStone | null): TAbilityStoneSummary {
  if (!abilityStone) {
    return {
      positiveEngravings: [],
      levelSum: 0,
      label: '-',
      tier: 'empty',
    };
  }

  const positiveEngravings = abilityStone.abilityStoneEngravings.slice(0, 2).map((engraving) => ({
    name: engraving.name,
    level: engraving.level ?? 0,
  }));
  const levelSum = positiveEngravings.reduce((sum, engraving) => sum + engraving.level, 0);

  return {
    positiveEngravings,
    levelSum,
    label: String(levelSum),
    tier: levelSum >= 5 ? 'high' : 'normal',
  };
}
