import styles from './characterDetail.module.scss';

export default function DetailSection(props: {
  title: string;
  summary?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`${styles['section']} ${props.className ?? ''}`}>
      <div className={styles['section-heading']}>
        <h2>{props.title}</h2>
        {props.summary && <span>{props.summary}</span>}
      </div>
      <div className={styles['section-body']}>{props.children}</div>
    </section>
  );
}
