'use client';

import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { TResLostarkMyCharacter } from '@/api/lostark/type';
import lostarkQuery from '@/queries/lostarkQuery';
import type { TTaskTableColumn } from '@/types/taskTable';
import { getClassImageUrl } from '@/utils/lostark';
import toast from '@/utils/toast';

import BoxLoading from '@/components/common/loading/BoxLoading';
import Modal from '@/components/common/modal/Modal';
import Confirm from '@/components/common/modal/Confirm';
import Button from '@/components/common/button/Button';
import IconButton from '@/components/common/button/IconButton';

import styles from './characterModal.module.scss';

import { MdDeleteOutline } from 'react-icons/md';

export default function CharacterModal(props: {
  isOpen: boolean;
  onClose: () => void;
  editingData?: TTaskTableColumn;
  onSubmit: (column: TTaskTableColumn) => void;
  onDelete?: () => void;
}) {
  const { isOpen, onClose, editingData, onSubmit, onDelete } = props;

  const [tempColumn, setTempColumn] = useState<TTaskTableColumn | null>(editingData ?? null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const { data: allCharacters = [], isLoading, isError } = lostarkQuery.useGetMyCharacters();

  const isEditMode = editingData !== undefined;
  const isSaveDisabled = tempColumn === null;

  useEffect(() => {
    if (isError) {
      toast.error('내 캐릭터 목록을 불러오지 못했습니다.');
    }
  }, [isError]);

  function handleSelectCharacter(character: TResLostarkMyCharacter) {
    setTempColumn((prev) => ({
      id: prev?.id ?? uuidv4(),
      name: character.nickname,
      imageUrl: getClassImageUrl(character.className),
    }));
  }

  function handleSave() {
    if (tempColumn === null) return;
    onSubmit(tempColumn);
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEditMode ? '캐릭터 수정' : '캐릭터 추가'}
        width={800}
      >
        <div className={styles['character-modal-content']}>
          {isLoading && <BoxLoading height={240} />}

          {!isLoading && !isError && allCharacters.length === 0 && (
            <div className={styles['empty']}>
              <p>먼저 내 캐릭터를 추가해주세요.</p>
            </div>
          )}

          {!isLoading && allCharacters.length > 0 && (
            <div className={styles['grid']}>
              {allCharacters.map((character) => {
                const classImageUrl = getClassImageUrl(character.className);
                const isSelected = tempColumn?.name === character.nickname;
                return (
                  <button
                    key={character.id}
                    type="button"
                    className={`${styles['card']} ${isSelected ? styles['selected'] : ''}`}
                    onClick={() => handleSelectCharacter(character)}
                  >
                    <div className={styles['thumbnail']}>
                      {classImageUrl && <img src={classImageUrl} alt="" />}
                    </div>
                    <span className={styles['nickname']}>{character.nickname}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div className={styles['action-buttons']}>
            {isEditMode && onDelete !== undefined && (
              <IconButton
                size="large"
                aria-label="캐릭터 삭제"
                className={styles['delete-btn']}
                onClick={() => setIsConfirmOpen(true)}
              >
                <MdDeleteOutline />
              </IconButton>
            )}

            <Button color="gray" fill="solid" size="large" onClick={onClose}>
              취소
            </Button>
            <Button
              color="mint"
              fill="solid"
              size="large"
              className={styles['submit-btn']}
              onClick={handleSave}
              isDisabled={isSaveDisabled}
            >
              저장
            </Button>
          </div>
        </div>
      </Modal>

      {isEditMode && onDelete !== undefined && (
        <Confirm
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          title="캐릭터 삭제"
          message={'이 캐릭터를 삭제하시겠어요?\n관련된 셀 데이터도 함께 삭제됩니다.'}
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
                onDelete();
              },
            },
          ]}
        />
      )}
    </>
  );
}
