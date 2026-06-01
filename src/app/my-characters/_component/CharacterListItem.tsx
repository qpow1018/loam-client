import { useState } from 'react';

import type { TDragHandleProps } from '@/components/common/draggableList/DraggableList';
import Button from '@/components/common/button/Button';
import IconButton from '@/components/common/button/IconButton';
import Confirm from '@/components/common/modal/Confirm';

import styles from './characterListItem.module.scss';

import { MdDragHandle, MdDeleteOutline } from 'react-icons/md';

export default function CharacterListItem(props: {
  nickname: string;
  className: string;
  itemLevel: string;
  thumbnail?: string;
  dragHandleProps: TDragHandleProps;
  onDelete: () => void;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const lopecUrl = `https://lopec.kr/character/specPoint/${encodeURIComponent(props.nickname)}`;

  return (
    <>
      <div className={styles['character-list-item']}>
        <button
          type="button"
          {...props.dragHandleProps}
          className={styles['drag-handle']}
          aria-label="순서 변경"
        >
          <MdDragHandle />
        </button>

        <div className={styles['info']}>
          <div className={styles['thumbnail']}>
            {props.thumbnail && <img src={props.thumbnail} alt="" />}
          </div>

          <div className={styles['labels']}>
            <p className={styles['nickname']}>{props.nickname}</p>
            <p className={styles['class-name']}>
              {props.className} · {props.itemLevel}
            </p>
          </div>
        </div>

        <Button
          theme="bg-gray600"
          size="small"
          onClick={() => window.open(lopecUrl, '_blank', 'noopener,noreferrer')}
        >
          로펙
        </Button>

        <IconButton onClick={() => setIsConfirmOpen(true)}>
          <MdDeleteOutline />
        </IconButton>
      </div>

      {isConfirmOpen && (
        <Confirm
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          title="캐릭터 삭제"
          message={`'${props.nickname}' 캐릭터를 삭제하시겠어요?`}
          buttons={[
            {
              label: '취소',
              theme: 'bg-gray600',
              onClick: () => setIsConfirmOpen(false),
            },
            {
              label: '삭제',
              theme: 'bg-sec',
              onClick: () => {
                setIsConfirmOpen(false);
                props.onDelete();
              },
            },
          ]}
        />
      )}
    </>
  );
}
