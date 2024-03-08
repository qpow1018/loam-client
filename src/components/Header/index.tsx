import Link from 'next/link';
import { Box, ButtonBase } from '@mui/material';

import theme from '@/style/theme';

export default function Header() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        height: `${theme.size.headerHeight}px`,
        backgroundColor: theme.color.background.default,
      }}
    >
      <Logo />
      <Navigation />
      <SubMenu />
    </Box>
  );
}

function Logo() {
  return (
    <Box
      sx={{
        boxShadow: '0 0 1px red',
        marginRight: '24px'
      }}
    >
      LoaM
    </Box>
  );
}

function Navigation() {
  return (
    <Box
      sx={{
        boxShadow: '0 0 1px red',
        flex: 1,
      }}
    >
      <NavigationLink
        link='/loado'
        text='할일'
      />
      <NavigationLink
        link='/my-characters'
        text='내 캐릭터'
      />
    </Box>
  );
}

function NavigationLink(
  props: {
    link: string;
    text: string;
  }
) {
  return (
    <ButtonBase
      sx={{
        width: '90px',
        height: 32,
        background: 'red',
        marginRight: '12px',
      }}
    >
      <Link href={props.link}>
        { props.text }
      </Link>
    </ButtonBase>
  );
}

function SubMenu() {
  return (
    <Box
      sx={{
        boxShadow: '0 0 1px red'
      }}
    >
      서브메뉴
    </Box>
  );
}