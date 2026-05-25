import styles from './formRow.module.scss';

export default function FormRow(props: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles['form-row']}>
      <span className={styles['form-row-label']}>{props.label}</span>
      <div className={styles['form-row-content']}>{props.children}</div>
    </div>
  );
}
