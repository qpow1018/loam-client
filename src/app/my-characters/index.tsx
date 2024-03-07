'use client'

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import theme from '@/style/theme';

import API from '@/api';
import { ResMyCharacterInfo } from '@/types/api';

import { utils } from '@/libs';

import Layout from '@/components/Layout';
import BoxSection from '@/components/BoxSection';
import Text from '@/components/Text';
import Button, { ButtonTheme } from '@/components/Button';
import BoxLoading from '@/components/Loading/BoxLoading';
import FixedLoading from '@/components/Loading/FixedLoading';

import SubmitCharacterModal, { SubmitCharacterModalType } from './SubmitCharacterModal';

export default function MyCharacters() {
  const [characterList, setCharacterList] = useState<ResMyCharacterInfo[]>([]);
  const [isLoadedGetCharacterList, setIsLoadedGetCharacterList] = useState<boolean>(false);
  const [characterNameToAdd, setCharacterNameToAdd] = useState<string>('');
  const [isLoadedAddCharacter, setIsLoadedAddCharacter] = useState<boolean>(false);


  const [isSubmitCharacterModalOpen, setIsSubmitCharacterModalOpen] = useState<boolean>(false);
  const [submitCharacterModalType, setSubmitCharacterModalType] = useState<SubmitCharacterModalType | null>(null);


  useEffect(() => {
    setupMyCharacterListFromServer();
  }, []);

  async function setupMyCharacterListFromServer() {
    try {
      // const resData = await API.getMyCharacters();
      // setCharacterList(resData);
      // setIsLoadedGetCharacterList(true);

    } catch (error) {
      console.error('setupMyCharacterListFromServer', error);
      alert('setupMyCharacterListFromServer error');
    }
  }



  function openSubmitCharacterModal(modalType: SubmitCharacterModalType) {
    setSubmitCharacterModalType(modalType);
    setIsSubmitCharacterModalOpen(true);
  }

  function closeSubmitCharacterModal() {
    setSubmitCharacterModalType(null);
    setIsSubmitCharacterModalOpen(false);
  }






  // TODO 궁금증 - 이 함수에 async await을 걸고 안걸고 차이 - 프로세스, 스레드 관련?
  function handleSubmitCharacterName(characterName: string) {
    if (isLoadedAddCharacter === true) {
      return;
    }

    const _characterName = characterName.trim();

    // 글자수 체크
    if (_characterName.length < 2) {
      alert('2글자 이상 입력하세요.');
      return;
    }

    // 중복 체크
    const matchedItemIndex = [ ...characterList ].findIndex(item => item.name === characterName);
    if (matchedItemIndex >= 0) {
      alert('이미 추가된 캐릭터입니다.');
      return;
    }

    addMyCharacterFromServer(_characterName);
  }

  async function addMyCharacterFromServer(characterName: string) {
    setIsLoadedAddCharacter(true);

    await utils.waitFor(250);


    // try {
    //   const resData = await API.addMyCharacter(characterName);

    //   if (resData !== null) {
    //     const newList = [ ...characterList, resData ];
    //     setCharacterList(newList);

    //   } else {
    //     // TODO 스낵바 - 해당 이름의 캐릭터가 없음
    //   }

    // } catch (error) {
    //   console.error('addMyCharacterFromServer', error);
    //   // TODO 스낵바
    // }
  }

  return (
    <Layout>
      <Box
        sx={{
          padding: '12px'
        }}
      >
        <BoxSection
          sx={{
            width: '1024px',
            padding: '16px',
          }}
        >
          <MyCharacterListHeader
            title={'내 캐릭터 목록'}
            openSubmitCharacterModal={() => openSubmitCharacterModal(SubmitCharacterModalType.create)}
          />




          { isLoadedGetCharacterList === true ? (
            <MyCharacterListBody
              characterList={characterList}
            />
          ) : (
            <BoxLoading />
          )}
        </BoxSection>

        { (isSubmitCharacterModalOpen === true && submitCharacterModalType !== null) &&
          <SubmitCharacterModal
            isOpen={isSubmitCharacterModalOpen}
            onClose={closeSubmitCharacterModal}
            title={
              submitCharacterModalType === SubmitCharacterModalType.create
              ? '캐릭터 추가하기'
              : '캐릭터 수정하기'
            }
            modalType={submitCharacterModalType}
          />
        }


        { isLoadedAddCharacter === true &&
          <FixedLoading />
        }
      </Box>
    </Layout>
  );
}

function MyCharacterListHeader(
  props: {
    title: string;
    openSubmitCharacterModal: () => void;
  }
) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '12px',
        borderBottom: `1px solid ${theme.color.border.default}`,
      }}
    >
      <Text
        sx={{
          fontSize: '0.875rem',
          fontWeight: 500,
        }}
      >
        { props.title }
      </Text>

      <Button
        onClick={props.openSubmitCharacterModal}
        theme={ButtonTheme.bgPri}
      >
        추가히기
      </Button>
    </Box>
  );
}





function MyCharacterListBody(
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