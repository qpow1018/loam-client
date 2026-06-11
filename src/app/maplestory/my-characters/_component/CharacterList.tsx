import { useState } from 'react';
import { MdDeleteOutline, MdDragHandle } from 'react-icons/md';

import type { TResMaplestoryMyCharacter } from '@/api/maplestory/type';

import Button from '@/components/common/button/Button';
import IconButton from '@/components/common/button/IconButton';
import DraggableList, {
  type TDragHandleProps,
} from '@/components/common/draggableList/DraggableList';
import Confirm from '@/components/common/modal/Confirm';

import styles from './characterList.module.scss';

export default function CharacterList(props: {
  characters: TResMaplestoryMyCharacter[];
  deletingCharacterId: string | null;
  onReorder: (characters: TResMaplestoryMyCharacter[]) => void;
  onDeleteItem: (id: string) => void;
}) {
  return (
    <DraggableList<TResMaplestoryMyCharacter>
      items={props.characters}
      getId={(character) => character.id}
      direction="vertical"
      onReorder={props.onReorder}
    >
      {(character, { dragHandleProps }) => (
        <CharacterListItem
          nickname={character.nickname}
          className={character.className}
          isDeleting={props.deletingCharacterId === character.id}
          dragHandleProps={dragHandleProps}
          onDelete={() => props.onDeleteItem(character.id)}
        />
      )}
    </DraggableList>
  );
}

function CharacterListItem(props: {
  nickname: string;
  className: string;
  isDeleting: boolean;
  dragHandleProps: TDragHandleProps;
  onDelete: () => void;
}) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  function handleOpenMaplescouter() {
    const url = `https://maplescouter.com/ko/info?name=${encodeURIComponent(props.nickname)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

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

        <div className={styles['character-info']}>
          <p className={styles['class-name']}>{props.className}</p>
          <p className={styles['nickname']}>{props.nickname}</p>
        </div>

        <Button theme="bg-gray600" size="medium" onClick={handleOpenMaplescouter}>
          환산주스탯
        </Button>

        <IconButton isDisabled={props.isDeleting} onClick={() => setIsConfirmOpen(true)}>
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
