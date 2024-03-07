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
    title: string;
    modalType: SubmitCharacterModalType;
  }
) {
  const allClassInfos = loaDB.getAllClassInfos();

  const [nickname, setNickname] = useState<string>('');

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={props.title}
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
            />
          )}
        </FormRow>

        <Box
          sx={{
            display: 'flex',
            borderTop: `1px solid ${theme.color.border.dark}`,
          }}
        >
          추가 or 수정
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
          theme={ButtonTheme.bdGray}
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