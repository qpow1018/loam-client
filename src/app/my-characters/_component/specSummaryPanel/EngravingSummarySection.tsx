import type { TLostarkEngraving, TResLostarkMainCharacter } from '@/api/lostark/type';

import styles from './engravingSummarySection.module.scss';

export default function EngravingSummarySection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <section className={styles['engraving-summary-section']}>
      <div className={styles['section-header']}>
        <h2 className={styles['section-title']}>각인</h2>

        <div className={styles['level-legend']} aria-label="각인 레벨 범례">
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-max']} />
            4레벨
          </span>
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-normal']} />
            0-3레벨
          </span>
        </div>
      </div>

      <div className={styles['engraving-table']}>
        {props.characters.map((character) => (
          <div key={character.id} className={styles['character-row']}>
            <div className={styles['character-cell']}>
              <strong className={styles['character-name']}>{character.characterName}</strong>
            </div>

            <EngravingList engravings={character.summary.engravings} />
          </div>
        ))}
      </div>
    </section>
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
