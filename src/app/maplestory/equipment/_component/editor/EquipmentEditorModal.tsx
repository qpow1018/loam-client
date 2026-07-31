'use client';

import { useState } from 'react';

import type {
  TMaplestoryEquipmentState,
  TMaplestoryEquipmentStatePatch,
} from '@/api/maplestory/type';
import type { TEquipmentEditor } from '@/app/maplestory/equipment/_type/equipmentEditor';

import Button from '@/components/common/button/Button';
import TextInput from '@/components/common/form/TextInput';
import Modal from '@/components/common/modal/Modal';
import SpecEditorFields, { type TEquipmentSpecForm } from './SpecEditorFields';

import styles from './equipmentEditorModal.module.scss';

export default function EquipmentEditorModal(props: {
  editor: TEquipmentEditor;
  state: TMaplestoryEquipmentState | undefined;
  onClose: () => void;
  onSubmit: (patch: TMaplestoryEquipmentStatePatch) => Promise<boolean>;
}) {
  const { editor, state, onClose, onSubmit } = props;
  const [value, setValue] = useState(() => getInitialValue(editor, state));
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit() {
    if (isSaving) return;

    setIsSaving(true);
    const isSaved = await onSubmit(getPatch(editor, value));
    setIsSaving(false);

    if (isSaved) {
      onClose();
    }
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`${editor.slotName} ${getEditorTitle(editor)}`}
      isDismissable={!isSaving}
      isShowCloseButton={!isSaving}
      width={editor.kind === 'spec' ? 860 : 480}
    >
      <div className={styles['equipment-editor-modal']}>
        {editor.kind === 'spec' ? (
          <SpecEditorFields
            value={value as TEquipmentSpecForm}
            onChange={(nextValue) => setValue(nextValue)}
          />
        ) : (
          <SingleValueEditor editor={editor} value={value as string} onChange={setValue} />
        )}

        <div className={styles['action-buttons']}>
          <Button color="gray" fill="solid" size="large" isDisabled={isSaving} onClick={onClose}>
            취소
          </Button>
          <Button
            color="rose"
            fill="solid"
            size="large"
            isLoading={isSaving}
            onClick={handleSubmit}
          >
            저장
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function SingleValueEditor(props: {
  editor: TEquipmentEditor;
  value: string;
  onChange: (value: string) => void;
}) {
  const { editor, value, onChange } = props;
  const placeholder = getPlaceholder(editor);

  return (
    <label className={styles['form-row']}>
      <span>{getEditorTitle(editor)}</span>
      <TextInput value={value} placeholder={placeholder} onChange={onChange} />
    </label>
  );
}

function getInitialValue(
  editor: TEquipmentEditor,
  state: TMaplestoryEquipmentState | undefined,
): string | TEquipmentSpecForm {
  switch (editor.kind) {
    case 'itemName':
      return state?.itemName ?? '';
    case 'goal':
      return state?.goal ?? '';
    case 'purchasePrice':
      return state?.purchasePrice ?? '';
    case 'spec':
      return {
        starforce: state?.starforce ?? '',
        bonusOption: state?.bonusOption ?? '',
        scroll: state?.scroll ?? '',
        potential: state?.potential ?? '',
        additionalPotential: state?.additionalPotential ?? '',
        extra: state?.extra ?? '',
      };
  }
}

function getPatch(
  editor: TEquipmentEditor,
  value: string | TEquipmentSpecForm,
): TMaplestoryEquipmentStatePatch {
  switch (editor.kind) {
    case 'itemName':
      return { itemName: value as string };
    case 'goal':
      return { goal: value as string };
    case 'purchasePrice':
      return { purchasePrice: value as string };
    case 'spec':
      return value as TEquipmentSpecForm;
  }
}

function getEditorTitle(editor: TEquipmentEditor): string {
  switch (editor.kind) {
    case 'itemName':
      return '장비명';
    case 'spec':
      return '현재 스펙';
    case 'goal':
      return '목표';
    case 'purchasePrice':
      return '구매 시세';
  }
}

function getPlaceholder(editor: TEquipmentEditor): string {
  switch (editor.kind) {
    case 'itemName':
      return '예: 아케인 장갑, 에스텔라';
    case 'goal':
      return '예: 22성 · 윗잠 27%';
    case 'purchasePrice':
      return '예: 120억';
    case 'spec':
      return '';
  }
}
