import type { TLostarkEngraving, TResLostarkMainCharacter } from '@/api/lostark/type';

import SummaryCharacterCell from './_shared/SummaryCharacterCell';
import SummarySection from './_shared/SummarySection';

import styles from './engravingSummarySection.module.scss';

export default function EngravingSummarySection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <SummarySection
      title="각인"
      className={styles['engraving-summary-section']}
      legendItems={[
        { label: '4레벨', color: '#f59e0b' },
        { label: '0-3레벨', color: '#62636c' },
      ]}
    >
      <div className={styles['engraving-table']}>
        {props.characters.map((character) => (
          <div key={character.id} className={styles['character-row']}>
            <SummaryCharacterCell
              name={character.characterName}
              className={styles['character-cell']}
            />

            <EngravingList engravings={character.summary.engravings} />
          </div>
        ))}
      </div>
    </SummarySection>
  );
}

function EngravingList(props: { engravings: TLostarkEngraving[] }) {
  if (props.engravings.length === 0) {
    return <div className={styles['empty-cell']}>-</div>;
  }

  return (
    <div className={styles['engraving-list']}>
      {props.engravings.map((engraving, index) => (
        <div
          key={`${engraving.name ?? 'empty'}-${index}`}
          className={`${styles['engraving-chip']} ${
            engraving.level === 4 ? styles['max'] : styles['normal']
          }`}
        >
          <span className={styles['engraving-name']}>{engraving.name ?? '-'}</span>
          <span className={styles['engraving-level']}>
            &times;
            <span>{engraving.level ?? 0}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
