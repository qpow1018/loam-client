import styles from './formRow.module.scss';

export default function FormRow(props: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles['form-row']}>
      <div className={styles['label-box']}>
        <p className={styles['label']}>{props.label}</p>
      </div>
      <div className={styles['content']}>{props.children}</div>
    </div>
  );
}
