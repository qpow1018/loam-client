import type { TLostarkArkGrid } from '@/api/lostark/type';

import SummarySection from '@/app/lostark/my-characters/_component/characterSummaryList/SummarySection';

import styles from './arkGridSummarySection.module.scss';

const ARK_CORE_GROUPS = [
  { label: '질서', coreNames: ['질서의 해', '질서의 달', '질서의 별'] },
  { label: '혼돈', coreNames: ['혼돈의 해', '혼돈의 달', '혼돈의 별'] },
] as const;

type TArkCore = TLostarkArkGrid['cores'][number];

export default function ArkGridSummarySection(props: { arkGrid: TLostarkArkGrid }) {
  return (
    <SummarySection title="아크 그리드">
      <div className={styles['ark-grid-summary']}>
        {ARK_CORE_GROUPS.map((group) => (
          <div key={group.label} className={styles['core-group']}>
            <span className={styles['core-group-label']}>{group.label}</span>

            <div className={styles['core-list']}>
              {group.coreNames.map((coreName) => (
                <ArkCoreItem
                  key={coreName}
                  core={props.arkGrid.cores.find((core) => core.name?.includes(coreName))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </SummarySection>
  );
}

function ArkCoreItem(props: { core: TArkCore | undefined }) {
  const { core } = props;

  if (!core) {
    return <div className={`${styles['core-item']} ${styles['core-empty']}`}>-</div>;
  }

  return (
    <div
      className={`${styles['core-item']} ${core.grade === '고대' ? styles['core-ancient'] : ''}`}
    >
      <span className={styles['core-name']}>{core.name?.split(':').at(-1)?.trim() ?? '-'}</span>
      <span className={styles['core-meta']}>
        <span>{core.grade ?? '-'}</span>
        <span className={styles['core-point']}>{core.point !== null ? `${core.point}P` : '-'}</span>
      </span>
    </div>
  );
}
