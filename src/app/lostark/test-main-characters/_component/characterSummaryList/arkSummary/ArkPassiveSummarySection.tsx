import type { TLostarkArkPassive } from '@/api/lostark/type';

import SummarySection from '@/app/lostark/test-main-characters/_component/characterSummaryList/SummarySection';

import styles from './arkPassiveSummarySection.module.scss';

const ARK_PASSIVE_CATEGORIES = ['진화', '깨달음', '도약'] as const;

export default function ArkPassiveSummarySection(props: { arkPassive: TLostarkArkPassive }) {
  return (
    <SummarySection title="아크 패시브">
      <div className={styles['ark-passive-summary']}>
        {ARK_PASSIVE_CATEGORIES.map((category) => {
          const point = props.arkPassive.points.find((item) => item.name === category);
          const level = getArkPassiveLevel(point?.description ?? '');

          return (
            <div
              key={category}
              className={`${styles['passive-item']} ${level >= 26 ? styles['passive-high'] : ''}`}
            >
              <span className={styles['passive-name']}>{category}</span>
              <span className={styles['passive-level']}>{level}</span>
            </div>
          );
        })}
      </div>
    </SummarySection>
  );
}

function getArkPassiveLevel(description: string) {
  return Number(description.match(/(\d+)레벨/)?.[1] ?? 0);
}
