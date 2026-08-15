import type { TLostarkArkGrid } from '@/api/lostark/type';

import styles from './arkGridCoreTooltip.module.scss';

type TArkGridCore = TLostarkArkGrid['cores'][number];

export default function ArkGridCoreTooltip(props: { core: TArkGridCore }) {
  const { core } = props;

  return (
    <div className={styles['ark-grid-core-tooltip']}>
      <div className={styles['header']}>
        <p className={styles['core-name']}>{getCoreDisplayName(core.name)}</p>
        {core.grade && <span className={styles['core-grade']}>{core.grade}</span>}
      </div>

      {core.point !== null && (
        <div className={styles['detail-list']}>
          <span className={styles['detail-item']}>
            <span className={styles['detail-label']}>코어 포인트</span>
            {core.point}P
          </span>
        </div>
      )}
    </div>
  );
}

function getCoreDisplayName(name: string | null) {
  return name?.split(':').at(-1)?.trim() ?? '-';
}
