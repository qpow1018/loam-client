'use client'

import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import theme from '@/style/theme';

import { loaDB } from '@/libs';
import { LDB_MyCharacterInfo } from '@/types/loaDB';

import Header from '@/components/common/header/Header';
import Button from '@/components/common/button/Button';
import IconButton from '@/components/common/button/IconButton';
import CreateCharacterModal from './CreateCharacterModal';

import styles from './index.module.scss';

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
    <>
      <Header />

      <Box
        sx={{
          padding: '12px'
        }}
      >
        <section className={styles.characterListSection}>
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

          { characterList.length === 0 &&
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: '100px 0',
              }}
            >
              <p className={styles.emptyMessage}>
                내 캐릭터를 추가하세요.
              </p>
            </Box>
          }
        </section>

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
    </>
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
      <p className={styles.listHeaderTitle}>
        { props.title }
      </p>

      <Button
        onClick={props.openCreateCharacterModal}
        theme='bg-pri'
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
        size='small'
        className={styles['unfold-button']}
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
        <div className={styles.profileImage}>
          <img src={props.thumbnail} alt="" />
        </div>

        <Box sx={{ marginLeft: '12px' }}>
          <p className={styles.itemNickname}>
            { props.nickname }
          </p>

          <p className={styles.itemClassName}>
            { props.className }
          </p>
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