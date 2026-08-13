import type { TLostarkArkGrid, TResLostarkCharacterSummary } from '@/api/lostark/type';

import SummarySection from '../SummarySection';

import styles from './arkSummary.module.scss';

const ARK_PASSIVE_CATEGORIES = ['진화', '깨달음', '도약'] as const;
const ARK_CORE_GROUPS = [
  { label: '질서', coreNames: ['질서의 해', '질서의 달', '질서의 별'] },
  { label: '혼돈', coreNames: ['혼돈의 해', '혼돈의 달', '혼돈의 별'] },
] as const;

export default function ArkSummary(props: { summary: TResLostarkCharacterSummary }) {
  return (
    <div className={styles['ark-summary']}>
      <SummarySection title="아크 패시브">
        <div className={styles['ark-passive-list']}>
          {ARK_PASSIVE_CATEGORIES.map((category) => {
            const point = props.summary.arkPassive.points.find((item) => item.name === category);
            const level = getArkPassiveLevel(point?.description ?? '');

            return (
              <span key={category} className={getArkPassiveClassName(level)}>
                <small>{category}</small>
                <b>{level}</b>
              </span>
            );
          })}
        </div>
      </SummarySection>

      <SummarySection title="아크 그리드">
        <div className={styles['ark-grid-list']}>
          {ARK_CORE_GROUPS.map((group) => (
            <div key={group.label} className={styles['ark-core-group']}>
              <p>{group.label}</p>
              <div>
                {group.coreNames.map((coreName) => (
                  <ArkCoreSummary
                    key={coreName}
                    core={props.summary.arkGrid.cores.find((item) => item.name?.includes(coreName))}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </SummarySection>
    </div>
  );
}

function ArkCoreSummary(props: { core: TLostarkArkGrid['cores'][number] | undefined }) {
  if (!props.core) return <div className={styles['ark-core-empty']}>-</div>;

  return (
    <div className={styles['ark-core']}>
      <b>{props.core.name?.split(':').at(-1)?.trim() ?? '-'}</b>
      <span>{`${props.core.grade ?? '-'} ${props.core.point ?? '-'}P`}</span>
    </div>
  );
}

function getArkPassiveLevel(description: string) {
  return Number(description.match(/(\d+)레벨/)?.[1] ?? 0);
}

function getArkPassiveClassName(level: number) {
  if (level >= 26) return styles['ark-passive-high'];
  if (level >= 21) return styles['ark-passive-middle'];

  return styles['ark-passive-low'];
}
