import { useState } from 'react';

import { getAllClassInfos } from '@/app/my-characters/_util/lostark';

import Modal from '@/components/common/modal/Modal';
import TextInput from '@/components/common/form/TextInput';
import Button from '@/components/common/button/Button';
import FormRow from './FormRow';
import MainClassRow from './MainClassRow';

import styles from './createCharacterModal.module.scss';

export default function CreateCharacterModal(props: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nickname: string, classValue: string | null) => void;
}) {
  const [nickname, setNickname] = useState('');
  const [classValue, setClassValue] = useState<string | null>(null);

  const allClassInfos = getAllClassInfos();

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} title="캐릭터 추가하기" width={900}>
      <div className={styles['create-character-modal-content']}>
        <FormRow label="닉네임">
          <TextInput
            value={nickname}
            onChange={setNickname}
            placeholder="캐릭터 닉네임을 입력하세요"
            className={styles['nickname-input']}
          />
        </FormRow>

        <FormRow label="클래스">
          {allClassInfos.map((item) => (
            <MainClassRow
              key={item.mainClassInfo.value}
              mainClassLabel={item.mainClassInfo.label}
              classInfos={item.classes}
              currentClassValue={classValue}
              onClickClassValue={setClassValue}
            />
          ))}
        </FormRow>

        <div className={styles['action-buttons']}>
          <Button theme="bg-gray600" size="large" onClick={props.onClose}>
            취소
          </Button>
          <Button
            theme="bg-pri"
            size="large"
            className={styles['submit-btn']}
            onClick={() => props.onSubmit(nickname, classValue)}
          >
            추가
          </Button>
        </div>
      </div>
    </Modal>
  );
}
