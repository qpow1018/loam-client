import type { TLostarkArkPassiveNode } from '@/api/lostark/type';

import styles from './arkPassiveTooltip.module.scss';

type TArkPassiveTooltipDetail = {
  label: string;
  value: string;
};

export default function ArkPassiveTooltip(props: { node: TLostarkArkPassiveNode }) {
  const { node } = props;
  const details = getNodeDetails(node);

  return (
    <div className={styles['ark-passive-tooltip']}>
      <div className={styles['header']}>
        <p className={styles['node-name']}>{node.name ?? '-'}</p>
        {node.category && <span className={styles['node-category']}>{node.category}</span>}
      </div>

      {details.length > 0 && (
        <div className={styles['detail-list']}>
          {details.map((detail) => (
            <span key={detail.label} className={styles['detail-item']}>
              <span className={styles['detail-label']}>{detail.label}</span>
              {detail.value}
            </span>
          ))}
        </div>
      )}

      {node.description && (
        <section className={styles['description-group']}>
          <p className={styles['description-label']}>효과</p>
          <p className={styles['description']}>{node.description}</p>
        </section>
      )}
    </div>
  );
}

function getNodeDetails(node: TLostarkArkPassiveNode) {
  return [
    { label: '티어', value: node.tier !== null ? `${node.tier}티어` : null },
    { label: '레벨', value: node.level !== null ? `Lv. ${node.level}` : null },
  ].filter((detail): detail is TArkPassiveTooltipDetail => detail.value !== null);
}
