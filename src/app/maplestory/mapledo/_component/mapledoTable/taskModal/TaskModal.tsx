'use client';

import { useState } from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';

import { PERIOD_OPTIONS, TYPE_OPTIONS } from '@/app/maplestory/mapledo/_define/options';
import type { TTaskTableDataRow } from '@/types/taskTable';

import Button from '@/components/common/button/Button';
import IconButton from '@/components/common/button/IconButton';
import ButtonGroup from '@/components/common/buttonGroup/ButtonGroup';
import TextInput from '@/components/common/form/TextInput';
import Confirm from '@/components/common/modal/Confirm';
import Modal from '@/components/common/modal/Modal';
import FormRow from '@/components/taskTable/FormRow';

import styles from './taskModal.module.scss';

const EMPTY_ROW: TTaskTableDataRow = {
  kind: 'data',
  id: '',
  name: '',
  resetPeriod: 'daily',
  role: 'checkbox',
};

export default function TaskModal(props: {
  isOpen: boolean;
  onClose: () => void;
  editingData?: TTaskTableDataRow;
  onSubmit: (row: TTaskTableDataRow) => void;
  onDelete?: () => void;
}) {
  const { isOpen, onClose, editingData, onSubmit, onDelete } = props;

  const [tempRow, setTempRow] = useState<TTaskTableDataRow>(() =>
    normalizeEditingData(editingData),
  );
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isEditMode = editingData !== undefined;
  const trimmedName = tempRow.name.trim();
  const isSaveDisabled = trimmedName === '';

  function handleChangeTempRow(updates: Partial<TTaskTableDataRow>) {
    setTempRow((prev) => ({ ...prev, ...updates }));
  }

  function handleSave() {
    if (isSaveDisabled) return;

    onSubmit({
      ...tempRow,
      id: isEditMode ? tempRow.id : uuidv4(),
      name: trimmedName,
    });
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEditMode ? '할일 수정' : '할일 추가'}
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
          title="할일 삭제"
          message={'이 할일을 삭제하시겠어요?\n관련된 셀 데이터도 함께 삭제됩니다.'}
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

function normalizeEditingData(editingData?: TTaskTableDataRow): TTaskTableDataRow {
  if (editingData === undefined) return EMPTY_ROW;
  if (editingData.role === 'checkbox' || editingData.role === 'text') return editingData;
  return { ...editingData, role: 'checkbox' };
}
