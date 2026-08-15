import type { TLostarkArkGrid } from '@/api/lostark/type';

import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';
import ItemSlot from '@/components/lostark/itemSlot/ItemSlot';

import ArkGridCoreTooltip from './ArkGridCoreTooltip';

import styles from './coreGrid.module.scss';

type TCoreGroup = {
  type: string;
  cores: TLostarkArkGrid['cores'];
};

export default function CoreGrid(props: {
  orderTypeCoreGroup: TCoreGroup;
  chaosTypeCoreGroup: TCoreGroup;
}) {
  const { orderTypeCoreGroup, chaosTypeCoreGroup } = props;

  return (
    <div className={styles['core-grid']}>
      <CoreGroup coreGroup={orderTypeCoreGroup} />
      <CoreGroup coreGroup={chaosTypeCoreGroup} />
    </div>
  );
}

function CoreGroup(props: { coreGroup: TCoreGroup }) {
  const { coreGroup } = props;

  return (
    <section className={styles['core-group']}>
      <h3 className={styles['core-group-title']}>{coreGroup.type}</h3>

      <div className={styles['core-list']}>
        {coreGroup.cores.map((core, index) => (
          <div key={`${core.name}-${index}`} className={styles['core-item']}>
            <ItemTooltipTrigger>
              <ItemSlot imageUrl={core.icon} grade={core.grade} size={44} />
              <ItemTooltip>
                <ArkGridCoreTooltip core={core} />
              </ItemTooltip>
            </ItemTooltipTrigger>

            <div className={styles['core-info']}>
              <p className={styles['core-name']}>{getCoreDisplayName(core.name)}</p>
              <p className={styles['core-point']}>{core.point ?? 0}P</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function getCoreDisplayName(name: string | null) {
  return name?.split(':').at(-1)?.trim() ?? '-';
}
