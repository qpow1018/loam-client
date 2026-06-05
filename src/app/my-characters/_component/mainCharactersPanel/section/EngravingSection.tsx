import type { TLostarkEngraving } from '@/api/lostark/type';

import styles from './engravingSection.module.scss';

export default function EngravingSection(props: { engravings: TLostarkEngraving[] }) {
  return (
    <section className={styles['engraving-section']}>
      <div className={styles['section-header']}>
        <h3 className={styles['title']}>각인</h3>
        <span className={styles['count']}>{props.engravings.length}개</span>
      </div>

      {props.engravings.length > 0 ? (
        <div className={styles['engraving-list']}>
          {props.engravings.map((engraving, index) => (
            <EngravingItem key={`${engraving.name ?? 'engraving'}-${index}`} engraving={engraving} />
          ))}
        </div>
      ) : (
        <p className={styles['empty']}>정보 없음</p>
      )}
    </section>
  );
}

function EngravingItem(props: { engraving: TLostarkEngraving }) {
  const { engraving } = props;

  return (
    <div className={styles['engraving-item']}>
      <div className={styles['name-line']}>
        <span className={styles['name']}>{engraving.name ?? '-'}</span>
        {engraving.level !== null && <span className={styles['level']}>Lv. {engraving.level}</span>}
      </div>

      <div className={styles['meta-line']}>
        {engraving.grade && <span className={styles['grade']}>{engraving.grade}</span>}
        {engraving.abilityStoneLevel !== null && (
          <span className={styles['stone-level']}>돌 +{engraving.abilityStoneLevel}</span>
        )}
      </div>

      {engraving.description && (
        <p className={styles['description']}>{engraving.description}</p>
      )}
    </div>
  );
}
