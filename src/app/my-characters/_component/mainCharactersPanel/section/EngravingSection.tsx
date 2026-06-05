import type { TLostarkEngraving } from '@/api/lostark/type';

import styles from './engravingSection.module.scss';

export default function EngravingSection(props: { engravings: TLostarkEngraving[] }) {
  return (
    <section className={styles['engraving-section']}>
      <h3 className={styles['title']}>각인</h3>

      <div className={styles['engraving-list']}>
        {props.engravings.map((engraving, index) => (
          <div key={index} className={styles['engraving-item']}>
            <div className={styles['name-box']}>
              <span className={styles['marker']} />
              <p className={styles['name']}>{engraving.name ?? '-'}</p>
            </div>

            <p
              className={`${styles['level-value']} ${
                engraving.level === 4 ? styles['max'] : ''
              }`}
            >
              &times;
              <span>{engraving.level ?? 0}</span>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
