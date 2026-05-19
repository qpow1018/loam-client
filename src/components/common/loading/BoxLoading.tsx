import { Box, keyframes, SxProps } from '@mui/material';

import theme from '@/style/theme';

const spinner = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export default function BoxLoading(
  props: {
    sx?: SxProps;
  }
) {
  return (
    <Box
      sx={[
        {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '360px',
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx])
      ]}
    >
      <Box
        sx={{
          display: 'block',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          borderWidth: '4px',
          borderStyle: 'solid',
          borderColor: `${theme.color.border.light} transparent transparent transparent`,
          animation: `${spinner} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite`,
        }}
      />
    </Box>
  );
}