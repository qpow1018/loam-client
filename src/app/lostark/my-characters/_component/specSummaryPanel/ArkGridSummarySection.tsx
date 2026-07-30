import type { TLostarkArkGrid, TResLostarkMainCharacter } from '@/api/lostark/type';

import SummarySection from './_shared/SummarySection';
import SummaryTable from './_shared/SummaryTable';
import SummaryCharacterRow from './_shared/SummaryCharacterRow';
import SummaryCell from './_shared/SummaryCell';
import CellValueChip from './_shared/CellValueChip';

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

export default function ArkGridSummarySection(props: { characters: TResLostarkMainCharacter[] }) {
  return (
    <SummarySection
      title="아크그리드"
      legendItems={[
        { label: '고대 17P+', tier: 'high' },
        { label: '유물 17P+', tier: 'middle' },
        { label: '그 이하', tier: 'low' },
      ]}
      className={styles['ark-grid-summary-section']}
    >
      <SummaryTable
        columns={[
          ...CORE_SLOTS.map((slot) => ({ key: slot.key, label: slot.label })),
          { key: 'boss-damage', label: '보스 피해' },
        ]}
        gridClassName={styles['summary-table']}
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
    <SummaryCharacterRow name={character.characterName} className={styles['summary-table']}>
      {CORE_SLOTS.map((slot) => (
        <CoreSummary key={slot.key} arkGrid={character.summary.arkGrid} slot={slot} />
      ))}

      <BossDamageLevel arkGrid={character.summary.arkGrid} />
    </SummaryCharacterRow>
  );
}

function CoreSummary(props: { arkGrid: TLostarkArkGrid; slot: TCoreSlot }) {
  const core = props.arkGrid.cores.find((item) => item.name?.includes(props.slot.namePattern));

  if (!core) {
    return null;
  }

  function getCoreDisplayName(name: string | null) {
    return name?.split(':').at(-1)?.trim() || '-';
  }

  function getCoreTier(grade: string | null, point: number | null) {
    if (!grade || point === null) {
      return 'none';
    }

    if (grade === '고대' && point >= 17) {
      return 'high';
    }

    if (grade === '유물' && point >= 17) {
      return 'middle';
    }

    return 'low';
  }

  const tier = getCoreTier(core.grade, core.point);

  return (
    <SummaryCell>
      <CellValueChip grade={tier} className={styles['core']}>
        <p className={styles['core-name']}>{getCoreDisplayName(core.name)}</p>
        <p className={styles['core-meta']}>
          {core.grade ?? '-'} {core.point ?? '-'}P
        </p>
      </CellValueChip>
    </SummaryCell>
  );
}

function BossDamageLevel(props: { arkGrid: TLostarkArkGrid }) {
  const bossDamageEffect = props.arkGrid.effects.find((effect) => effect.name === '보스 피해');

  return (
    <SummaryCell>
      <CellValueChip grade="low">Lv. {bossDamageEffect?.level ?? '-'}</CellValueChip>
    </SummaryCell>
  );
}
