import { useState } from 'react';

import type { TResLostarkMyCharacter } from '@/api/lostark/type';
import { getClassImageUrl } from '@/utils/lostark';

import DraggableList, {
  type TDragHandleProps,
} from '@/components/common/draggableList/DraggableList';
import Button from '@/components/common/button/Button';
import IconButton from '@/components/common/button/IconButton';
import Confirm from '@/components/common/modal/Confirm';

import styles from './characterList.module.scss';

import { MdDragHandle, MdDeleteOutline } from 'react-icons/md';

export default function CharacterList(props: {
  characters: TResLostarkMyCharacter[];
  togglingMainCharacterId?: string | null;
  onReorder: (characters: TResLostarkMyCharacter[]) => void;
  onDeleteItem: (id: string) => void;
  onToggleMain: (character: TResLostarkMyCharacter) => void;
}) {
  return (
    <DraggableList<TResLostarkMyCharacter>
      items={props.characters}
      getId={(c) => c.id}
      direction="vertical"
      onReorder={props.onReorder}
    >
      {(character, { dragHandleProps }) => {
        return (
          <CharacterListItem
            nickname={character.nickname}
            className={character.className}
            itemLevel={character.itemLevel}
            thumbnail={getClassImageUrl(character.className)}
            isMain={character.isMain === true}
            isMainToggleLoading={props.togglingMainCharacterId === character.id}
            dragHandleProps={dragHandleProps}
            onToggleMain={() => props.onToggleMain(character)}
            onDelete={() => props.onDeleteItem(character.id)}
          />
        );
      }}
    </DraggableList>
  );
}

function CharacterListItem(props: {
  nickname: string;
  className: string;
  itemLevel: string;
  thumbnail?: string;
  isMain: boolean;
  isMainToggleLoading?: boolean;
  dragHandleProps: TDragHandleProps;
  onToggleMain: () => void;
  onDelete: () => void;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
            <div className={styles['nickname-line']}>
              <p className={styles['nickname']}>{props.nickname}</p>
              {props.isMain && <span className={styles['main-badge']}>메인</span>}
            </div>
            <p className={styles['class-name']}>
              {props.className} · {props.itemLevel}
            </p>
          </div>
        </div>

        <Button
          color="gray"
          fill="outline"
          size="small"
          isLoading={props.isMainToggleLoading}
          onClick={props.onToggleMain}
        >
          {props.isMain ? '메인 해제' : '메인 등록'}
        </Button>

        <IconButton aria-label="캐릭터 삭제" onClick={() => setIsConfirmOpen(true)}>
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
              color: 'gray',
              fill: 'solid',
              onClick: () => setIsConfirmOpen(false),
            },
            {
              label: '삭제',
              color: 'rose',
              fill: 'solid',
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
