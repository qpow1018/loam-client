import type { TLostarkEngraving, TResLostarkMainCharacter } from '@/api/lostark/type';

import SummarySection from './_shared/SummarySection';
import SummaryTable from './_shared/SummaryTable';
import SummaryCharacterRow from './_shared/SummaryCharacterRow';
import SummaryCell from './_shared/SummaryCell';
import CellValueChip from './_shared/CellValueChip';

import styles from './engravingSummarySection.module.scss';

export default function EngravingSummarySection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <SummarySection
      title="각인"
      legendItems={[
        { label: '4레벨', color: '#34d399' },
        { label: '1~3레벨', color: '#94a3b8' },
        { label: '0레벨', color: '#62636c' },
      ]}
      className={styles['engraving-summary-section']}
    >
      <SummaryTable
        columns={[
          { key: 'effect-1', label: '각인 1' },
          { key: 'effect-2', label: '각인 2' },
          { key: 'effect-3', label: '각인 3' },
          { key: 'effect-4', label: '각인 4' },
          { key: 'effect-5', label: '각인 5' },
        ]}
        gridClassName={styles['engraving-grid']}
      >
        {props.characters.map((character) => (
          <EngravingRow key={character.id} character={character} />
        ))}
      </SummaryTable>
    </SummarySection>
  );
}

function EngravingRow(props: { character: TResLostarkMainCharacter }) {
  const { character } = props;

  function getEngravingGrade(level: number | null) {
    const _level = level ?? 0;

    if (_level >= 4) {
      return 'high';
    }

    if (_level >= 1) {
      return 'middle';
    }

    return 'low';
  }

  return (
    <SummaryCharacterRow name={character.characterName} className={styles['engraving-grid']}>
      {character.summary.engravings.map((engraving, index) => {
        const levelGrade = getEngravingGrade(engraving.level);

        return (
          <SummaryCell key={index}>
            <span className={styles['engraving-name']}>{engraving.name}</span>
            <CellValueChip grade={levelGrade}>{engraving.level}</CellValueChip>
          </SummaryCell>
        );
      })}
    </SummaryCharacterRow>
  );
}
