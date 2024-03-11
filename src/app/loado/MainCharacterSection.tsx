import { Box } from '@mui/material';
import theme from '@/style/theme';

import BoxSection from '@/components/BoxSection';
import Text from '@/components/Text';
import Button, { ButtonTheme } from '@/components/Button';
import EmptyBox from '@/components/EmptyBox';

import SectionTitlePanel from './components/SectionTitlePanel';
import LoadoMenuButton from './components/LoadoMenuButton';

export default function MainCharacterSection() {
  return (
    <BoxSection>
      <SectionTitlePanel
        title='캐릭터 단위'
        rightComponent={<>
          <LoadoMenuButton>
            할일 관리
          </LoadoMenuButton>

          <LoadoMenuButton>
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
    </BoxSection>
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
        width: 150,
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