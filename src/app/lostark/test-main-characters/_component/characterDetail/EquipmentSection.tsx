import styles from './characterDetail.module.scss';

export default function EquipmentSection(props: { children: React.ReactNode }) {
  return (
    <section className={`${styles['section']} ${styles['equipment-section']}`}>
      <div className={styles['section-heading']}>
        <h2>장비</h2>
      </div>
      <div className={styles['section-body']}>{props.children}</div>
    </section>
  );
}
