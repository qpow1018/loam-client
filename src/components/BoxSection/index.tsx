import { Box, SxProps } from '@mui/material';


import theme from '@/style/theme';

export default function BoxSection(
  props: {
    children: React.ReactNode;
    sx?: SxProps;
  }
) {
  return (
    <Box
      sx={[
        {
          borderRadius: theme.common.borderRadius,
          background: theme.color.background.default,
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx])
      ]}
    >
      { props.children }
    </Box>
  );
}