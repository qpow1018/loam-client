'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import type { TLoadoDataRow } from '@/app/lostark/loado/_type/loado';
import { PERIOD_OPTIONS, TYPE_OPTIONS } from '@/app/lostark/loado/_define/options';

import Modal from '@/components/common/modal/Modal';
import Confirm from '@/components/common/modal/Confirm';
import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import Button from '@/components/common/button/Button';
import IconButton from '@/components/common/button/IconButton';
import TextInput from '@/components/common/form/TextInput';
import IconPickerModal from '@/app/lostark/loado/_component/loadoTable/iconPickerModal/IconPickerModal';
import FormRow from '@/app/lostark/loado/_component/loadoTable/FormRow';

import styles from './taskModal.module.scss';

import { MdDeleteOutline } from 'react-icons/md';

const EMPTY_ROW: TLoadoDataRow = {
  kind: 'data',
  id: '',
  name: '',
  resetPeriod: 'daily',
  role: 'checkbox',
};

export default function TaskModal(props: {
  isOpen: boolean;
  onClose: () => void;
  editingData?: TLoadoDataRow;
  onSubmit: (row: TLoadoDataRow) => void;
  onDelete?: () => void;
}) {
  const { isOpen, onClose, editingData, onSubmit, onDelete } = props;

  const [tempRow, setTempRow] = useState<TLoadoDataRow>(editingData ?? EMPTY_ROW);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);

  const isEdit = editingData !== undefined;
  const trimmedName = tempRow.name.trim();
  const isSaveDisabled = trimmedName === '';

  function handleChangeTempRow(updates: Partial<TLoadoDataRow>) {
    setTempRow((prev) => ({ ...prev, ...updates }));
  }

  function handleSave() {
    if (isSaveDisabled) return;

    onSubmit({
      ...tempRow,
      id: isEdit ? tempRow.id : uuidv4(),
      name: trimmedName,
    });
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEdit ? '할일 수정' : '할일 추가'}
        width={600}
      >
        <div className={styles['task-modal-content']}>
          <FormRow label="기본 주기">
            <ButtonGroup
              options={PERIOD_OPTIONS}
              value={tempRow.resetPeriod}
              onChange={(resetPeriod) => handleChangeTempRow({ resetPeriod })}
            />
          </FormRow>

          <FormRow label="기본 타입">
            <ButtonGroup
              options={TYPE_OPTIONS}
              value={tempRow.role}
              onChange={(role) => handleChangeTempRow({ role })}
            />
          </FormRow>

          <FormRow label="이름">
            <TextInput
              value={tempRow.name}
              onChange={(name) => handleChangeTempRow({ name })}
              placeholder="할일 이름"
              onPressEnter={handleSave}
            />
          </FormRow>

          <FormRow label="아이콘">
            <button
              type="button"
              className={styles['icon-trigger']}
              onClick={() => setIsIconPickerOpen(true)}
            >
              {tempRow.iconUrl !== undefined ? (
                <img src={tempRow.iconUrl} alt="" />
              ) : (
                <span>선택</span>
              )}
            </button>
          </FormRow>

          <div className={styles['action-buttons']}>
            {isEdit && onDelete !== undefined && (
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

      <IconPickerModal
        isOpen={isIconPickerOpen}
        onClose={() => setIsIconPickerOpen(false)}
        value={tempRow.iconUrl}
        onSelect={(iconUrl) => handleChangeTempRow({ iconUrl })}
      />

      {onDelete !== undefined && (
        <Confirm
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          title="할일 삭제"
          message={'이 할일을 삭제하시겠어요?\n관련된 셀 데이터도 함께 삭제됩니다.'}
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
