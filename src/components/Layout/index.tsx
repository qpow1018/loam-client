import { Box } from '@mui/material';

import Header from '@/components/Header';

export default function Layout(
  props: {
    children: React.ReactNode;
  }
) {
  return (
    <Box
      
    >
      <Header />

      { props.children }
    </Box>
  );
}