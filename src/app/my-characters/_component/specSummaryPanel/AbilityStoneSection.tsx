import type { TLostarkAbilityStone, TResLostarkMainCharacter } from '@/api/lostark/type';

import styles from './abilityStoneSection.module.scss';

export default function AbilityStoneSection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <section className={styles['ability-stone-section']}>
      <div className={styles['section-header']}>
        <h2 className={styles['section-title']}>어빌리티 스톤</h2>

        <div className={styles['level-legend']} aria-label="어빌리티 스톤 합레벨 범례">
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-high']} />
            합 5+
          </span>
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-normal']} />
            합 4-
          </span>
        </div>
      </div>

      <div className={styles['stone-table']}>
        <div className={styles['matrix-head-cell']}>캐릭터</div>
        <div className={styles['matrix-head-cell']}>효과 1</div>
        <div className={styles['matrix-head-cell']}>효과 2</div>
        <div className={styles['matrix-head-cell']}>합레벨</div>

        {props.characters.map((character) => (
          <CharacterStoneRow key={character.id} character={character} />
        ))}
      </div>
    </section>
  );
}

function CharacterStoneRow(props: { character: TResLostarkMainCharacter }) {
  const { character } = props;
  const summary = getAbilityStoneSummary(character.summary.equipment.abilityStone);

  return (
    <>
      <div className={styles['character-cell']}>
        <strong className={styles['character-name']}>{character.characterName}</strong>
      </div>
      <StoneEngravingCell engraving={summary.positiveEngravings[0]} />
      <StoneEngravingCell engraving={summary.positiveEngravings[1]} />
      <div className={styles['level-sum-cell']}>
        <span className={styles[`level-sum-${summary.tier}`]}>{summary.label}</span>
      </div>
    </>
  );
}

function StoneEngravingCell(props: { engraving: TStoneEngravingSummary | undefined }) {
  if (!props.engraving) {
    return <div className={styles['empty-cell']}>-</div>;
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
