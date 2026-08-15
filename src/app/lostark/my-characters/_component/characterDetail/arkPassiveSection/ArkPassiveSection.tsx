import type { TLostarkArkPassive, TLostarkArkPassiveNode } from '@/api/lostark/type';

import { ItemTooltip, ItemTooltipTrigger } from '@/components/lostark/itemTooltip/ItemTooltip';
import DetailPanel from '@/app/lostark/my-characters/_component/characterDetail/DetailPanel';

import ArkPassiveTooltip from './ArkPassiveTooltip';

import styles from './arkPassiveSection.module.scss';

const ARK_PASSIVE_CATEGORIES = ['진화', '깨달음', '도약'] as const;

export default function ArkPassiveSection(props: { arkPassive: TLostarkArkPassive }) {
  const { arkPassive } = props;

  const categoryGroups = getCategoryGroups(arkPassive);

  return (
    <DetailPanel title="아크 패시브" className={styles['ark-passive-section']}>
      {categoryGroups.map((categoryGroup) => (
        <section key={categoryGroup.category} className={styles['category-section']}>
          <div className={styles['category-header']}>
            <div className={styles['category-title']}>
              <span className={styles['category-name']}>{categoryGroup.category}</span>
              <span className={styles['category-point']}>{categoryGroup.point?.value}P</span>
            </div>
            <p className={styles['category-description']}>{categoryGroup.point?.description}</p>
          </div>

          <div className={styles['node-list']}>
            {categoryGroup.nodes.map((node, index) => (
              <NodeItem key={`${node.name ?? 'node'}-${index}`} node={node} />
            ))}
          </div>
        </section>
      ))}
    </DetailPanel>
  );
}

function NodeItem(props: { node: TLostarkArkPassiveNode }) {
  const { node } = props;

  return (
    <div className={styles['node-item']}>
      {node.icon && (
        <ItemTooltipTrigger>
          <img src={node.icon} alt="" className={styles['node-icon']} />
          <ItemTooltip>
            <ArkPassiveTooltip node={node} />
          </ItemTooltip>
        </ItemTooltipTrigger>
      )}
      <span className={styles['node-name']}>{node.name ?? '-'}</span>
      {node.level !== null && <span className={styles['node-level']}>{`Lv. ${node.level}`}</span>}
    </div>
  );
}

function getCategoryGroups(arkPassive: TLostarkArkPassive) {
  return ARK_PASSIVE_CATEGORIES.map((category) => ({
    category,
    point: arkPassive.points.find((point) => point.name === category),
    nodes: arkPassive.nodes.filter((node) => node.category === category),
  }));
}
