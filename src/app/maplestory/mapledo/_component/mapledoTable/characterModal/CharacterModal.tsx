'use client';

import { useEffect, useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';

import api from '@/api';
import type { TResMaplestoryMyCharacter } from '@/api/maplestory/type';
import type { TTaskTableColumn } from '@/types/taskTable';
import toast from '@/utils/toast';

import Button from '@/components/common/button/Button';
import IconButton from '@/components/common/button/IconButton';
import BoxLoading from '@/components/common/loading/BoxLoading';
import Confirm from '@/components/common/modal/Confirm';
import Modal from '@/components/common/modal/Modal';

import styles from './characterModal.module.scss';

export default function CharacterModal(props: {
  isOpen: boolean;
  onClose: () => void;
  editingData?: TTaskTableColumn;
  onSubmit: (column: TTaskTableColumn) => void;
  onDelete?: () => void;
}) {
  const { isOpen, onClose, editingData, onSubmit, onDelete } = props;

  const [allCharacters, setAllCharacters] = useState<TResMaplestoryMyCharacter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tempColumn, setTempColumn] = useState<TTaskTableColumn | null>(editingData ?? null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isEditMode = editingData !== undefined;
  const isSaveDisabled = tempColumn === null;

  useEffect(() => {
    async function getMyCharactersFromServer() {
      try {
        const response = await api.maplestory.getMyCharacters();
        setAllCharacters(response);
      } catch {
        toast.error('내 캐릭터 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    getMyCharactersFromServer();
  }, []);

  function handleSelectCharacter(character: TResMaplestoryMyCharacter) {
    setTempColumn((prev) => ({
      id: prev?.id ?? uuidv4(),
      name: character.nickname,
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

          {!isLoading && allCharacters.length === 0 && (
            <div className={styles['empty']}>
              <p>먼저 내 캐릭터를 추가해주세요.</p>
            </div>
          )}

          {!isLoading && allCharacters.length > 0 && (
            <div className={styles['grid']}>
              {allCharacters.map((character) => {
                const isSelected = tempColumn?.name === character.nickname;

                return (
                  <button
                    key={character.id}
                    type="button"
                    className={`${styles['card']} ${isSelected ? styles['selected'] : ''}`}
                    onClick={() => handleSelectCharacter(character)}
                  >
                    <span className={styles['class-name']}>{character.className}</span>
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
                className={styles['delete-btn']}
                onClick={() => setIsConfirmOpen(true)}
              >
                <MdDeleteOutline />
              </IconButton>
            )}

            <Button theme="bg-gray600" size="large" onClick={onClose}>
              취소
            </Button>
            <Button
              theme="bg-pri"
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
              theme: 'bg-gray600',
              onClick: () => setIsConfirmOpen(false),
            },
            {
              label: '삭제',
              theme: 'bg-sec',
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
