'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import theme from '@/style/theme';

import BoxSection from '@/components/BoxSection';
import Text from '@/components/Text';
import Button, { ButtonTheme } from '@/components/Button';
import EmptyBox from '@/components/EmptyBox';
import Modal from '@/components/Modal';

import SectionTitlePanel from '../shared/SectionTitlePanel';
import LoadoMenuButton from '../shared/LoadoMenuButton';

import {
  Settings as SettingsIcon,
  AddCircle as AddCircleIcon,
} from '@mui/icons-material';

export default function MainCharacterSection() {
  const [isLoadoManagementModalOpen, setIsLoadoManagementModalOpen] = useState<boolean>(false);

  return (
    <BoxSection>
      <SectionTitlePanel
        title='캐릭터 단위'
        rightComponent={<>
          <LoadoMenuButton
            onClick={() => setIsLoadoManagementModalOpen(true)}
            iconComponent={<SettingsIcon />}
          >
            할일 관리
          </LoadoMenuButton>

          <LoadoMenuButton
            iconComponent={<AddCircleIcon />}
          >
            캐릭터 추가
          </LoadoMenuButton>
        </>}
      />

      <Box
        sx={{
          padding: '12px',
          display: 'flex',
        }}
      >
        <LoadoInfoPanel />

        <Box>
          캐릭터
        </Box>
      </Box>

      {/* <EmptyBox
      
      /> */}

      { isLoadoManagementModalOpen === true &&
        <LoadoManagementModal
          isOpen={isLoadoManagementModalOpen}
          onClose={() => setIsLoadoManagementModalOpen(false)}
          title={'할일 관리'}
        />
      }

    </BoxSection>
  );
}

function LoadoManagementModal(
  props: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
  }
) {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title={props.title}
      width={900}
    >
      <Box
        sx={{
          padding: '12px'
        }}
      >
        일간 - 종류
        주간 - 종류
      </Box>
    </Modal>
  );
}









function LoadoInfoPanel(
  props: {
  }
) {
  return (
    <Box
      sx={{
        // boxShadow: '0 0 1px #fff',
        width: 120,
      }}
    >
      <LoadoInfoCell text='일단 할일' />

      <LoadoInfoCell text='메모' />
      <LoadoInfoCell text='길드 혈석' />
      <LoadoInfoCell text='에포나' />
      <LoadoInfoCell text='호감도' />
      <LoadoInfoCell text='카오스 던전' />
      <LoadoInfoCell text='가디언 토벌' />

      <LoadoInfoCell text='주간 에포나' />
      <LoadoInfoCell text='혈석 교환' />
      <LoadoInfoCell text='에브니 큐브' />

      <LoadoInfoCell text='엔드컨텐츠1' />
      <LoadoInfoCell text='엔드컨텐츠2' />
      <LoadoInfoCell text='엔드컨텐츠3' />
    </Box>
  );
}

function LoadoInfoCell(
  props: {
    text: string;
  }
) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: 44,
        borderBottom: `1px solid ${theme.color.border.default}`,
        padding: '0 12px',
      }}
    >
      <Text
        sx={{
          fontSize: '0.75rem',
        }}
      >
        { props.text }
      </Text>
    </Box>
  );
}


