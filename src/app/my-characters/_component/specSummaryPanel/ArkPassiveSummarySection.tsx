import type { TLostarkArkPassive, TResLostarkMainCharacter } from '@/api/lostark/type';

import styles from './arkPassiveSummarySection.module.scss';

const ARK_PASSIVE_POINTS = ['진화', '깨달음', '도약'] as const;

type TArkPassivePointName = (typeof ARK_PASSIVE_POINTS)[number];
type TArkPassiveTier = 'high' | 'middle' | 'low' | 'empty';

export default function ArkPassiveSummarySection(props: {
  characters: TResLostarkMainCharacter[];
}) {
  return (
    <section className={styles['ark-passive-summary-section']}>
      <div className={styles['section-header']}>
        <h2 className={styles['section-title']}>아크패시브</h2>

        <div className={styles['level-legend']} aria-label="아크패시브 레벨 범례">
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-high']} />
            26+
          </span>
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-middle']} />
            21+
          </span>
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-low']} />
            그 아래
          </span>
        </div>
      </div>

      <div className={styles['summary-table']}>
        <div className={styles['matrix-head-cell']}>캐릭터</div>
        {ARK_PASSIVE_POINTS.map((pointName) => (
          <div key={pointName} className={styles['matrix-head-cell']}>
            {pointName}
          </div>
        ))}

        {props.characters.map((character) => (
          <CharacterArkPassiveRow key={character.id} character={character} />
        ))}
      </div>
    </section>
  );
}

function CharacterArkPassiveRow(props: { character: TResLostarkMainCharacter }) {
  const { character } = props;

  return (
    <>
      <div className={styles['character-cell']}>
        <strong className={styles['character-name']}>{character.characterName}</strong>
      </div>

      {ARK_PASSIVE_POINTS.map((pointName) => (
        <div key={pointName} className={styles['point-cell']}>
          <ArkPassivePointValue arkPassive={character.summary.arkPassive} pointName={pointName} />
        </div>
      ))}
    </>
  );
}

function ArkPassivePointValue(props: {
  arkPassive: TLostarkArkPassive;
  pointName: TArkPassivePointName;
}) {
  const point = props.arkPassive.points.find((item) => item.name === props.pointName);
  const description = point?.description?.trim() || '-';
  const level = getArkPassiveLevel(description);
  const tier = getArkPassiveTier(level);

  return <span className={styles[`point-value-${tier}`]}>{description}</span>;
}

function getArkPassiveLevel(description: string) {
  const matched = description.match(/(\d+)레벨/);

  if (!matched) {
    return null;
  }

  return Number(matched[1]);
}

function getArkPassiveTier(level: number | null): TArkPassiveTier {
  if (level === null) {
    return 'empty';
  }

  if (level >= 26) {
    return 'high';
  }

  if (level >= 21) {
    return 'middle';
  }

  return 'low';
}
