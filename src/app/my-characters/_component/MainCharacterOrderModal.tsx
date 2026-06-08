'use client';

import { useState } from 'react';
import { MdDragHandle } from 'react-icons/md';

import type { TResLostarkMainCharacter } from '@/api/lostark/type';
import { getClassImageUrl } from '@/utils/lostark';

import Button from '@/components/common/button/Button';
import DraggableList, {
  type TDragHandleProps,
} from '@/components/common/draggableList/DraggableList';
import Modal from '@/components/common/modal/Modal';

import styles from './mainCharacterOrderModal.module.scss';

export default function MainCharacterOrderModal(props: {
  isOpen: boolean;
  isSaving?: boolean;
  characters: TResLostarkMainCharacter[];
  onClose: () => void;
  onSubmit: (characters: TResLostarkMainCharacter[]) => void;
}) {
  const [draftCharacters, setDraftCharacters] = useState(props.characters);

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="메인캐릭터 순서변경"
      isDismissable={!props.isSaving}
      isShowCloseButton={!props.isSaving}
    >
      <div className={styles['main-character-order-modal']}>
        <DraggableList<TResLostarkMainCharacter>
          items={draftCharacters}
          getId={(character) => character.id}
          direction="vertical"
          onReorder={setDraftCharacters}
        >
          {(character, { dragHandleProps }) => (
            <OrderCharacterItem character={character} dragHandleProps={dragHandleProps} />
          )}
        </DraggableList>

        <div className={styles['action-buttons']}>
          <Button
            theme="bg-gray600"
            size="large"
            onClick={props.onClose}
            isDisabled={props.isSaving}
          >
            취소
          </Button>
          <Button
            theme="bg-pri"
            size="large"
            className={styles['submit-btn']}
            onClick={() => props.onSubmit(draftCharacters)}
            isLoading={props.isSaving}
          >
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function OrderCharacterItem(props: {
  character: TResLostarkMainCharacter;
  dragHandleProps: TDragHandleProps;
}) {
  const classImageUrl = getClassImageUrl(props.character.characterClass);

  return (
    <div className={styles['character-item']}>
      <button
        type="button"
        {...props.dragHandleProps}
        className={styles['drag-handle']}
        aria-label="순서 변경"
      >
        <MdDragHandle />
      </button>

      <div className={styles['thumbnail']}>
        {classImageUrl && <img src={classImageUrl} alt="" />}
      </div>

      <div className={styles['character-info']}>
        <p className={styles['character-name']}>{props.character.characterName}</p>
        <p className={styles['character-meta']}>
          {props.character.characterClass} · {props.character.itemLevel}
        </p>
      </div>
    </div>
  );
}
