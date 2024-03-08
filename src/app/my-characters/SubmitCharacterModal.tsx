import React, { useState, useEffect } from 'react';
import { Box, ButtonBase } from '@mui/material';
import theme from '@/style/theme';

import { loaDB } from '@/libs';
import { LDB_ClassInfo } from '@/types/loaDB';

import Modal from '@/components/Modal';
import Text from '@/components/Text';
import TextInput from '@/components/Form/TextInput';
import Button, { ButtonTheme } from '@/components/Button';


export enum SubmitCharacterModalType {
  create = 'create',
  update = 'update',
}

export default function SubmitCharacterModal(
  props: {
    isOpen: boolean;
    onClose: () => void;
    modalType: SubmitCharacterModalType;
    createMyCharacter: (nickname: string, classValue: string) => void;
    updateMyCharacter: (nickname: string, classValue: string) => void;
  }
) {
  const allClassInfos = loaDB.getAllClassInfos();

  const [nickname, setNickname] = useState<string>('');
  const [classValue, setClassValue] = useState<string | null>(null);

  function handleClickSubmitButton() {
    const _nickname = nickname.trim();
    if (_nickname.length < 2) {
      alert('2글자 이상 입력해주세요.');
      return;
    }

    if (classValue === null) {
      alert('클래스를 선택하세요.');
      return;
    }

    if (props.modalType === SubmitCharacterModalType.create) {
      props.createMyCharacter(nickname, classValue);
      
    } else {
      props.updateMyCharacter(nickname, classValue);

    }
  }

  // TODO 추가할 기능
  // 모달 열릴때 인풋 포커스

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={
        props.modalType === SubmitCharacterModalType.create
        ? '캐릭터 추가하기'
        : '캐릭터 수정하기'
      }
      width={900}
    >
      <Box sx={{ padding: '16px' }}>
        <FormRow label='닉네임'>
          <TextInput
            value={nickname}
            onChange={(value) => setNickname(value)}
            placeholder='캐릭터 닉네임을 입력하세요'
            sx={{
              width: 280,
            }}
          />
        </FormRow>

        <FormRow label='클래스'>
          { allClassInfos.map(item =>
            <LoaClassRow
              key={item.mainClassInfo.value}
              mainClassLabel={item.mainClassInfo.label}
              classInfos={item.classes}
              currentClassValue={classValue}
              onClickClassValue={(value) => setClassValue(value)}
            />
          )}
        </FormRow>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            borderTop: `1px solid ${theme.color.border.dark}`,
            paddingTop: '12px',
          }}
        >
          <Button
            onClick={handleClickSubmitButton}
            theme={ButtonTheme.bgPri}
            sx={{
              width: 120,
              height: 40,
              fontSize: '0.813rem'
            }}
          >
            {
              props.modalType === SubmitCharacterModalType.create
              ? '추가하기'
              : '수정하기'
            }
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

function FormRow(
  props: {
    label: string;
    children: React.ReactNode;
  }
) {
  return (
    <Box
      sx={{
        display: 'flex',
        marginBottom: '12px'
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          width: '100px',
          height: theme.size.inputHeight,
        }}
      >
        <Text
          sx={{
            fontSize: '0.813rem',
            color: theme.color.text.secondary,
          }}
        >
          { props.label }
        </Text>
      </Box>

      <Box sx={{ width: '100%' }}>
        { props.children }
      </Box>
    </Box>
  );
}

function LoaClassRow(
  props: {
    mainClassLabel: string;
    classInfos: LDB_ClassInfo[];
    currentClassValue: string | null;
    onClickClassValue: (value: string) => void;
  }
) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '8px',
      }}
    >
      <Text
        sx={{
          flexShrink: 0,
          width: '80px',
          fontSize: '0.688rem',
          color: theme.color.text.secondary,
        }}
      >
        { props.mainClassLabel }
      </Text>

      { props.classInfos.map(item =>
        <Button
          key={item.value}
          onClick={() => props.onClickClassValue(item.value)}
          theme={item.value === props.currentClassValue ? ButtonTheme.bgGray : ButtonTheme.bdGray}
          isRound={true}
          sx={{
            width: '88px',
            height: '32px',
            fontSize: '0.688rem',
            marginLeft: '8px'
          }}
        >
          { item.label }
        </Button>
      )}
    </Box>
  );
}