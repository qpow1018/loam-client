import styles from './detailPanel.module.scss';

export default function DetailPanel(props: { title?: string; children?: React.ReactNode }) {
  return (
    <section className={styles['panel']}>
      {props.title && (
        <header className={styles['header']}>
          <h2>{props.title}</h2>
        </header>
      )}
      {props.children && <div className={styles['content']}>{props.children}</div>}
    </section>
  );
}
