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

  // TODO 추가할 기능
  // 모달 열릴때 인풋 포커스

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="캐릭터 추가하기"
      width={900}
    >
      <div className={styles['body']}>
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

        <div className={styles['footer']}>
          <Button
            onClick={() => props.onSubmit(nickname, classValue)}
            theme="bg-pri"
            size="medium"
            className={styles['add-button']}
          >
            추가하기
          </Button>
        </div>
      </div>
    </Modal>
  );
}
