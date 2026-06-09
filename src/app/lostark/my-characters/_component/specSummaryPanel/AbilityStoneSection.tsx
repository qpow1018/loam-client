import type { TLostarkAbilityStone, TResLostarkMainCharacter } from '@/api/lostark/type';

import SummaryTable from './_shared/SummaryTable';
import SummarySection from './_shared/SummarySection';
import SummaryCharacterRow from './_shared/SummaryCharacterRow';
import SummaryCell from './_shared/SummaryCell';
import CellValueChip from './_shared/CellValueChip';

import styles from './abilityStoneSection.module.scss';

type TStoneEngravingSummary = {
  name: string;
  level: number;
};

type TAbilityStoneSummary = {
  positiveEngravings: TStoneEngravingSummary[];
  levelSum: number;
  label: string;
  tier: 'high' | 'middle' | 'low' | 'none';
};

export default function AbilityStoneSection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <SummarySection
      title="어빌리티 스톤"
      legendItems={[
        { label: '5 이상', color: '#34d399' },
        { label: '4 이하', color: '#62636c' },
      ]}
      className={styles['ability-stone-section']}
    >
      <SummaryTable
        columns={[
          { key: 'effect-1', label: '효과 1' },
          { key: 'effect-2', label: '효과 2' },
          { key: 'level-sum', label: '합레벨' },
        ]}
        gridClassName={styles['stone-grid']}
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

  function getAbilityStoneSummary(abilityStone: TLostarkAbilityStone | null): TAbilityStoneSummary {
    if (!abilityStone) {
      return {
        positiveEngravings: [],
        levelSum: 0,
        label: '-',
        tier: 'none',
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
      tier: levelSum >= 5 ? 'high' : 'low',
    };
  }

  const summary = getAbilityStoneSummary(character.summary.equipment.abilityStone);

  return (
    <SummaryCharacterRow name={character.characterName} className={styles['stone-grid']}>
      <StoneEngravingCell engraving={summary.positiveEngravings[0]} />
      <StoneEngravingCell engraving={summary.positiveEngravings[1]} />

      <SummaryCell>
        <CellValueChip grade={summary.tier}>{summary.label}</CellValueChip>
      </SummaryCell>
    </SummaryCharacterRow>
  );
}

function StoneEngravingCell(props: { engraving: TStoneEngravingSummary | undefined }) {
  if (!props.engraving) {
    return <SummaryCell className={styles['empty-cell']}>-</SummaryCell>;
  }

  return (
    <SummaryCell className={styles['engraving-cell']}>
      <span className={styles['engraving-level']}>{`+${props.engraving.level}`}</span>
      <span className={styles['engraving-name']}>{props.engraving.name}</span>
    </SummaryCell>
  );
}
