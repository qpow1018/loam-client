import type { TLostarkArkGrid, TResLostarkMainCharacter } from '@/api/lostark/type';

import styles from './arkGridSummarySection.module.scss';

const CORE_SLOTS = [
  { key: 'order-sun', label: '질서 해', namePattern: '질서의 해' },
  { key: 'order-moon', label: '질서 달', namePattern: '질서의 달' },
  { key: 'order-star', label: '질서 별', namePattern: '질서의 별' },
  { key: 'chaos-sun', label: '혼돈 해', namePattern: '혼돈의 해' },
  { key: 'chaos-moon', label: '혼돈 달', namePattern: '혼돈의 달' },
  { key: 'chaos-star', label: '혼돈 별', namePattern: '혼돈의 별' },
] as const;

type TCoreSlot = (typeof CORE_SLOTS)[number];
type TCoreTier = 'high' | 'middle' | 'low' | 'empty';

export default function ArkGridSummarySection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <section className={styles['ark-grid-summary-section']}>
      <div className={styles['section-header']}>
        <h2 className={styles['section-title']}>아크그리드</h2>

        <div className={styles['core-legend']} aria-label="아크그리드 코어 등급 범례">
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-high']} />
            고대 17P+
          </span>
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-middle']} />
            유물 17P+
          </span>
          <span className={styles['legend-item']}>
            <span className={styles['legend-dot-low']} />
            그 아래
          </span>
        </div>
      </div>

      <div className={styles['summary-table']}>
        <div className={styles['matrix-head-cell']}>캐릭터</div>
        {CORE_SLOTS.map((slot) => (
          <div key={slot.key} className={styles['matrix-head-cell']}>
            {slot.label}
          </div>
        ))}
        <div className={styles['matrix-head-cell']}>보스 피해</div>

        {props.characters.map((character) => (
          <CharacterArkGridRow key={character.id} character={character} />
        ))}
      </div>
    </section>
  );
}

function CharacterArkGridRow(props: { character: TResLostarkMainCharacter }) {
  const { character } = props;

  return (
    <>
      <div className={styles['character-cell']}>
        <strong className={styles['character-name']}>{character.characterName}</strong>
      </div>

      {CORE_SLOTS.map((slot) => (
        <div key={slot.key} className={styles['core-cell']}>
          <CoreSummary arkGrid={character.summary.arkGrid} slot={slot} />
        </div>
      ))}

      <div className={styles['effect-cell']}>
        <BossDamageLevel arkGrid={character.summary.arkGrid} />
      </div>
    </>
  );
}

function CoreSummary(props: { arkGrid: TLostarkArkGrid; slot: TCoreSlot }) {
  const core = props.arkGrid.cores.find((item) => item.name?.includes(props.slot.namePattern));

  if (!core) {
    return <span className={styles['core-empty']}>-</span>;
  }

  const tier = getCoreTier(core.grade, core.point);

  return (
    <div className={styles[`core-summary-${tier}`]}>
      <span className={styles['core-name']}>{getCoreDisplayName(core.name)}</span>
      <span className={styles['core-meta']}>
        {core.grade ?? '-'} {core.point ?? '-'}P
      </span>
    </div>
  );
}

function BossDamageLevel(props: { arkGrid: TLostarkArkGrid }) {
  const bossDamageEffect = props.arkGrid.effects.find((effect) => effect.name === '보스 피해');

  if (!bossDamageEffect) {
    return <span className={styles['effect-empty']}>-</span>;
  }

  return <span className={styles['effect-level']}>Lv. {bossDamageEffect.level ?? '-'}</span>;
}

function getCoreDisplayName(name: string | null) {
  return name?.split(':').at(-1)?.trim() || '-';
}

function getCoreTier(grade: string | null, point: number | null): TCoreTier {
  if (!grade || point === null) {
    return 'empty';
  }

  if (grade === '고대' && point >= 17) {
    return 'high';
  }

  if (grade === '유물' && point >= 17) {
    return 'middle';
  }

  return 'low';
}
