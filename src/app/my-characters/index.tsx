'use client'

import { useState } from 'react';
import { Box } from '@mui/material';

import theme from '@/style/theme';

import Layout from '@/components/Layout';
import BoxSection from '@/components/BoxSection';
import Text from '@/components/Text';
import TextInput from '@/components/Form/TextInput';
import Button, { ButtonTheme } from '@/components/Button';

export default function MyCharacters() {

  const [characterNameToAdd, setCharacterNameToAdd] = useState<string>('');

  function handleSubmitCharacterName(characterName: string) {
    console.log('엔터 체크');
  }

  return (
    <Layout>
      <Box
        sx={{
          padding: '24px 16px'
        }}
      >
        <AddCharacterPanel
          characterNameToAdd={characterNameToAdd}
          onChangeCharacterNameToAdd={(value) => setCharacterNameToAdd(value)}
          onSubmitCharacterName={() => handleSubmitCharacterName(characterNameToAdd)}
        />

        <BoxSection
          sx={{
            width: '1024px',
            padding: '16px',
          }}
        >
          내캐릭 리스트
        </BoxSection>
      </Box>
    </Layout>
  );
}

function AddCharacterPanel(
  props: {
    characterNameToAdd: string;
    onChangeCharacterNameToAdd: (value: string) => void;
    onSubmitCharacterName: () => void;
  }
) {
  return (
    <BoxSection
      sx={{
        width: '1024px',
        padding: '16px',
        marginBottom: '24px'
      }}
    >
      <Text
        sx={{
          fontSize: '0.75rem',
          fontWeight: 500,
          marginBottom: '8px',
          color: theme.color.text.secondary,
        }}
      >
        캐릭터 추가
      </Text>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            flex: 1,
            marginRight: '16px'
          }}
        >
          <TextInput
            value={props.characterNameToAdd}
            onChange={props.onChangeCharacterNameToAdd}
            placeholder='캐릭터 이름을 입력하세요'
            onPressEnter={props.onSubmitCharacterName}
          />
        </Box>

        <Button
          onClick={props.onSubmitCharacterName}
          theme={ButtonTheme.bgPri}
        >
          추가하기
        </Button>
      </Box>
    </BoxSection>
  );
}