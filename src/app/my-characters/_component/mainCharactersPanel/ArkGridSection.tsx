import type { TLostarkArkGrid } from '@/api/lostark/type';

import styles from './arkGridSection.module.scss';

export default function ArkGridSection(props: { arkGrid: TLostarkArkGrid }) {
  const { arkGrid } = props;

  return (
    <section className={styles['ark-grid-section']}>
      <div className={styles['section-header']}>
        <h3 className={styles['title']}>아크그리드</h3>
        <span className={styles['count']}>
          코어 {arkGrid.cores.length} · 효과 {arkGrid.effects.length}
        </span>
      </div>

      <div className={styles['section-content']}>
        <div className={styles['core-list']}>
          {arkGrid.cores.length > 0 ? (
            arkGrid.cores.map((core, index) => (
              <div key={`${core.name ?? 'ark-core'}-${index}`} className={styles['core-item']}>
                <div className={styles['core-icon']}>
                  {core.icon && <img src={core.icon} alt="" />}
                  {core.point !== null && <span className={styles['core-point']}>{core.point}</span>}
                </div>

                <div className={styles['core-info']}>
                  <span className={styles['core-name']}>{core.name ?? '-'}</span>
                  {core.grade && <span className={styles['grade']}>{core.grade}</span>}
                </div>
              </div>
            ))
          ) : (
            <p className={styles['empty']}>코어 정보 없음</p>
          )}
        </div>

        <div className={styles['effect-list']}>
          {arkGrid.effects.length > 0 ? (
            arkGrid.effects.map((effect, index) => (
              <div key={`${effect.name ?? 'ark-effect'}-${index}`} className={styles['effect-item']}>
                <span className={styles['effect-name']}>{effect.name ?? '-'}</span>
                {effect.level !== null && <span className={styles['effect-level']}>Lv. {effect.level}</span>}
              </div>
            ))
          ) : (
            <p className={styles['empty']}>효과 정보 없음</p>
          )}
        </div>
      </div>
    </section>
  );
}
