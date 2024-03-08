import { Box } from '@mui/material';

import theme from '@/style/theme';

import Header from '@/components/Header';

export default function Layout(
  props: {
    children: React.ReactNode;
  }
) {
  return (
    <>
      <Header />

      <Box
        sx={{
          minHeight: `calc(100vh - ${theme.size.headerHeight}px)`,
        }}
      >
        { props.children }
      </Box>

    </>
  );
}