import { Box, keyframes } from '@mui/material';

import theme from '@/style/theme';

const spinner = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export default function FixedLoading() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: theme.zIndex.fixedLoading,
        background: theme.color.background.overlay,
      }}
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