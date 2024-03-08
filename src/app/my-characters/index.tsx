'use client'

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import theme from '@/style/theme';

import { utils, loaDB } from '@/libs';
import { LDB_MyCharacterInfo } from '@/types/loaDB';

import Layout from '@/components/Layout';
import BoxSection from '@/components/BoxSection';
import Text from '@/components/Text';
import Button, { ButtonTheme } from '@/components/Button';
import IconButton from '@/components/Button/IconButton';

import SubmitCharacterModal, { SubmitCharacterModalType } from './SubmitCharacterModal';

import {
  UnfoldMore as UnfoldMoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

export default function MyCharacters() {
  const [characterList, setCharacterList] = useState<LDB_MyCharacterInfo[]>([]);
  const [isSubmitCharacterModalOpen, setIsSubmitCharacterModalOpen] = useState<boolean>(false);
  const [submitCharacterModalType, setSubmitCharacterModalType] = useState<SubmitCharacterModalType | null>(null);

  useEffect(() => {
    setupMyCharacterList();
  }, []);

  function setupMyCharacterList() {
    const myCharacters = loaDB.getMyCharacters();
    setCharacterList(myCharacters);
  }

  function openSubmitCharacterModal(modalType: SubmitCharacterModalType) {
    setSubmitCharacterModalType(modalType);
    setIsSubmitCharacterModalOpen(true);
  }

  function closeSubmitCharacterModal() {
    setSubmitCharacterModalType(null);
    setIsSubmitCharacterModalOpen(false);
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

  function createMyCharacter(nickname: string, classValue: string | null) {
    try {
      const _nickname = nickname.trim();
      checkValidNickname(_nickname);
      checkDuplicatedNickname(_nickname);
      checkValidClassValue(classValue);

      loaDB.addMyCharacter(nickname, classValue!);

      setupMyCharacterList();
      closeSubmitCharacterModal();

    } catch (error: any) {
      alert(error.message);
    }
  }



  // TODO
  function handleClickMoveButton() {

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
            openSubmitCharacterModal={() => openSubmitCharacterModal(SubmitCharacterModalType.create)}
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
                />
              );
            })
          }

          { characterList.length === 0 &&
            <Box>
              {/* TODO 엠프티 박스 필요 */}
              엠프티 박스 필요
            </Box>
          }
        </BoxSection>

        { (isSubmitCharacterModalOpen === true && submitCharacterModalType !== null) &&
          <SubmitCharacterModal
            isOpen={isSubmitCharacterModalOpen}
            onClose={closeSubmitCharacterModal}
            modalType={submitCharacterModalType}
            createMyCharacter={(nickname, classValue) => createMyCharacter(nickname, classValue)}


            updateMyCharacter={(nickname, classValue) => createMyCharacter(nickname, classValue)}
          />
        }
      </Box>
    </Layout>
  );
}

function CharacterListHeader(
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
        <Box
          sx={{
            borderRadius: '50%',
            width: 36,
            height: 36,
            background: '#333',
            marginRight: '8px'
          }}
        ></Box>

        <Box>
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
        onClick={props.onClickMoveButton}
      >
        <EditIcon />
      </IconButton>

      <IconButton
        onClick={props.onClickMoveButton}
        sx={{
          marginLeft: '8px'
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}