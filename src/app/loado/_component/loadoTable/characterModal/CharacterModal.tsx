'use client';

import { useState } from 'react';

import type { TLoadoColumn } from '@/app/loado/_type/loado';

import Modal from '@/components/common/modal/Modal';
import Confirm from '@/components/common/modal/Confirm';
import Button from '@/components/common/button/Button';
import IconButton from '@/components/common/button/IconButton';
import TextInput from '@/components/common/form/TextInput';
import FormRow from '@/app/loado/_component/loadoTable/FormRow';

import styles from './characterModal.module.scss';

import { MdDeleteOutline } from 'react-icons/md';

export default function CharacterModal(props: {
  isOpen: boolean;
  onClose: () => void;
  editingData: TLoadoColumn;
  onSubmit: (column: TLoadoColumn) => void;
  onDelete: () => void;
}) {
  const { isOpen, onClose, editingData, onSubmit, onDelete } = props;

  const [tempColumn, setTempColumn] = useState<TLoadoColumn>(editingData);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const trimmedName = tempColumn.name.trim();
  const isSaveDisabled = trimmedName === '';

  function handleChangeTempColumn(updates: Partial<TLoadoColumn>) {
    setTempColumn((prev) => ({ ...prev, ...updates }));
  }

  function handleSave() {
    if (isSaveDisabled) return;
    onSubmit({ ...tempColumn, name: trimmedName });
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="캐릭터 수정" width={600}>
        <div className={styles['character-modal-content']}>
          <FormRow label="이름">
            <TextInput
              value={tempColumn.name}
              onChange={(name) => handleChangeTempColumn({ name })}
              placeholder="캐릭터 이름"
              onPressEnter={handleSave}
            />
          </FormRow>

          <div className={styles['action-buttons']}>
            <IconButton
              size="large"
              className={styles['delete-btn']}
              onClick={() => setIsConfirmOpen(true)}
            >
              <MdDeleteOutline />
            </IconButton>

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
    </>
  );
}

