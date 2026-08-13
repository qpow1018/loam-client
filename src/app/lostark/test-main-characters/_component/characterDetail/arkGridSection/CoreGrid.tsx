import type { TLostarkArkGrid } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';

import styles from './coreGrid.module.scss';

export default function CoreGrid(props: {
  coreGroups: { type: string; cores: TLostarkArkGrid['cores'] }[];
}) {
  const { coreGroups } = props;

  return (
    <div className={styles['core-grid']}>
      {coreGroups.map(({ type, cores }) => (
        <div key={type} className={styles['core-list']}>
          {cores.map((core, index) => (
            <div key={`${core.name}-${index}`} className={styles['core-item']}>
              <ItemSlot imageUrl={core.icon} grade={core.grade} size={44} />
              <div className={styles['core-info']}>
                <p className={styles['core-name']}>{getCoreDisplayName(core.name)}</p>
                <p className={styles['core-point']}>{core.point ?? 0}P</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function getCoreDisplayName(name: string | null) {
  return name?.split(':').at(-1)?.trim() ?? '-';
}
