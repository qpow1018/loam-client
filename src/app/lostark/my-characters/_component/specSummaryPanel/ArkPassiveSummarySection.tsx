import type { TLostarkArkPassive, TResLostarkMainCharacter } from '@/api/lostark/type';

import SummarySection from './_shared/SummarySection';
import SummaryTable from './_shared/SummaryTable';
import SummaryCharacterRow from './_shared/SummaryCharacterRow';
import SummaryCell from './_shared/SummaryCell';
import CellValueChip from './_shared/CellValueChip';

import styles from './arkPassiveSummarySection.module.scss';

const ARK_PASSIVE_POINTS = ['진화', '깨달음', '도약'] as const;

type TArkPassivePointName = (typeof ARK_PASSIVE_POINTS)[number];

export default function ArkPassiveSummarySection(props: {
  characters: TResLostarkMainCharacter[];
}) {
  return (
    <SummarySection
      title="아크패시브"
      legendItems={[
        { label: '26+', tier: 'high' },
        { label: '21+', tier: 'middle' },
        { label: '이하', tier: 'low' },
      ]}
      className={styles['ark-passive-summary-section']}
    >
      <SummaryTable
        columns={ARK_PASSIVE_POINTS.map((pointName) => ({ key: pointName, label: pointName }))}
        gridClassName={styles['ark-passive-grid']}
      >
        {props.characters.map((character) => (
          <CharacterArkPassiveRow key={character.id} character={character} />
        ))}
      </SummaryTable>
    </SummarySection>
  );
}

function CharacterArkPassiveRow(props: { character: TResLostarkMainCharacter }) {
  const { character } = props;

  return (
    <SummaryCharacterRow name={character.characterName} className={styles['ark-passive-grid']}>
      {ARK_PASSIVE_POINTS.map((pointName, index) => (
        <ArkPassivePointValue
          key={index}
          arkPassive={character.summary.arkPassive}
          pointName={pointName}
        />
      ))}
    </SummaryCharacterRow>
  );
}

function ArkPassivePointValue(props: {
  arkPassive: TLostarkArkPassive;
  pointName: TArkPassivePointName;
}) {
  const { arkPassive, pointName } = props;

  const point = arkPassive.points.find((item) => item.name === pointName);
  const level = getArkPassiveLevel(point?.description?.trim() || '');

  function getArkPassiveLevel(description: string) {
    const matched = description.match(/(\d+)레벨/);

    if (!matched) {
      return 0;
    }

    return Number(matched[1]);
  }

  return (
    <SummaryCell>
      <CellValueChip grade={level >= 26 ? 'high' : level >= 21 ? 'middle' : 'low'}>
        {level}
      </CellValueChip>
    </SummaryCell>
  );
}
