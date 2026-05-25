import { MdUnfoldMore, MdDeleteOutline } from 'react-icons/md';

import IconButton from '@/components/common/button/IconButton';

import styles from './characterListItem.module.scss';

export default function CharacterListItem(props: {
  nickname: string;
  className: string;
  thumbnail: string;
  onClickMove: () => void;
  onClickDelete: () => void;
}) {
  return (
    <div className={styles['character-list-item']}>
      <IconButton
        size="small"
        onClick={props.onClickMove}
        className={styles['move-button']}
      >
        <MdUnfoldMore />
      </IconButton>

      <div className={styles['body']}>
        <div className={styles['thumbnail']}>
          <img src={props.thumbnail} alt="" />
        </div>

        <div className={styles['text-area']}>
          <p className={styles['nickname']}>{props.nickname}</p>
          <p className={styles['class-name']}>{props.className}</p>
        </div>
      </div>

      <IconButton onClick={props.onClickDelete}>
        <MdDeleteOutline />
      </IconButton>
    </div>
  );
}
