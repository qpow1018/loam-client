import styles from './boxLoading.module.scss';

export default function BoxLoading(props: {
  height?: number | string;
}) {
  const { height = 360 } = props;

  return (
    <div className={styles['box-loading']} style={{ height }}>
      <div className={styles['spinner']} />
    </div>
  );
}
