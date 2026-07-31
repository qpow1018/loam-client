import { useState } from 'react';

import type { TReqCreateMaplestoryMyCharacter } from '@/api/maplestory/type';

import Button from '@/components/common/button/Button';
import TextInput from '@/components/common/form/TextInput';
import Modal from '@/components/common/modal/Modal';

import styles from './createCharacterModal.module.scss';

export default function CreateCharacterModal(props: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (character: TReqCreateMaplestoryMyCharacter) => Promise<boolean>;
}) {
  const [nickname, setNickname] = useState('');
  const [className, setClassName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const trimmedNickname = nickname.trim();
  const trimmedClassName = className.trim();
  const isSubmitDisabled = trimmedNickname.length === 0 || trimmedClassName.length === 0;

  async function handleSubmit() {
    if (isSubmitDisabled || isSubmitting) return;

    setIsSubmitting(true);
    const isCreated = await props.onSubmit({
      nickname: trimmedNickname,
      className: trimmedClassName,
    });

    if (!isCreated) {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} title="캐릭터 등록" width={480}>
      <div className={styles['create-character-modal-content']}>
        <div className={styles['form-row']}>
          <span className={styles['label']}>닉네임</span>
          <TextInput
            value={nickname}
            onChange={setNickname}
            placeholder="캐릭터 닉네임을 입력하세요"
          />
        </div>

        <div className={styles['form-row']}>
          <span className={styles['label']}>직업</span>
          <TextInput
            value={className}
            onChange={setClassName}
            onPressEnter={handleSubmit}
            placeholder="직업을 입력하세요"
          />
        </div>

        <div className={styles['action-buttons']}>
          <Button color="gray" fill="solid" size="large" onClick={props.onClose}>
            취소
          </Button>
          <Button
            color="mint"
            fill="solid"
            size="large"
            className={styles['submit-button']}
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={isSubmitDisabled}
          >
            등록
          </Button>
        </div>
      </div>
    </Modal>
  );
}
