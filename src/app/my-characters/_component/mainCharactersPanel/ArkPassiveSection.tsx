import type { TLostarkArkPassive } from '@/api/lostark/type';

import styles from './arkPassiveSection.module.scss';

export default function ArkPassiveSection(props: { arkPassive: TLostarkArkPassive }) {
  const { arkPassive } = props;

  return (
    <section className={styles['ark-passive-section']}>
      <div className={styles['section-header']}>
        <div className={styles['title-group']}>
          <h3 className={styles['title']}>아크패시브</h3>
          {arkPassive.title && <span className={styles['ark-title']}>{arkPassive.title}</span>}
        </div>
        <span className={styles['count']}>{arkPassive.points.length}개</span>
      </div>

      {arkPassive.points.length > 0 ? (
        <div className={styles['point-list']}>
          {arkPassive.points.map((point, index) => (
            <div key={`${point.name ?? 'ark-passive'}-${index}`} className={styles['point-item']}>
              <div className={styles['point-header']}>
                <span className={styles['point-name']}>{point.name ?? '-'}</span>
                {point.value !== null && <span className={styles['point-value']}>{point.value}</span>}
              </div>

              {point.description && <p className={styles['description']}>{point.description}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className={styles['empty']}>정보 없음</p>
      )}
    </section>
  );
}
