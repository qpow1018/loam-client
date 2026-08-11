import styles from './characterDetail.module.scss';

export default function DetailSection(props: { title?: string; children?: React.ReactNode }) {
  return (
    <section className={styles['section']}>
      {props.title && (
        <div className={styles['section-heading']}>
          <h2>{props.title}</h2>
        </div>
      )}
      {props.children && <div className={styles['section-body']}>{props.children}</div>}
    </section>
  );
}
