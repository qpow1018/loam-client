import { Box, SxProps } from '@mui/material';

import theme from '@/style/theme';

export default function Text(
  props: {
    children: React.ReactNode;
    sx?: SxProps;
  }
) {
  return (
    <Box
      component={'p'}
      sx={[
        {
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx])
      ]}
    >
      { props.children }
    </Box>
  );
}