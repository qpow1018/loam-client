import type { TLostarkArkGrid, TResLostarkMainCharacter } from '@/api/lostark/type';

import SummaryCell from './_shared/SummaryCell';
import SummaryCharacterCell from './_shared/SummaryCharacterCell';
import SummarySection from './_shared/SummarySection';
import SummaryTable from './_shared/SummaryTable';

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
    <SummarySection
      title="아크그리드"
      className={styles['ark-grid-summary-section']}
      legendItems={[
        { label: '고대 17P+', color: '#f59e0b' },
        { label: '유물 17P+', color: '#94a3b8' },
        { label: '그 아래', color: '#62636c' },
      ]}
    >
      <SummaryTable
        className={styles['summary-table']}
        headCellClassName={styles['matrix-head-cell']}
        columns={[
          { key: 'character', label: '캐릭터' },
          ...CORE_SLOTS.map((slot) => ({ key: slot.key, label: slot.label })),
          { key: 'boss-damage', label: '보스 피해' },
        ]}
      >
        {props.characters.map((character) => (
          <CharacterArkGridRow key={character.id} character={character} />
        ))}
      </SummaryTable>
    </SummarySection>
  );
}

function CharacterArkGridRow(props: { character: TResLostarkMainCharacter }) {
  const { character } = props;

  return (
    <>
      <SummaryCharacterCell name={character.characterName} className={styles['character-cell']} />

      {CORE_SLOTS.map((slot) => (
        <SummaryCell key={slot.key} className={styles['core-cell']}>
          <CoreSummary arkGrid={character.summary.arkGrid} slot={slot} />
        </SummaryCell>
      ))}

      <SummaryCell className={styles['effect-cell']}>
        <BossDamageLevel arkGrid={character.summary.arkGrid} />
      </SummaryCell>
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
