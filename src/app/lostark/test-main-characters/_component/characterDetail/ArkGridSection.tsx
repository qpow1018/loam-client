import type { TLostarkArkGrid } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';

import DetailPanel from './DetailPanel';

import styles from './arkGridSection.module.scss';

export default function ArkGridSection(props: { arkGrid: TLostarkArkGrid }) {
  const { arkGrid } = props;

  return (
    <DetailPanel title="아크 그리드">
      <div className={styles['ark-grid-section']}>
        <div className={styles['core-list']}>
          {arkGrid.cores.map((core, index) => (
            <div key={`${core.name}-${index}`}>
              <ItemSlot imageUrl={core.icon} grade={core.grade} size={36} />
              <span>{core.name?.split(':').at(-1)?.trim() ?? '-'}</span>
              <strong>{core.point ?? 0}P</strong>
            </div>
          ))}
        </div>
        <div className={styles['effect-list']}>
          {arkGrid.effects.map((effect, index) => (
            <span key={`${effect.name}-${index}`}>
              {effect.name ?? '-'} <strong>Lv. {effect.level ?? 0}</strong>
            </span>
          ))}
        </div>
      </div>
    </DetailPanel>
  );
}
