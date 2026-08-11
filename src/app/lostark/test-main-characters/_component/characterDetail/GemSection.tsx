import type { TLostarkGem } from '@/api/lostark/type';

import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';

import DetailPanel from './DetailPanel';

import styles from './gemSection.module.scss';

export default function GemSection(props: { gems: TLostarkGem[] }) {
  const { gems } = props;

  return (
    <DetailPanel title="보석">
      <div className={styles['gem-list']}>
        {gems.map((gem, index) => (
          <div
            key={`${gem.slot}-${index}`}
            className={styles['gem-item']}
            title={[gem.skillName, ...gem.effects, gem.bonusEffect].filter(Boolean).join('\n')}
          >
            <ItemSlot imageUrl={gem.icon} grade={gem.grade} size={42} />
            <span>{`${gem.level ?? '-'}${gem.kind?.slice(0, 1) ?? ''}`}</span>
          </div>
        ))}
      </div>
    </DetailPanel>
  );
}
