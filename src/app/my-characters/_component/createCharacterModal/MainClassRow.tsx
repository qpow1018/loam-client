import type { TClassInfo } from '@/app/my-characters/_type/myCharacters';

import styles from './mainClassRow.module.scss';

export default function MainClassRow(props: {
  mainClassLabel: string;
  classInfos: TClassInfo[];
  currentClassValue: string | null;
  onClickClassValue: (value: string) => void;
}) {
  return (
    <div className={styles['main-class-row']}>
      {props.classInfos.map((item) => {
        const isSelected = item.value === props.currentClassValue;
        return (
          <button
            key={item.value}
            type="button"
            onClick={() => props.onClickClassValue(item.value)}
            className={`${styles['class-toggle']} ${isSelected ? styles['selected'] : ''}`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
