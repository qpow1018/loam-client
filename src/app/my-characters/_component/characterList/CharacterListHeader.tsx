import Button from '@/components/common/button/Button';

import styles from './characterListHeader.module.scss';

export default function CharacterListHeader(props: {
  onClickAdd: () => void;
}) {
  return (
    <div className={styles['character-list-header']}>
      <p className={styles['title']}>내 캐릭터 목록</p>

      <Button onClick={props.onClickAdd} theme="bg-pri">
        추가하기
      </Button>
    </div>
  );
}
