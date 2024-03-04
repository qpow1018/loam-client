'use client'

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';

import theme from '@/style/theme';

import API from '@/api';
import { ResMyCharacterInfo } from '@/types/api';

import Layout from '@/components/Layout';
import BoxSection from '@/components/BoxSection';
import Text from '@/components/Text';
import TextInput from '@/components/Form/TextInput';
import Button, { ButtonTheme } from '@/components/Button';

export default function MyCharacters() {
  const [characterList, setCharacterList] = useState<ResMyCharacterInfo[]>([]);
  const [isLoadedCharacterList, setIsLoadedCharacterList] = useState<boolean>(false);
  const [characterNameToAdd, setCharacterNameToAdd] = useState<string>('');

  useEffect(() => {
    setupMyCharacterListFromServer();
  }, []);

  async function setupMyCharacterListFromServer() {
    try {
      const resData = await API.getMyCharacters();
      setCharacterList(resData);
      setIsLoadedCharacterList(true);

    } catch (error) {
      console.error('setupMyCharacterListFromServer', error);
      // TODO error snackbar 만들기
    }
  }

  // TODO 궁금증 - 이 함수에 async await을 걸고 안걸고 차이 - 프로세스, 스레드 관련?
  function handleSubmitCharacterName(characterName: string) {
    // TODO 로딩 대기 추가

    const _characterName = characterName.trim();

    // 글자수 체크
    if (_characterName.length < 2) {
      // TODO 스낵바
      alert('2글자 이상 입력하세요.');
      return;
    }

    // 중복 체크
    const matchedItemIndex = [ ...characterList ].findIndex(item => item.name === characterName);
    console.log('matchedItemIndex', matchedItemIndex);
    if (matchedItemIndex >= 0) {
      // TODO 스낵바
      alert('이미 추가된 캐릭터입니다.');
      return;
    }

    addMyCharacterFromServer(_characterName);
  }

  async function addMyCharacterFromServer(characterName: string) {
    try {
      const resData = await API.addMyCharacter(characterName);

      if (resData !== null) {
        const newList = [ ...characterList, resData ];
        setCharacterList(newList);

      } else {
        // TODO 스낵바 - 해당 이름의 캐릭터가 없음
      }

    } catch (error) {
      console.error('addMyCharacterFromServer', error);
      // TODO 스낵바
    }
  }

  return (
    <Layout>
      <Box
        sx={{
          padding: '24px 16px'
        }}
      >
        <BoxSection
          sx={{
            width: '1024px',
            padding: '16px',
            marginBottom: '24px'
          }}
        >
          <AddCharacterPanel
            characterNameToAdd={characterNameToAdd}
            onChangeCharacterNameToAdd={(value) => setCharacterNameToAdd(value)}
            onSubmitCharacterName={() => handleSubmitCharacterName(characterNameToAdd)}
          />
        </BoxSection>

        <BoxSection
          sx={{
            width: '1024px',
            padding: '16px',
          }}
        >
          { isLoadedCharacterList === true ? (
            <MyCharacterListPanel
              characterList={characterList}
            />
          ) : (
            <Box>
              {/* TODO 로딩 컴포넌트 */}
              로딩 컴포넌트
            </Box>
          )}
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
    <>
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
    </>
  );
}

function MyCharacterListPanel(
  props: {
    characterList: ResMyCharacterInfo[];
  }
) {
  return (
    <>
      { props.characterList.length > 0 &&
        props.characterList.map(item =>
          <CharacterListItem
            key={item._id}
            name={item.name}
            className={item.className}
          />
        )
      }

      { props.characterList.length === 0 &&
        <Box>
          {/* TODO 엠프티 박스 필요 */}
          엠프티 박스 필요
        </Box>
      }
    </>
  );
}

function CharacterListItem(
  props: {
    name: string;
    className: string;
  }
) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',

        borderBottom: `1px solid ${theme.color.border.default}`,
        padding: '12px 0'
      }}
    >
      <Box>
        드래그핸들
      </Box>

      <Box
        sx={{
          flex: 1
        }}
      >
        <Box>{ props.name }</Box>
        <Box>{ props.className }</Box>
      </Box>

      <Box>
        수정
      </Box>

      <Box>
        삭제
      </Box>
    </Box>
  );
}