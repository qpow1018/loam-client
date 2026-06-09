import styles from './summaryCharacterCell.module.scss';

export default function SummaryCharacterCell(props: { name: string; className: string }) {
  return (
    <div className={`${styles['character-cell']} ${props.className}`}>
      <strong className={styles['character-name']}>{props.name}</strong>
    </div>
  );
}
