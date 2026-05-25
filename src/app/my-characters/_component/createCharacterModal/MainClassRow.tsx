import Button from '@/components/common/button/Button';

import type { TClassInfo } from '@/app/my-characters/_type/lostark';

import styles from './mainClassRow.module.scss';

export default function MainClassRow(props: {
  mainClassLabel: string;
  classInfos: TClassInfo[];
  currentClassValue: string | null;
  onClickClassValue: (value: string) => void;
}) {
  return (
    <div className={styles['main-class-row']}>
      <p className={styles['label']}>{props.mainClassLabel}</p>

      {props.classInfos.map((item) => (
        <Button
          key={item.value}
          onClick={() => props.onClickClassValue(item.value)}
          theme={item.value === props.currentClassValue ? 'bg-gray600' : 'bd-gray'}
          isRound={true}
          size="small"
          className={styles['class-toggle']}
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
