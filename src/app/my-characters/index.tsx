'use client'

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import theme from '@/style/theme';

import { loaDB } from '@/libs';
import { LDB_MyCharacterInfo } from '@/types/loaDB';

import Layout from '@/components/Layout';
import BoxSection from '@/components/BoxSection';
import Text from '@/components/Text';
import Button, { ButtonTheme } from '@/components/Button';
import IconButton from '@/components/Button/IconButton';
import ProfileImage from '@/components/ProfileImage';
import EmptyBox from '@/components/EmptyBox';

import CreateCharacterModal from './CreateCharacterModal';

import {
  UnfoldMore as UnfoldMoreIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

export default function MyCharacters() {
  const [characterList, setCharacterList] = useState<LDB_MyCharacterInfo[]>([]);
  const [isCreateCharacterModalOpen, setIsCreateCharacterModalOpen] = useState<boolean>(false);
  const [nicknameToCreate, setNicknameToCreate] = useState<string>('');
  const [classValueToCreate, setClassValueToCreate] = useState<string | null>(null);

  useEffect(() => {
    setupMyCharacterList();
  }, []);

  function setupMyCharacterList() {
    const myCharacters = loaDB.getMyCharacters();
    setCharacterList(myCharacters);
  }

  function openCreateCharacterModal() {
    setIsCreateCharacterModalOpen(true);
  }

  function closeSubmitCharacterModal() {
    setNicknameToCreate('');
    setClassValueToCreate(null);
    setIsCreateCharacterModalOpen(false);
  }

  function checkValidNickname(nickname: string) {
    if (nickname.length < 2) {
      throw new Error('2글자 이상 입력하세요.');
    }
  }

  function checkDuplicatedNickname(nickname: string) {
    const isMatchedIndex = [ ...characterList ].findIndex(item => item.nickname === nickname);
    if (isMatchedIndex >= 0) {
      throw new Error('이미 추가된 캐릭터입니다.');
    }
  }

  function checkValidClassValue(classValue: string | null) {
    if (classValue === null) {
      throw new Error('클래스를 선택하세요.');
    }
  }

  function createMyCharacter() {
    try {
      const _nickname = nicknameToCreate.trim();
      checkValidNickname(_nickname);
      checkDuplicatedNickname(_nickname);
      checkValidClassValue(classValueToCreate);

      loaDB.addMyCharacter(_nickname, classValueToCreate!);

      setupMyCharacterList();
      closeSubmitCharacterModal();

    } catch (error: any) {
      alert(error.message);
    }
  }

  // TODO
  function openDeleteCharacterDialog() {
    alert('삭제');
  }

  // TODO
  function handleClickMoveButton() {
    alert('순서 변경');
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
          <CharacterListHeader
            title={'내 캐릭터 목록'}
            openCreateCharacterModal={openCreateCharacterModal}
          />

          { characterList.length > 0 &&
            characterList.map(item => {
              const classData = loaDB.getClassInfo(item.classValue);
              return (
                <CharacterListItem
                  key={item.id}
                  nickname={item.nickname}
                  className={classData.label}
                  thumbnail={classData.imageUrl}
                  onClickMoveButton={handleClickMoveButton}
                  onClickDeleteButton={openDeleteCharacterDialog}
                />
              );
            })
          }

          { characterList.length !== 0 &&
            <EmptyBox
              text='내 캐릭터를 추가하세요.'
            />
          }
        </BoxSection>

        { isCreateCharacterModalOpen === true &&
          <CreateCharacterModal
            isOpen={isCreateCharacterModalOpen}
            onClose={closeSubmitCharacterModal}
            nickname={nicknameToCreate}
            onChangeNickname={(value) => setNicknameToCreate(value)}
            classValue={classValueToCreate}
            onChangeClassValue={(value) => setClassValueToCreate(value)}
            createMyCharacter={createMyCharacter}
          />
        }
      </Box>
    </Layout>
  );
}

function CharacterListHeader(
  props: {
    title: string;
    openCreateCharacterModal: () => void;
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
        onClick={props.openCreateCharacterModal}
        theme={ButtonTheme.bgPri}
      >
        추가하기
      </Button>
    </Box>
  );
}

function CharacterListItem(
  props: {
    nickname: string;
    className: string;
    thumbnail: string;
    onClickMoveButton: () => void;
    onClickDeleteButton: () => void;
  }
) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderBottom: `1px solid ${theme.color.border.dark}`,
        padding: '12px 0'
      }}
    >
      <IconButton
        onClick={props.onClickMoveButton}
        buttonSize={32}
        iconSize={16}
        sx={{
          backgroundColor: 'transparent',
        }}
      >
        <UnfoldMoreIcon />
      </IconButton>

      <Box
        sx={{
          flex: 1,
          margin: '0 12px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <ProfileImage
          url={props.thumbnail}
        />

        <Box sx={{ marginLeft: '12px' }}>
          <Text
            sx={{
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            { props.nickname }
          </Text>

          <Text
            sx={{
              fontSize: '0.75rem',
              color: theme.color.text.secondary,
            }}
          >
            { props.className }
          </Text>
        </Box>
      </Box>

      <IconButton
        onClick={props.onClickDeleteButton}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}