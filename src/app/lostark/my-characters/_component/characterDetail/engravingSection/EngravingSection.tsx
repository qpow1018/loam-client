import type { TLostarkEngraving } from '@/api/lostark/type';
import { engravingIconUrlByName } from '@/define/lostark/engravingIcons';

import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';
import DetailPanel from '@/app/lostark/my-characters/_component/characterDetail/DetailPanel';

import EngravingTooltip from './EngravingTooltip';

import styles from './engravingSection.module.scss';

export default function EngravingSection(props: { engravings: TLostarkEngraving[] }) {
  const { engravings } = props;

  return (
    <DetailPanel title="각인">
      <div className={styles['engraving-section']}>
        {engravings.map((engraving, index) => (
          <EngravingItem key={`${engraving.name}-${index}`} engraving={engraving} />
        ))}
      </div>
    </DetailPanel>
  );
}

function EngravingItem(props: { engraving: TLostarkEngraving }) {
  const { engraving } = props;
  const iconUrl = engraving.name ? engravingIconUrlByName[engraving.name] : undefined;

  return (
    <div className={styles['engraving-item']}>
      {iconUrl && (
        <ItemTooltipTrigger className={styles['icon-tooltip']}>
          <img src={iconUrl} alt="" className={styles['icon']} />
          <ItemTooltip>
            <EngravingTooltip engraving={engraving} />
          </ItemTooltip>
        </ItemTooltipTrigger>
      )}
      <p className={styles['name']}>{engraving.name ?? '-'}</p>
      <p className={`${styles['level-value']} ${engraving.level === 4 ? styles['max'] : ''}`}>
        &times;
        <span>{engraving.level ?? 0}</span>
      </p>
    </div>
  );
}
